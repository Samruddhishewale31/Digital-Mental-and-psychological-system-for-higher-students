import librosa
import numpy as np
import tempfile
import os



# ----------------------------------------
# Pitch Analysis
# ----------------------------------------

def analyze_pitch(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )


    pitches, magnitudes = librosa.piptrack(
        y=y,
        sr=sr
    )


    pitch_values = []


    for i in range(pitches.shape[1]):

        index = np.argmax(
            magnitudes[:, i]
        )

        pitch = pitches[index, i]


        if pitch > 0:
            pitch_values.append(pitch)



    if len(pitch_values) == 0:
        return 0


    return round(
        float(np.mean(pitch_values)),
        2
    )



# ----------------------------------------
# Tone Analysis
# ----------------------------------------

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

    elif energy < 0.06:
        return "Normal"

    else:
        return "High"



# ----------------------------------------
# Speaking Speed
# ----------------------------------------

def analyze_speed(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )


    duration = librosa.get_duration(
        y=y,
        sr=sr
    )


    if duration == 0:
        return 0


    zero_crossings = librosa.feature.zero_crossing_rate(
        y
    )


    activity = np.mean(
        zero_crossings
    )


    words_estimate = int(
        activity * 300
    )


    speed = words_estimate / duration


    return round(
        speed,
        2
    )



# ----------------------------------------
# Pause Detection
# ----------------------------------------

def analyze_pauses(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )


    intervals = librosa.effects.split(
        y,
        top_db=30
    )


    total_audio = len(y) / sr


    speech_time = sum(
        [
            (end-start)/sr
            for start,end in intervals
        ]
    )


    pause_time = total_audio - speech_time


    return round(
        pause_time,
        2
    )



# ----------------------------------------
# Hesitation Detection
# ----------------------------------------

def analyze_hesitation(audio_path):

    pauses = analyze_pauses(
        audio_path
    )


    if pauses > 3:

        return "High"


    elif pauses > 1:

        return "Medium"


    else:

        return "Low"



# ----------------------------------------
# Voice Confidence
# ----------------------------------------

def analyze_confidence(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )


    energy = np.mean(
        librosa.feature.rms(
            y=y
        )
    )


    confidence = min(
        energy * 1000,
        100
    )


    return round(
        float(confidence),
        2
    )



# ----------------------------------------
# Emotion / Wellbeing Logic
# ----------------------------------------

def generate_voice_emotion(features):


    confidence = features["voice_confidence"]

    tone = features["tone"]

    hesitation = features["hesitation"]



    if confidence < 30 and hesitation == "High":

        emotion = "Stressed"

        cue = "Low voice confidence and frequent pauses detected."


    elif tone == "High" and hesitation == "Low":

        emotion = "Energetic"

        cue = "High vocal energy and confident speech detected."


    elif tone == "Low":

        emotion = "Calm"

        cue = "Low vocal intensity detected."


    else:

        emotion = "Neutral"

        cue = "Normal vocal pattern detected."



    return emotion, cue



# ----------------------------------------
# MAIN FUNCTION USED BY FLASK
# ----------------------------------------

def predict_voice_emotion(audio_file):


    temp = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".wav"
    )


    temp.close()



    audio_file.save(
        temp.name
    )



    features = {


        "pitch":
        analyze_pitch(
            temp.name
        ),


        "tone":
        analyze_tone(
            temp.name
        ),


        "speaking_speed":
        analyze_speed(
            temp.name
        ),


        "pauses":
        analyze_pauses(
            temp.name
        ),


        "hesitation":
        analyze_hesitation(
            temp.name
        ),


        "voice_confidence":
        analyze_confidence(
            temp.name
        )

    }



    emotion, cue = generate_voice_emotion(
        features
    )



    # delete temporary file safely

    try:

        os.remove(
            temp.name
        )

    except PermissionError:

        pass



    return {


        "voice_emotion":
        emotion,


        "wellbeing_cue":
        cue,


        "confidence":
        features["voice_confidence"],


        "voice_score":
        features["voice_confidence"],


        "features":
        features

    }