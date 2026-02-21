from fastapi import APIRouter
from models import ImageFrame
from PIL import Image, ImageDraw, ImageFont
import io

router = APIRouter()

@router.post("/outline")
async def outline_annotations(frame: ImageFrame):
    if not frame.annotations:
        return frame

    # Load image
    img = Image.open(io.BytesIO(frame.image.buffer)).convert("RGB")
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("Arial.ttf", size=28)
    except OSError:
        # fallback if Arial is not available
        font = ImageFont.load_default()

    for ann in frame.annotations:
        x, y, w, h = ann.x, ann.y, ann.width, ann.height

        # Draw rectangle
        draw.rectangle([x, y, x + w, y + h], outline="red", width=2)

        # Draw label + confidence
        conf_percent = f"{int(ann.confidence * 100)}%" if hasattr(ann, "confidence") else ""
        text = f"{ann.label} {conf_percent}".strip()

        # position above rectangle, avoid negative y
        text_x, text_y = x, max(y - 10, 0)

        draw.text(
            (text_x, text_y - 20),
            text,
            fill="white",
            font=font,
            stroke_width=2,
            stroke_fill="black"
        )

    # Save updated image back into buffer
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    frame.image.buffer = buffer.getvalue()
    frame.image.contentType = "image/jpeg"

    return frame
