import os
import base64
from google import genai
from dotenv import load_dotenv

load_dotenv('backend/.env')
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "luminar-18")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=LOCATION
)

prompt = "A high-fidelity cinematic film still of a futuristic cyberpunk city at night with neon lights and flying cars, 8k resolution, photorealistic."
print(f"Testing Imagen 3 with prompt: {prompt}", flush=True)

try:
    # Try the alternate production model ID
    model_id = "imagen-3"
    print(f"Attempting model: {model_id}", flush=True)
    response = client.models.generate_images(
        model=model_id,
        prompt=prompt,
        config=genai.types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="16:9",
            output_mime_type="image/jpeg"
        )
    )

    if response.generated_images:
        img_obj = response.generated_images[0]
        img_bytes = getattr(img_obj, 'image_bytes', None)
        if img_bytes:
            with open("tmp/test_image.jpg", "wb") as f:
                f.write(img_bytes)
            print("SUCCESS: Image saved to tmp/test_image.jpg")
            print(f"Image size: {len(img_bytes)} bytes")
        else:
            print("FAILED: No image_bytes found in response object.")
            print("Object attributes:", dir(img_obj))
    else:
        print("FAILED: No images returned in response.")
except Exception as e:
    print("FAILED:", str(e))
