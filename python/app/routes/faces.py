from fastapi import APIRouter
from models import ImageFrame, Annotation
from PIL import Image, ImageDraw
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
    # Convert buffer to OpenCV image
    img = np.array(Image.open(io.BytesIO(frame.image.buffer)).convert("RGB"))[:, :, ::-1]
    (h, w) = img.shape[:2]

    # Prepare blob for the DNN
    blob = cv2.dnn.blobFromImage(img, 1.0, (300, 300), (104.0, 177.0, 123.0))
    net.setInput(blob)
    detections = net.forward()

    frame.annotations = []

    # Confidence threshold
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.5:  # adjust threshold for more/less sensitivity
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x1, y1, x2, y2) = box.astype("int")
            frame.annotations.append(Annotation(
                x=int(x1),
                y=int(y1),
                width=int(x2 - x1),
                height=int(y2 - y1),
                label="face"
            ))

    return frame

@router.post("/outline_faces")
async def faces_drawn(frame: ImageFrame):
    # Load image from buffer
    img = Image.open(io.BytesIO(frame.image.buffer)).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Draw rectangles for each annotation
    for ann in frame.annotations:
        x, y, w, h = ann.x, ann.y, ann.width, ann.height
        draw.rectangle([x, y, x + w, y + h], outline="red", width=2)

    # Save back to buffer
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    frame.image.buffer = buffer.getvalue()

    return frame
