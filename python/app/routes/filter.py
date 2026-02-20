from typing import Annotated
from fastapi import APIRouter, Body, Response

router = APIRouter()

@router.post("/filter")
async def filter(file: Annotated[bytes, Body(...)]):
    return Response(status_code=204)
