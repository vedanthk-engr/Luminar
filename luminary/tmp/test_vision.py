import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv('backend/.env')
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Try Llama 4 Scout
model = "meta-llama/llama-4-scout-17b-16e-instruct"
# Red dot image
red_dot = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="

print(f"Testing model: {model}")
try:
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{red_dot}"}},
                    {"type": "text", "text": "Describe this image"}
                ]
            }
        ]
    )
    print("SUCCESS:", resp.choices[0].message.content)
except Exception as e:
    print("FAILED:", str(e))
