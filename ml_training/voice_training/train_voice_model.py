import os
import librosa
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

DATASET_PATH = "dataset/ravdess"

EMOTION_MAP = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised",
}

def extract_features(file_path):
    audio, sample_rate = librosa.load(file_path, duration=3, offset=0.5)

    mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    mfcc_mean = np.mean(mfcc.T, axis=0)

    chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
    chroma_mean = np.mean(chroma.T, axis=0)

    mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
    mel_mean = np.mean(mel.T, axis=0)

    return np.hstack([mfcc_mean, chroma_mean, mel_mean])

X = []
y = []

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        if file.endswith(".wav"):
            file_path = os.path.join(root, file)

            parts = file.split("-")
            emotion_code = parts[2]
            emotion = EMOTION_MAP.get(emotion_code)

            if emotion:
                features = extract_features(file_path)
                X.append(features)
                y.append(emotion)

X = np.array(X)
y = np.array(y)

print("Total samples:", len(X))
print("Labels:", set(y))

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print(f"Voice Model Accuracy: {accuracy * 100:.2f}%")
print(classification_report(y_test, y_pred))

os.makedirs("../../backend/models", exist_ok=True)

joblib.dump(model, "../../backend/models/voice_model.pkl")
joblib.dump(scaler, "../../backend/models/voice_scaler.pkl")

print("Voice model saved successfully.")