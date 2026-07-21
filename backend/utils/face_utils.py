import numpy as np
from PIL import Image
import cv2

IMG_SIZE = 48

EMOTION_LABELS = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]

EMOTION_SCORES = {
    "happy": 0,
    "neutral": 1,
    "surprise": 1,
    "sad": 3,
    "angry": 3,
    "disgust": 3,
    "fear": 4
}

def preprocess_image(image_file):
    image = Image.open(image_file).convert("RGB")
    image_np = np.array(image)

    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60)
    )

    if len(faces) > 0:
        x, y, w, h = max(faces, key=lambda face: face[2] * face[3])

        padding = 20
        x1 = max(x - padding, 0)
        y1 = max(y - padding, 0)
        x2 = min(x + w + padding, gray.shape[1])
        y2 = min(y + h + padding, gray.shape[0])

        face_img = gray[y1:y2, x1:x2]
    else:
        face_img = gray

    face_img = cv2.resize(face_img, (IMG_SIZE, IMG_SIZE))
    face_img = cv2.equalizeHist(face_img)

    image_array = face_img / 255.0
    image_array = np.expand_dims(image_array, axis=-1)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array

def predict_face_emotion(model, image_file):
    processed_image = preprocess_image(image_file)
    prediction = model.predict(processed_image, verbose=0)

    predicted_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    emotion = EMOTION_LABELS[predicted_index]
    score = EMOTION_SCORES.get(emotion, 1)

    all_predictions = {
        EMOTION_LABELS[i]: round(float(prediction[0][i]) * 100, 2)
        for i in range(len(EMOTION_LABELS))
    }

    return {
        "emotion": emotion,
        "confidence": round(confidence * 100, 2),
        "face_score": score,
        "all_predictions": all_predictions
    }