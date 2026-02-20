import os
import sys
import importlib.util
from fastapi import FastAPI

app = FastAPI(title="Pythonic Worker")

# Get the directory where server.py actually lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add that folder to sys.path so imports work
sys.path.insert(0, BASE_DIR)

# Loop over all .py files in that folder except server.py and __init__.py
for filename in os.listdir(BASE_DIR):
    if filename.endswith(".py") and filename not in ("pyserver.py", "__init__.py"):
        module_name = filename[:-3]
        module_path = os.path.join(BASE_DIR, filename)

        spec = importlib.util.spec_from_file_location(module_name, module_path)
        if spec and spec.loader:
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            if hasattr(module, "router"):
                app.include_router(module.router)
                print(f"Mounted router from {filename}")
            else:
                print(f"No router found in {filename}")
        else:
            print(f"Failed to load module {filename}")

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run(app, host="127.0.0.1", port=8120, log_level="debug")
