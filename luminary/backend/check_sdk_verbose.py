import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

print(f"Project: {PROJECT_ID}, Location: {LOCATION}")

try:
    print("Initializing client...")
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    print(f"Client: {type(client)}")
    
    print(f"Models: {type(client.models)}")
    
    # Try to find the method
    method_name = "generate_videos"
    method = getattr(client.models, method_name, None)
    if not method:
        method_name = "generate_video"
        method = getattr(client.models, method_name, None)
    
    print(f"Found method: {method_name} - {type(method)}")
    
    if method:
        print("Attempting to call method with minimal config...")
        # Just test if the call itself works (not the full generation)
        # We use a dummy prompt
        try:
             # Just print dir of models to see what's available
             print(f"Available methods on models: {[m for m in dir(client.models) if not m.startswith('_')]}")
             
             # Actually try the config
             print(f"GenAI types: {dir(genai.types) if hasattr(genai, 'types') else 'No types'}")
             
        except Exception as e:
            print(f"Inner Error: {e}")
            
except Exception as e:
    print(f"CRITICAL ERROR: {type(e).__name__}: {e}")
