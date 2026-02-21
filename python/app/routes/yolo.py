from fastapi import APIRouter
from schemas import Annotation, ImageFrame
from ultralytics import YOLO
from PIL import Image
import io
import numpy as np

router = APIRouter()

model = YOLO("python/app/models/yolov8s.pt")

@router.post("/yolo")
async def yolo(frame: ImageFrame):
    image = np.array(Image.open(io.BytesIO(frame.image.buffer)).convert("RGB"))

    results = model(image)
    for r in results:
        for box in r.boxes:
            label = model.names[int(box.cls[0])]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            width = int(x2 - x1)
            height = int(y2 - y1)
            annotation = Annotation(
                label=label,
                x=int(x1),
                y=int(y1),
                width=width,
                height=height,
                confidence=float(box.conf[0])
            )
            frame.annotations.append(annotation)

    return frame

