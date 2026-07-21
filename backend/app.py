from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import os
import joblib

from utils.face_utils import predict_face_emotion
from utils.voice_utils import predict_voice_emotion

app = Flask(__name__)
CORS(app)

FACE_MODEL_PATH = os.path.join("models", "face_model.h5")
VOICE_MODEL_PATH = os.path.join("models", "voice_model.pkl")
VOICE_SCALER_PATH = os.path.join("models", "voice_scaler.pkl")

face_model = None
voice_model = None
voice_scaler = None

# Load Face Model
try:
    face_model = tf.keras.models.load_model(FACE_MODEL_PATH)
    print("Face model loaded successfully.")
except Exception as e:
    print("Error loading face model:", e)

# Load Voice Model
try:
    voice_model = joblib.load(VOICE_MODEL_PATH)
    voice_scaler = joblib.load(VOICE_SCALER_PATH)
    print("Voice model loaded successfully.")
except Exception as e:
    print("Error loading voice model:", e)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Mental Health AI Backend is running"
    })

# Face Prediction Route
@app.route("/predict-face", methods=["POST"])
def predict_face():

    if face_model is None:
        return jsonify({
            "error": "Face model not loaded"
        }), 500

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    image_file = request.files["image"]

    result = predict_face_emotion(face_model, image_file)

    return jsonify(result)

# Voice Prediction Route
@app.route("/predict-voice", methods=["POST"])
def predict_voice():

    if voice_model is None or voice_scaler is None:
        return jsonify({
            "error": "Voice model not loaded"
        }), 500

    if "audio" not in request.files:
        return jsonify({
            "error": "No audio uploaded"
        }), 400

    audio_file = request.files["audio"]

    result = predict_voice_emotion(
        voice_model,
        voice_scaler,
        audio_file
    )

    return jsonify(result)

# Final Combined Risk
@app.route("/final-risk", methods=["POST"])
def final_risk():

    data = request.get_json()

    questionnaire_score = float(
        data.get("questionnaire_score", 0)
    )

    face_score = float(
        data.get("face_score", 0)
    )

    voice_score = float(
        data.get("voice_score", 0)
    )

    final_score = (
        (0.6 * questionnaire_score)
        + (0.2 * face_score)
        + (0.2 * voice_score)
    )

    if final_score <= 7:

        risk_level = "Low Emotional Distress"

        recommendation = (
            "Maintain a healthy routine, continue journaling, "
            "and follow regular self-care practices."
        )

    elif final_score <= 14:

        risk_level = "Moderate Emotional Distress"

        recommendation = (
            "Try breathing exercises, journaling, "
            "stress-relief activities, and monitor your mood regularly."
        )

    else:

        risk_level = "High Emotional Distress"

        recommendation = (
            "Consider speaking with a counselor, trusted person, "
            "or mental health professional."
        )

    return jsonify({
        "final_score": round(final_score, 2),
        "risk_level": risk_level,
        "recommendation": recommendation
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)