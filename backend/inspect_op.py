import os
from google import genai
from dotenv import load_dotenv
import time

load_dotenv()

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

try:
    print("Initializing client...")
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    
    print("Starting generation (this might fail if project isn't ready, but we just want the object type)...")
    try:
        operation = client.models.generate_videos(
            model="veo-3.0-generate-preview",
            prompt="A small test",
            config={'aspect_ratio': "16:9"}
        )
        print(f"Operation Type: {type(operation)}")
        print(f"Operation Dir: {[m for m in dir(operation) if not m.startswith('_')]}")
        
        # Check if it has 'wait' or 'result' as method
        for attr in ['wait', 'result', 'get_result', 'refresh']:
            val = getattr(operation, attr, "MISSING")
            print(f"Attr '{attr}': {type(val)} ({val})")
            
    except Exception as e:
        print(f"Gen call error (expected if not authed): {e}")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
