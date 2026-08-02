from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import tensorflow as tf
import joblib


from utils.voice_utils import predict_voice_emotion
from utils.face_utils import predict_face_emotion



app = Flask(__name__)

CORS(app)



# ==========================================
# Model Paths
# ==========================================

FACE_MODEL_PATH = os.path.join(
    "models",
    "face_model.h5"
)

VOICE_MODEL_PATH = os.path.join(
    "models",
    "voice_model.pkl"
)

VOICE_SCALER_PATH = os.path.join(
    "models",
    "voice_scaler.pkl"
)



face_model = None

voice_model = None

voice_scaler = None




# ==========================================
# Load Face Model
# ==========================================

try:

    face_model = tf.keras.models.load_model(
        FACE_MODEL_PATH
    )

    print("Face model loaded successfully.")

except Exception as e:

    print("Face Model Error:", e)




# ==========================================
# Load Voice Model
# ==========================================

try:

    voice_model = joblib.load(
        VOICE_MODEL_PATH
    )

    voice_scaler = joblib.load(
        VOICE_SCALER_PATH
    )

    print("Voice model loaded successfully.")


except Exception as e:

    print("Voice Model Error:", e)





# ==========================================
# Home Route
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "status": "success",

        "message":
        "Mental Wellness AI Backend Running"

    })





# ==========================================
# Health Check
# ==========================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({

        "status": "success",

        "face_model_loaded":
        face_model is not None,


        "voice_model_loaded":
        voice_model is not None
        and voice_scaler is not None

    })





# ==========================================
# Face Prediction API
# ==========================================

@app.route("/predict-face", methods=["POST"])
def predict_face():


    if face_model is None:

        return jsonify({

            "status": "error",

            "message":
            "Face model could not be loaded."

        }),500



    if "image" not in request.files:

        return jsonify({

            "status": "error",

            "message":
            "No image uploaded."

        }),400



    try:

        image = request.files["image"]



        result = predict_face_emotion(

            face_model,

            image

        )



        return jsonify({

            "status":
            "success",

            "data":
            result

        })



    except Exception as e:

        print(
            "FACE ERROR:",
            e
        )


        return jsonify({

            "status":
            "error",

            "message":
            str(e)

        }),500





# ==========================================
# Voice Prediction API
# ==========================================

@app.route("/predict-voice", methods=["POST"])
def predict_voice():



    if voice_model is None or voice_scaler is None:


        return jsonify({

            "status":
            "error",

            "message":
            "Voice model could not be loaded."

        }),500




    if "audio" not in request.files:


        return jsonify({

            "status":
            "error",

            "message":
            "No audio uploaded."

        }),400




    try:


        audio = request.files["audio"]



        result = predict_voice_emotion(

            voice_model,

            voice_scaler,

            audio

        )



        return jsonify({

            "status":
            "success",

            "data":
            result

        })



    except Exception as e:


        print(
            "VOICE ERROR:",
            e
        )


        return jsonify({

            "status":
            "error",

            "message":
            str(e)

        }),500





# ==========================================
# Final Risk Assessment
# ==========================================

@app.route("/final-risk", methods=["POST"])
def final_risk():


    try:


        data = request.get_json()



        questionnaire_score = float(
            data.get(
                "questionnaire_score",
                0
            )
        )


        face_score = float(
            data.get(
                "face_score",
                0
            )
        )


        voice_score = float(
            data.get(
                "voice_score",
                0
            )
        )



        final_score = (

            (0.6 * questionnaire_score)

            +

            (0.2 * face_score)

            +

            (0.2 * voice_score)

        )




        if final_score <= 7:


            risk_level = (
                "Low Emotional Distress"
            )


            recommendation = (

                "Continue maintaining a healthy lifestyle, "
                "regular sleep, exercise, and self-care practices."

            )



        elif final_score <= 14:



            risk_level = (
                "Moderate Emotional Distress"
            )


            recommendation = (

                "Practice breathing exercises, meditation, "
                "journaling, and continue monitoring your wellbeing."

            )



        else:



            risk_level = (
                "High Emotional Distress"
            )


            recommendation = (

                "Your assessment indicates elevated emotional distress. "
                "Please consider consulting a qualified mental health professional."

            )




        return jsonify({


            "status":
            "success",


            "final_score":
            round(final_score,2),


            "risk_level":
            risk_level,


            "recommendation":
            recommendation,


            "disclaimer":

            "This platform provides mental health screening and wellness "
            "support only. It does not diagnose medical or psychological "
            "conditions."

        })



    except Exception as e:


        print(
            "FINAL RISK ERROR:",
            e
        )


        return jsonify({

            "status":
            "error",

            "message":
            str(e)

        }),500






# ==========================================
# Run Server
# ==========================================

if __name__ == "__main__":


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )