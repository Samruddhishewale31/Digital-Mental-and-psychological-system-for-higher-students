import os
import numpy as np
import librosa
import joblib

from tqdm import tqdm

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

from xgboost import XGBClassifier


# ==========================================================
# DATASET PATH
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "ml_training",
    "voice_training",
    "dataset",
    "ravdess",
    "audio_speech_actors_01-24"
)

print("Dataset Path:")
print(DATASET_PATH)
print("Exists :", os.path.exists(DATASET_PATH))


# ==========================================================
# RAVDESS LABEL MAP
# ==========================================================

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


# ==========================================================
# FEATURE EXTRACTION
# ==========================================================

def extract_features(file_path):

    try:

        audio, sr = librosa.load(
            file_path,
            sr=22050,
            duration=3,
            offset=0.5
        )

        features = []

        # ---------------- MFCC ----------------

        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=sr,
            n_mfcc=40
        )

        features.extend(
            np.mean(mfcc.T, axis=0)
        )

        # ---------------- CHROMA ----------------

        stft = np.abs(
            librosa.stft(audio)
        )

        chroma = librosa.feature.chroma_stft(
            S=stft,
            sr=sr
        )

        features.extend(
            np.mean(chroma.T, axis=0)
        )

        # ---------------- MEL ----------------

        mel = librosa.feature.melspectrogram(
            y=audio,
            sr=sr
        )

        features.extend(
            np.mean(mel.T, axis=0)
        )

        # ---------------- CONTRAST ----------------

        contrast = librosa.feature.spectral_contrast(
            S=stft,
            sr=sr
        )

        features.extend(
            np.mean(contrast.T, axis=0)
        )

        # ---------------- TONNETZ ----------------

        harmonic = librosa.effects.harmonic(audio)

        tonnetz = librosa.feature.tonnetz(
            y=harmonic,
            sr=sr
        )

        features.extend(
            np.mean(tonnetz.T, axis=0)
        )

        # ---------------- RMS ----------------

        rms = librosa.feature.rms(y=audio)

        features.append(
            np.mean(rms)
        )

        # ---------------- ZCR ----------------

        zcr = librosa.feature.zero_crossing_rate(audio)

        features.append(
            np.mean(zcr)
        )

        return np.array(features)

    except Exception as e:

        print(file_path)
        print(e)

        return None


# ==========================================================
# LOAD DATASET
# ==========================================================

X = []
y = []

print("\nLoading Dataset...\n")

print("Folders Found:")

for folder in os.listdir(DATASET_PATH):
    print(folder)

for root, dirs, files in os.walk(DATASET_PATH):

    print(root)

    for file in tqdm(files):

        print(file)

        if not file.endswith(".wav"):
            continue

        path = os.path.join(root, file)

        emotion_code = file.split("-")[2]

        emotion = EMOTION_MAP.get(
            emotion_code
        )

        if emotion is None:
            continue

        feature = extract_features(path)

        if feature is None:
            continue

        X.append(feature)

        y.append(emotion)


X = np.array(X)
y = np.array(y)

print("\nDataset Loaded Successfully")
print("Samples :", len(X))
print("Features:", X.shape[1])

print("\nEmotion Distribution")

for emotion in sorted(set(y)):
    print(
        emotion,
        "->",
        np.sum(y == emotion)
    )
    # ==========================================================
# LABEL ENCODING
# ==========================================================

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

print("\nClasses:")
print(label_encoder.classes_)


# ==========================================================
# TRAIN TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded
)


# ==========================================================
# FEATURE SCALING
# ==========================================================

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)

X_test = scaler.transform(X_test)


# ==========================================================
# XGBOOST MODEL
# ==========================================================

print("\nTraining XGBoost Model...\n")

model = XGBClassifier(

    objective="multi:softprob",

    num_class=len(label_encoder.classes_),

    n_estimators=500,

    learning_rate=0.05,

    max_depth=8,

    subsample=0.8,

    colsample_bytree=0.8,

    random_state=42,

    eval_metric="mlogloss",

    use_label_encoder=False

)

model.fit(
    X_train,
    y_train
)

print("\nTraining Completed!\n")


# ==========================================================
# TEST PREDICTIONS
# ==========================================================

y_pred = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("=" * 60)
print(f"Accuracy : {accuracy * 100:.2f}%")
print("=" * 60)


# ==========================================================
# CLASSIFICATION REPORT
# ==========================================================

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        y_pred,

        target_names=label_encoder.classes_

    )

)


# ==========================================================
# CONFUSION MATRIX
# ==========================================================

print("\nConfusion Matrix\n")

print(

    confusion_matrix(

        y_test,

        y_pred

    )

)
# ==========================================================
# SAVE MODEL
# ==========================================================

MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(
    model,
    os.path.join(
        MODEL_DIR,
        "voice_model.pkl"
    )
)

joblib.dump(
    scaler,
    os.path.join(
        MODEL_DIR,
        "voice_scaler.pkl"
    )
)

joblib.dump(
    label_encoder,
    os.path.join(
        MODEL_DIR,
        "voice_label_encoder.pkl"
    )
)

print("\n======================================")
print("VOICE MODEL TRAINED SUCCESSFULLY")
print("======================================")

print("\nSaved Files:")

print(
    os.path.join(
        MODEL_DIR,
        "voice_model.pkl"
    )
)

print(
    os.path.join(
        MODEL_DIR,
        "voice_scaler.pkl"
    )
)

print(
    os.path.join(
        MODEL_DIR,
        "voice_label_encoder.pkl"
    )
)

print("\nTraining Accuracy:")
print(f"{accuracy*100:.2f}%")

print("\nEmotion Classes:")

for emotion in label_encoder.classes_:
    print("•", emotion)

print("\nTraining Finished Successfully.")