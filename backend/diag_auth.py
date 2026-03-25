import os
import subprocess
from pathlib import Path

print("--- GCP AUTH DIAGNOSTIC ---")

# 1. Check if gcloud is in PATH
try:
    gcloud_path = subprocess.check_output(["where", "gcloud"], text=True).strip()
    print(f"gcloud found at: {gcloud_path}")
except:
    print("gcloud NOT in PATH")

# 2. Probe common ADC locations
possible_paths = [
    Path.home() / "AppData/Roaming/gcloud/application_default_credentials.json",
    Path.home() / ".config/gcloud/application_default_credentials.json",
    Path(os.environ.get("APPDATA", "")) / "gcloud/application_default_credentials.json"
]

found = False
for p in possible_paths:
    if p.exists():
        print(f"SUCCESS: Found ADC file at: {p}")
        found = True
        break

if not found:
    print("FAILED: Could not find application_default_credentials.json in standard locations.")
    print("TIP: Ensure you ran 'gcloud auth application-default login' (NOT just 'gcloud auth login')")

# 3. Check environment
print(f"GOOGLE_APPLICATION_CREDENTIALS: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'Not Set')}")
print(f"GCP_PROJECT_ID: {os.environ.get('GCP_PROJECT_ID', 'Not Set')}")
