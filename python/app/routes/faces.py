from fastapi import APIRouter
from models import ImageFrame, Annotation
from PIL import Image, ImageDraw, ImageFont
import io
import cv2
import numpy as np

router = APIRouter()

# Load DNN face detector model
proto_path = "/Users/tybusby/Work/publisher/python/app/models/deploy.prototxt"
model_path = "/Users/tybusby/Work/publisher/python/app/models/res10_300x300_ssd_iter_140000_fp16.caffemodel"
net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

@router.post("/detect_faces")
async def faces_dnn(frame: ImageFrame):
    img = np.array(Image.open(io.BytesIO(frame.image.buffer)).convert("RGB"))[:, :, ::-1]
    (h, w) = img.shape[:2]

    # Prepare blob for the DNN
    blob = cv2.dnn.blobFromImage(img, 1.0, (300, 300), (104.0, 177.0, 123.0))
    net.setInput(blob)
    detections = net.forward()

    frame.annotations = []

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (x1, y1, x2, y2) = box.astype("int")
        frame.annotations.append(Annotation(
            x=int(x1),
            y=int(y1),
            width=int(x2 - x1),
            height=int(y2 - y1),
            label="face",
            confidence=confidence
        ))

    return frame

@router.post("/outline_faces")
async def faces_drawn(frame: ImageFrame):
    has_face = any(
        getattr(ann, "label", "").lower() == "face"
        for ann in frame.annotations
    )
    if not has_face:
        return frame

    img = Image.open(io.BytesIO(frame.image.buffer)).convert("RGB")
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("Arial.ttf", size=28)

    for ann in frame.annotations:
        if getattr(ann, "label", "").lower() != "face":
            continue

        x, y, w, h = ann.x, ann.y, ann.width, ann.height
        draw.rectangle([x, y, x + w, y + h], outline="red", width=2)

        # Draw label + confidence
        conf_percent = f"{int(ann.confidence * 100)}%" if hasattr(ann, "confidence") else ""
        text = f"face {conf_percent}"
        text_x, text_y = x, max(y - 10, 0)  # position above rectangle

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
