from fastapi import APIRouter, Body, Response
import io
from PIL import Image

router = APIRouter()

@router.post("/grayscale")
async def grayscale(file: bytes = Body(...)):
    img = Image.open(io.BytesIO(file)).convert("L")
    out_bytes = io.BytesIO()
    img.save(out_bytes, format="JPEG")
    out_bytes.seek(0)
    return Response(content=out_bytes.getvalue(), media_type="image/jpeg")
