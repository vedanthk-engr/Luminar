import os
import base64
import asyncio
import uuid
import traceback
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()
# ... (rest of the file with traceback in catch)

router = APIRouter(prefix="/api/veo", tags=["veo-video"])

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

# Initialize the Gen AI client with Vertex AI
# We use a factory function to handle cases where credentials might be missing
def get_veo_client():
    try:
        return genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=LOCATION
        )
    except Exception as e:
        print(f"Veo Client Init Error: {e}")
        return None

client = get_veo_client()

class VideoRequest(BaseModel):
    prompt: str
    duration: int = 4  # 4, 6, or 8 seconds
    aspect_ratio: str = "16:9"  # "16:9" or "9:16"

# Store generated videos in memory (keyed by job_id)
video_store = {}

@router.get("/auth-check")
async def auth_check():
    """Verify if the server can authenticate with GCP."""
    try:
        # Re-init client to check for fresh creds
        test_client = get_veo_client()
        if not test_client:
            return {"status": "error", "message": "Failed to initialize Vertex AI client. Check your credentials."}
        
        # Try a no-op call or check for project
        return {
            "status": "ok", 
            "project_id": PROJECT_ID,
            "location": LOCATION,
            "auth_method": "Application Default Credentials (ADC)" if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS") else "Service Account Key"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/generate-video")
async def generate_video(req: VideoRequest):
    """Start a Veo 3 video generation job. Returns a job_id to poll."""
    if not req.prompt.strip():
        raise HTTPException(400, "Prompt is required")
    
    job_id = str(uuid.uuid4())[:8]
    
    # Run generation in background
    asyncio.create_task(_generate_video(job_id, req))
    
    return {"job_id": job_id, "status": "generating", "message": "Video generation started. Poll /api/veo/status/{job_id} for updates."}

async def _generate_video(job_id: str, req: VideoRequest):
    """Background task to generate video via Veo 3."""
    video_store[job_id] = {"status": "generating", "progress": "Initializing Veo 3..."}
    
    try:
        # Get a fresh client or use the global one
        active_client = get_veo_client()
        if not active_client:
            video_store[job_id] = {"status": "error", "error": "Vertex AI client not initialized (Client is None). Please check your GCP credentials."}
            return

        if not hasattr(active_client, 'models') or active_client.models is None:
            video_store[job_id] = {"status": "error", "error": "CRITICAL: 'client.models' is None. Possible SDK version mismatch or init error."}
            return

        video_store[job_id]["progress"] = "Sending prompt to Veo 3..."
        
        # Call Veo 3 via the genai SDK
        # Operation is blocking, so we run in a thread
        def run_gen():
            try:
                # Check for the correct method name
                method = getattr(active_client.models, 'generate_videos', None)
                if not method:
                    # Fallback to singular name if plural fails
                    method = getattr(active_client.models, 'generate_video', None)
                
                if not method:
                    raise Exception("Could not find 'generate_videos' or 'generate_video' method on client.models")
                
                return method(
                    model="veo-3.0-generate-preview",
                    prompt=req.prompt,
                    config=genai.types.GenerateVideosConfig(
                        aspect_ratio=req.aspect_ratio,
                        number_of_videos=1,
                    )
                )
            except Exception as inner_e:
                print(f"DEBUG: Gen call error: {inner_e}")
                raise inner_e

        operation = await asyncio.to_thread(run_gen)
        
        if operation is None:
            video_store[job_id] = {"status": "error", "error": "Veo 3 operation returned None. Check prompt safety or GCP project status."}
            return

        video_store[job_id]["progress"] = "Veo 3 is rendering your video... (this takes 2-5 minutes)"
        
        # Wait for the operation to complete
        def wait_for_result():
            try:
                op_name = getattr(operation, 'name', None)
                if not op_name:
                    # If it's not a Vertex AI operation, maybe it has a result method?
                    if hasattr(operation, 'result') and callable(operation.result):
                        return operation.result()
                    return operation

                print(f"DEBUG: Waiting for operation: {op_name}")
                
                # Poll for completion
                max_retries = 100 # ~10 mins max
                for i in range(max_retries):
                    current_op = active_client.operations.get(operation)
                    
                    if current_op.done:
                        if hasattr(current_op, 'result'):
                            return current_op.result
                        return current_op
                    
                    # Update progress in memory
                    video_store[job_id]["progress"] = f"Veo 3 is rendering... ({i*5}s elapsed)"
                    time.sleep(5)
                
                raise Exception("Timed out waiting for Veo 3 to render video.")
            except Exception as wait_e:
                print(f"DEBUG: Wait error: {wait_e}")
                raise wait_e

        # Need to import time in the router or file
        result = await asyncio.to_thread(wait_for_result)
        print(f"DEBUG: Full result: {repr(result)}")
        
        if not result:
            video_store[job_id] = {"status": "error", "error": "Veo 3 returned None (no result object)."}
            return

        if result and hasattr(result, 'generated_videos') and result.generated_videos:
            video_obj = result.generated_videos[0].video
            # The correct attribute in this SDK version is video_bytes
            video_data = getattr(video_obj, 'video_bytes', None)
            
            if not video_data:
                video_store[job_id] = {"status": "error", "error": "Veo 3 returned a video but no video_bytes data was found."}
                return

            video_b64 = base64.b64encode(video_data).decode("utf-8")
            
            video_store[job_id] = {
                "status": "done",
                "video_b64": video_b64,
                "mime_type": "video/mp4",
                "duration": req.duration
            }
        else:
            error_info = "Veo 3 returned no videos."
            if hasattr(result, 'filtering_metadata'):
                error_info += f" (Safety/Filtering: {result.filtering_metadata})"
            video_store[job_id] = {"status": "error", "error": f"{error_info} Type: {type(result)}"}
            return
    
    except Exception as e:
        error_msg = f"GEN_FATAL: {str(e)}"
        stack_trace = traceback.format_exc()
        print(f"DEBUG: {error_msg}")
        print(f"DEBUG STACK: {stack_trace}")
        video_store[job_id] = {"status": "error", "error": error_msg}

@router.get("/status/{job_id}")
async def check_status(job_id: str):
    """Poll the status of a video generation job."""
    if job_id not in video_store:
        raise HTTPException(404, "Job not found")
    
    job = video_store[job_id]
    
    if job["status"] == "done":
        return {
            "status": "done",
            "video_b64": job["video_b64"],
            "mime_type": job["mime_type"]
        }
    elif job["status"] == "error":
        return {"status": "error", "error": job["error"]}
    else:
        return {"status": "generating", "progress": job.get("progress", "Working...")}
