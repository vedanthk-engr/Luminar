import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

try:
    print("--- GenAI Client Inspection ---")
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    
    print(f"Client: {type(client)}")
    print(f"Client Attributes: {[attr for attr in dir(client) if not attr.startswith('_')]}")
    
    if hasattr(client, 'models'):
        print(f"Models: {type(client.models)}")
        print(f"Models Attributes: {[attr for attr in dir(client.models) if not attr.startswith('_')]}")

    # Check for operations attribute
    if hasattr(client, 'operations'):
        print(f"Operations Service found: {type(client.operations)}")
        print(f"Operations Attributes: {[attr for attr in dir(client.operations) if not attr.startswith('_')]}")

except Exception as e:
    print(f"Inspection failed: {e}")
