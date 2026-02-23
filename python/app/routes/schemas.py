from pydantic import Base64Bytes, BaseModel, Field
from typing import List, Literal

SUPPORTED_VERSION = 1

class Annotation(BaseModel):
    label: str
    x: int
    y: int
    width: int
    height: int
    confidence: float = Field(ge=0.0, le=1.0)

class ImageBuffer(BaseModel):
    contentType: str
    buffer: Base64Bytes

class ImageFrame(BaseModel):
    image: ImageBuffer
    seek: float
    version: Literal[1] = SUPPORTED_VERSION
    annotations: List[Annotation]
