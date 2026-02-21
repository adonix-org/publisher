from pydantic import Base64Bytes, BaseModel
from typing import List

SUPPORTED_VERSION = 1

class Annotation(BaseModel):
    label: str
    x: int
    y: int
    width: int
    height: int

class ImageBuffer(BaseModel):
    contentType: str
    buffer: Base64Bytes

class ImageFrame(BaseModel):
    version: int
    image: ImageBuffer
    annotations: List[Annotation]
