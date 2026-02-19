from fastapi import FastAPI, Request, Response, Body
import io
from PIL import Image
import uvicorn

app = FastAPI()

@app.post("/passthrough")
async def noop(request: Request):
    data = await request.body()
    content_type = request.headers.get("content-type", "application/octet-stream")
    return Response(content=data, media_type=content_type)

@app.post("/grayscale")
async def grayscale(file: bytes = Body(...)):
    img = Image.open(io.BytesIO(file)).convert("L")  # 'L' = grayscale
    out_bytes = io.BytesIO()
    img.save(out_bytes, format="JPEG")
    out_bytes.seek(0)
    return Response(content=out_bytes.getvalue(), media_type="image/jpeg")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8120)
