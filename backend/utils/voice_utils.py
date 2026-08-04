import librosa
import numpy as np
import tempfile
import os


# =====================================================
# FEATURE EXTRACTION
# (Same as training)
# =====================================================

def extract_features(audio_path):

    audio, sample_rate = librosa.load(
        audio_path,
        duration=3,
        offset=0.5
    )

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sample_rate,
        n_mfcc=40
    )

    chroma = librosa.feature.chroma_stft(
        y=audio,
        sr=sample_rate
    )

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sample_rate
    )

    mfcc_mean = np.mean(
        mfcc.T,
        axis=0
    )

    chroma_mean = np.mean(
        chroma.T,
        axis=0
    )

    mel_mean = np.mean(
        mel.T,
        axis=0
    )

    return np.hstack([
        mfcc_mean,
        chroma_mean,
        mel_mean
    ])


# =====================================================
# PITCH
# =====================================================

def analyze_pitch(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    pitches, magnitudes = librosa.piptrack(
        y=y,
        sr=sr
    )

    values = []

    for i in range(pitches.shape[1]):

        idx = np.argmax(
            magnitudes[:, i]
        )

        pitch = pitches[idx, i]

        if pitch > 50 and pitch < 500:
            values.append(pitch)

    if len(values) == 0:
        return 0

    return round(
        float(np.mean(values)),
        2
    )


# =====================================================
# TONE
# =====================================================

def analyze_tone(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    energy = np.mean(
        librosa.feature.rms(
            y=y
        )
    )

    if energy < 0.02:
        return "Low"

    elif energy < 0.05:
        return "Normal"

    else:
        return "High"


# =====================================================
# SPEAKING SPEED
# =====================================================

def analyze_speed(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    duration = librosa.get_duration(
        y=y,
        sr=sr
    )

    if duration <= 0:
        return 0

    zcr = librosa.feature.zero_crossing_rate(
        y
    )

    activity = np.mean(zcr)

    estimated_words = activity * 280

    speed = estimated_words / duration

    return round(
        float(speed),
        2
    )

# =====================================================
# PAUSE DETECTION
# =====================================================

def analyze_pauses(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    intervals = librosa.effects.split(
        y,
        top_db=25
    )

    total_duration = librosa.get_duration(
        y=y,
        sr=sr
    )

    speech_duration = 0

    for start, end in intervals:

        speech_duration += (
            end - start
        ) / sr

    pause_duration = total_duration - speech_duration

    return round(
        float(max(0, pause_duration)),
        2
    )


# =====================================================
# HESITATION
# =====================================================

def analyze_hesitation(audio_path):

    pauses = analyze_pauses(
        audio_path
    )

    if pauses >= 3:
        return "High"

    elif pauses >= 1:
        return "Medium"

    return "Low"


# =====================================================
# VOICE CONFIDENCE
# =====================================================

def analyze_confidence(probability):

    confidence = probability * 100

    return round(
        float(confidence),
        2
    )


# =====================================================
# WELLBEING CUE
# =====================================================

def wellbeing_cue(emotion):

    emotion = emotion.lower()

    cues = {

        "happy":
        "Positive and cheerful vocal emotion detected.",

        "calm":
        "Relaxed vocal tone detected.",

        "neutral":
        "Neutral speaking pattern detected.",

        "sad":
        "Low mood related vocal characteristics detected.",

        "angry":
        "Strong emotional intensity detected in speech.",

        "fearful":
        "Anxious or fearful vocal characteristics detected.",

        "disgust":
        "Discomfort related vocal cues detected.",

        "surprised":
        "Excited vocal characteristics detected."

    }

    return cues.get(
        emotion,
        "Normal vocal characteristics detected."
    )

# =====================================================
# MAIN FUNCTION
# =====================================================

def predict_voice_emotion(
    model,
    scaler,
    label_encoder,
    audio_file
):

    temp = tempfile.NamedTemporaryFile(
    delete=False,
    suffix=".webm"
)

    temp.close()

    audio_file.save(temp.name)
    print("\n========== DEBUG ==========")
    print("Filename:", audio_file.filename)
    print("Content-Type:", audio_file.content_type)
    print("Saved As:", temp.name)
    print("Filename:", audio_file.filename)
    print("Content Type:", audio_file.content_type)

    print("\n========== VOICE ANALYSIS ==========")
    print("Saved File :", temp.name)

    try:

        # -----------------------------
        # CHECK AUDIO
        # -----------------------------

        y, sr = librosa.load(
            temp.name,
            sr=None
        )

        duration = librosa.get_duration(
            y=y,
            sr=sr
        )

        print("Sample Rate :", sr)
        print("Duration :", round(duration, 2))
        print("Max Amplitude :", np.max(np.abs(y)))

                # -----------------------------
        # MODEL PREDICTION
        # -----------------------------

        feature_vector = extract_features(
            temp.name
        )

        feature_vector = feature_vector.reshape(
            1, -1
        )

        scaled_features = scaler.transform(
            feature_vector
        )

        prediction_encoded = model.predict(
            scaled_features
        )[0]

        prediction = label_encoder.inverse_transform(
            [prediction_encoded]
        )[0]

        probabilities = model.predict_proba(
            scaled_features
        )[0]

        confidence = round(
            float(np.max(probabilities) * 100),
            2
        )

        print("\n========== MODEL OUTPUT ==========")
        print("Prediction :", prediction)
        print("Confidence :", confidence)
        print("Probabilities :")

        for emotion, prob in zip(
            label_encoder.classes_,
            probabilities
        ):
            print(
                f"{emotion} : {prob:.4f}"
            )

        print("==================================")

                # -----------------------------
        # EXTRA FEATURES
        # -----------------------------

        pitch = analyze_pitch(temp.name)

        tone = analyze_tone(temp.name)

        speed = analyze_speed(temp.name)

        pauses = analyze_pauses(temp.name)

        hesitation = analyze_hesitation(temp.name)

        features = {

            "pitch": pitch,

            "tone": tone,

            "speaking_speed": speed,

            "pauses": pauses,

            "hesitation": hesitation,

            "voice_confidence": confidence

        }

        print("Pitch :", pitch)
        print("Tone :", tone)
        print("Speed :", speed)
        print("Pauses :", pauses)
        print("=====================================\n")

        return {

            "voice_emotion": prediction.title(),

            "wellbeing_cue": wellbeing_cue(prediction),

            "confidence": confidence,

            "voice_score": confidence,

            "features": features

        }

    except Exception as e:

        print("\n========== FULL ERROR ==========")

        traceback.print_exc()

        print("================================")

        raise

    finally:

        try:

            os.remove(temp.name)

        except Exception:

            pass