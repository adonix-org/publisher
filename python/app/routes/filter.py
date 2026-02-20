from fastapi import APIRouter, Body, Response
import io
from PIL import Image

router = APIRouter()

@router.post("/filter")
async def filter(file: bytes = Body(...)):
    return Response(status_code=204)
