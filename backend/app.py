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

    print("Face model loaded successfully")

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

    print("Voice model loaded successfully")


except Exception as e:

    print("Voice Model Error:", e)




# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({

        "status":"success",

        "message":
        "Mental Wellness AI Backend Running"

    })





# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/health")
def health():

    return jsonify({

        "face_model_loaded":
        face_model is not None,


        "voice_model_loaded":
        voice_model is not None

    })






# ==========================================
# FACE ANALYSIS
# ==========================================

@app.route("/predict-face", methods=["POST"])
def predict_face():


    if "image" not in request.files:

        return jsonify({

            "status":"error",

            "message":"No image uploaded"

        }),400



    try:

        image=request.files["image"]


        result=predict_face_emotion(

            face_model,

            image

        )


        return jsonify({

            "status":"success",

            "data":result

        })



    except Exception as e:

        print("FACE ERROR:",e)


        return jsonify({

            "status":"error",

            "message":str(e)

        }),500






# ==========================================
# VOICE ANALYSIS
# ==========================================


@app.route("/predict-voice", methods=["POST"])
def predict_voice():


    if "audio" not in request.files:

        return jsonify({

            "status":"error",

            "message":"No audio uploaded"

        }),400



    try:


        audio=request.files["audio"]



        result=predict_voice_emotion(

            voice_model,

            voice_scaler,

            audio

        )



        return jsonify({

            "status":"success",

            "data":result

        })



    except Exception as e:


        print("VOICE ERROR:",e)


        return jsonify({

            "status":"error",

            "message":str(e)

        }),500







# ==========================================
# COMPLETE ANALYSIS
# ==========================================


@app.route("/final-risk", methods=["POST"])
def final_risk():


    try:


        data=request.get_json()



        questionnaire_score=float(
            data.get(
                "questionnaire_score",
                0
            )
        )


        face_score=float(
            data.get(
                "face_score",
                0
            )
        )


        voice_score=float(
            data.get(
                "voice_score",
                0
            )
        )



        # Convert to percentage


        questionnaire_percentage = (
            questionnaire_score / 30
        ) * 100



        face_percentage = (
            face_score / 4
        ) * 100



        voice_percentage = (
            voice_score / 10
        ) * 100




        # WEIGHTS

        questionnaire_weighted = (
            questionnaire_percentage * 0.60
        )


        face_weighted = (
            face_percentage * 0.20
        )


        voice_weighted = (
            voice_percentage * 0.20
        )



        final_score = round(

            questionnaire_weighted
            +
            face_weighted
            +
            voice_weighted,

            2

        )




        if final_score < 30:


            risk="Low Risk"


            recommendation="""
            Your emotional wellbeing indicators appear stable.
            Continue healthy routines, sleep, exercise and self-care.
            """



        elif final_score < 60:


            risk="Moderate Risk"


            recommendation="""
            Some emotional distress indicators are present.
            Consider meditation, journaling, relaxation activities
            and regular wellbeing monitoring.
            """



        else:


            risk="High Risk"


            recommendation="""
            Elevated emotional distress indicators detected.
            Consider reaching out to a qualified mental health
            professional for support.
            """




        return jsonify({


            "status":"success",



            "questionnaire":{

                "percentage":
                round(questionnaire_percentage,2),

                "weightage":60,

                "weighted_score":
                round(questionnaire_weighted,2)

            },



            "face":{

                "percentage":
                round(face_percentage,2),

                "weightage":20,

                "weighted_score":
                round(face_weighted,2)

            },



            "voice":{

                "percentage":
                round(voice_percentage,2),

                "weightage":20,

                "weighted_score":
                round(voice_weighted,2)

            },



            "overall_score":
            final_score,


            "risk_level":
            risk,


            "recommendation":
            recommendation,


            "disclaimer":
            "AI analysis provides supportive emotional indicators only and is not a medical diagnosis."

        })



    except Exception as e:


        print("FINAL ERROR:",e)


        return jsonify({

            "status":"error",

            "message":str(e)

        }),500








# ==========================================
# START SERVER
# ==========================================


if __name__=="__main__":


    print("Mental Wellness AI Backend Started")


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )