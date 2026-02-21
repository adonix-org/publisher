from fastapi import APIRouter, Body
from schemas import ImageFrame

router = APIRouter()

@router.post("/passthrough")
async def passthrough(frame: ImageFrame):
    return frame

