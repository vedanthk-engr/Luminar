import os
import inspect
from google import genai
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

try:
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    print(f"Operations.get signature: {inspect.signature(client.operations.get)}")
except Exception as e:
    print(f"Inspection failed: {e}")
