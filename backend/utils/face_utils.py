import cv2
import numpy as np
from PIL import Image
import os


# -----------------------------------------------------
# Configuration
# -----------------------------------------------------

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


# -----------------------------------------------------
# Face Detector
# -----------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

cascade_path = os.path.join(
    BASE_DIR,
    "haarcascade_frontalface_default.xml"
)


face_cascade = cv2.CascadeClassifier(
    cascade_path
)


if face_cascade.empty():
    raise Exception(
        "Face cascade file not loaded: " + cascade_path
    )



# -----------------------------------------------------
# Image Quality
# -----------------------------------------------------

def check_image_quality(gray):

    brightness = np.mean(gray)

    blur = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()


    return {
        "brightness": round(float(brightness),2),
        "sharpness": round(float(blur),2)
    }



# -----------------------------------------------------
# Detect Face
# -----------------------------------------------------

def detect_face(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )


    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )


    if len(faces) == 0:
        return None,0


    largest = max(
        faces,
        key=lambda x:x[2]*x[3]
    )


    return largest,len(faces)



# -----------------------------------------------------
# Preprocess
# -----------------------------------------------------

def preprocess_image(image_file):

    image = Image.open(
        image_file
    ).convert("RGB")


    img = np.array(image)


    img = cv2.cvtColor(
        img,
        cv2.COLOR_RGB2BGR
    )


    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )


    quality = check_image_quality(gray)


    face, count = detect_face(img)


    if face is None:
        return None,count,quality


    x,y,w,h = face


    padding = 25


    x1=max(0,x-padding)
    y1=max(0,y-padding)

    x2=min(
        gray.shape[1],
        x+w+padding
    )

    y2=min(
        gray.shape[0],
        y+h+padding
    )


    crop = gray[
        y1:y2,
        x1:x2
    ]


    crop=cv2.resize(
        crop,
        (IMG_SIZE,IMG_SIZE)
    )


    crop=cv2.equalizeHist(
        crop
    )


    crop=crop.astype(
        "float32"
    )


    crop/=255.0


    crop=np.expand_dims(
        crop,
        axis=-1
    )


    crop=np.expand_dims(
        crop,
        axis=0
    )


    return crop,count,quality



# -----------------------------------------------------
# Observation
# -----------------------------------------------------

def get_observation(emotion):

    data={

        "happy":
        "Positive facial expression detected. Supportive observation only.",

        "neutral":
        "Neutral facial expression detected. Expression alone cannot determine wellbeing.",

        "sad":
        "Sad-related expression detected. Additional assessment is required.",

        "angry":
        "Anger-related expression detected. Context should be considered.",

        "fear":
        "Fear-related expression detected. This is not a diagnosis.",

        "surprise":
        "Surprise-related expression detected.",

        "disgust":
        "Discomfort-related expression detected."
    }


    return data.get(
        emotion,
        "No observation available."
    )



# -----------------------------------------------------
# Main Prediction Function
# -----------------------------------------------------

def predict_face_emotion(model,image_file):


    processed_image,faces_detected,quality = preprocess_image(
        image_file
    )


    if processed_image is None:

        return {

            "status":"error",

            "message":"No face detected",

            "emotion":"Unknown",

            "confidence":0,

            "face_score":0,

            "faces_detected":0,

            "face_message":
            "No face detected in image",

            "all_predictions":{},

            "observation":
            "Face analysis could not be performed.",

            "disclaimer":
            "AI face analysis is only a supportive indicator."
        }



    prediction=model.predict(
        processed_image,
        verbose=0
    )[0]



    index=int(
        np.argmax(prediction)
    )


    emotion=EMOTION_LABELS[index]


    confidence=float(
        prediction[index]
    )


    distribution={

        EMOTION_LABELS[i]:
        round(float(prediction[i])*100,2)

        for i in range(len(EMOTION_LABELS))

    }



    return {

        "status":"success",


        "emotion":
        emotion.title(),


        "confidence":
        round(confidence*100,2),


        "face_score":
        round(confidence*100,2),


        "faces_detected":
        faces_detected,


        "face_message":
        f"{faces_detected} face detected successfully",


        "all_predictions":
        distribution,


        "observation":
        get_observation(emotion),


        "quality":
        quality,


        "disclaimer":
        "Facial emotion analysis is an AI-based supportive observation only and is not a medical diagnosis."

    }