import librosa
import numpy as np
import tempfile
import os

VOICE_SCORES = {
    "calm": 0,
    "happy": 0,
    "neutral": 1,
    "surprised": 1,
    "sad": 3,
    "angry": 3,
    "disgust": 3,
    "fearful": 4,
}

def map_to_wellbeing_cue(emotion):
    if emotion in ["happy", "calm"]:
        return "Positive / Calm Vocal Cue"
    if emotion in ["neutral", "surprised"]:
        return "Neutral Vocal Cue"
    if emotion in ["sad", "disgust"]:
        return "Negative Emotional Vocal Cue"
    if emotion in ["angry", "fearful"]:
        return "High Stress Vocal Cue"
    return "General Emotional Vocal Cue"

def extract_voice_features(audio_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        audio_file.save(temp_audio.name)
        temp_path = temp_audio.name

    try:
        audio, sample_rate = librosa.load(
            temp_path,
            sr=22050,
            duration=3,
            offset=0.0
        )

        if audio is None or len(audio) == 0:
            raise ValueError("Empty audio received")

        mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfcc_mean = np.mean(mfcc.T, axis=0)

        chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
        chroma_mean = np.mean(chroma.T, axis=0)

        mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
        mel_mean = np.mean(mel.T, axis=0)

        features = np.hstack([mfcc_mean, chroma_mean, mel_mean])
        return features.reshape(1, -1)

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

def predict_voice_emotion(model, scaler, audio_file):
    features = extract_voice_features(audio_file)
    scaled_features = scaler.transform(features)

    emotion = str(model.predict(scaled_features)[0])

    confidence = 0
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(scaled_features)[0]
        confidence = float(np.max(probabilities)) * 100

    score = VOICE_SCORES.get(emotion, 1)
    wellbeing_cue = map_to_wellbeing_cue(emotion)

    return {
        "voice_emotion": emotion,
        "wellbeing_cue": wellbeing_cue,
        "confidence": round(confidence, 2),
        "voice_score": score
    }