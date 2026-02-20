from fastapi import APIRouter, Body
from models import ImageFrame
from PIL import Image
import io

router = APIRouter()

@router.post("/grayscale")
async def grayscale(frame: ImageFrame):
    source = Image.open(io.BytesIO(frame.image.buffer))
    gray = source.convert("L")

    buffer = io.BytesIO()
    gray.save(buffer, format="JPEG")
    bytes_ = buffer.getvalue()

    frame.image.buffer = bytes_
    return frame

@router.post("/passthrough")
async def passthrough(frame: ImageFrame):
    return frame

