import os
try:
    from google import genai
    from google.auth import default
    
    # Try to get default credentials
    creds, project = default()
    print(f"Credentials found for project: {project}")
    
    # Try to init client
    client = genai.Client(vertexai=True, project=project or "luminar-491118", location="us-central1")
    print("Successfully initialized GenAI Client!")
    
except Exception as e:
    print(f"ERROR: {e}")
    print("\nSUGGESTION: Run 'gcloud auth application-default login' in your terminal.")
