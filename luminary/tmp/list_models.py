import os
from google import genai
from dotenv import load_dotenv

load_dotenv('backend/.env')

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

print(f"Listing models in project: {PROJECT_ID}, location: {LOCATION}", flush=True)

client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=LOCATION
)

try:
    models = client.models.list()
    # Cast models to list because it's a generator/page
    model_list = list(models)
    print(f"Total models found: {len(model_list)}", flush=True)
    for m in model_list:
        if 'image' in m.name.lower() or 'gen' in m.name.lower() or 'flash' in m.name.lower():
            print(f"- {m.name} (input: {m.input_modalities}, output: {m.output_modalities})", flush=True)
except Exception as e:
    print(f"ERROR: {str(e)}", flush=True)
