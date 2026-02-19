from fastapi import APIRouter, Request, Response

router = APIRouter()

@router.post("/passthrough")
async def passthrough(request: Request):
    data = await request.body()
    content_type = request.headers.get("content-type", "application/octet-stream")
    return Response(content=data, media_type=content_type)
