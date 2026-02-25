from fastapi import APIRouter
from schemas import ImageFrame, Annotation
from PIL import Image
import io
import cv2
import numpy as np

router = APIRouter()

proto_path = "/Users/tybusby/Work/publisher/python/app/models/dnn/deploy.prototxt"
model_path = "/Users/tybusby/Work/publisher/python/app/models/dnn/res10_300x300_ssd_iter_140000_fp16.caffemodel"
net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

@router.post("/dnn")
async def dnn(frame: ImageFrame):
    img = np.array(Image.open(io.BytesIO(frame.image.buffer)).convert("RGB"))[:, :, ::-1]
    (h, w) = img.shape[:2]

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
