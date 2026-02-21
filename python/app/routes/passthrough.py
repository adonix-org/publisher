from fastapi import APIRouter, Body
from models import ImageFrame

router = APIRouter()

@router.post("/passthrough")
async def passthrough(frame: ImageFrame):
    return frame

