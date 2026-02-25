from fastapi import APIRouter, Query
from schemas import ImageFrame
from typing import Annotated
from PIL import Image, ImageDraw, ImageFont
import io

router = APIRouter()

@router.post("/outline")
async def outline_annotations(
    frame: ImageFrame,
    color: Annotated[str, Query(description="Outline color")] = "yellow",
    width: Annotated[int, Query(description="Outline width")] = 2
):
    if not frame.annotations:
        return frame

    img = Image.open(io.BytesIO(frame.image.buffer)).convert("RGB")
    draw = ImageDraw.Draw(img)

    for ann in frame.annotations:
        x, y, w, h = ann.x, ann.y, ann.width, ann.height
        draw.rectangle([x, y, x + w, y + h], outline=color, width=width)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    frame.image.buffer = buffer.getvalue()
    frame.image.contentType = "image/jpeg"

    return frame


@router.post("/label")
async def label_annotations(
    frame: ImageFrame,
    font_size: Annotated[int, Query(description="Font size for labels")] = 28
):
    if not frame.annotations:
        return frame

    img = Image.open(io.BytesIO(frame.image.buffer)).convert("RGB")
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("Arial.ttf", size=font_size)
    except OSError:
        font = ImageFont.load_default()

    for ann in frame.annotations:
        x, y = ann.x, ann.y

        conf_percent = f"{int(ann.confidence * 100)}%" if hasattr(ann, "confidence") else ""
        text = f"{ann.label} {conf_percent}".strip()

        text_x, text_y = x, max(y - 10, 0)

        draw.text(
            (text_x, text_y - 20),
            text,
            fill="white",
            font=font,
            stroke_width=2,
            stroke_fill="black"
        )

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    frame.image.buffer = buffer.getvalue()
    frame.image.contentType = "image/jpeg"

    return frame
