import { useRef, useState } from "react";
import { Mic, Square, Upload } from "lucide-react";

type VoiceResult = {
  voice_emotion: string;
  wellbeing_cue: string;
  confidence: number;
  voice_score: number;
};

const VoiceAnalysis = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      setResult(null);
      setAudioBlob(null);
      setAudioUrl("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
      alert("Microphone permission failed. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const analyzeVoice = async () => {
    if (!audioBlob) {
      alert("Please record audio first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      const response = await fetch("http://127.0.0.1:5000/predict-voice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Voice prediction failed.");
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing voice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Voice Emotion Analysis
        </h1>

        <p className="mt-3 text-gray-600">
          This module analyzes vocal emotional cues and maps them into wellbeing
          indicators. It does not diagnose depression. It only provides
          emotional wellbeing cue analysis support.
        </p>

        <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-xl font-semibold">
            Record Your Voice
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Speak clearly for 5 to 10 seconds. Example:
            “I am feeling stressed about my exams and assignments.”
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
              >
                <Mic className="h-4 w-4" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </button>
            )}

            <button
              onClick={analyzeVoice}
              disabled={!audioBlob || loading}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              <Upload className="h-4 w-4" />
              {loading ? "Analyzing..." : "Analyze Voice"}
            </button>
          </div>

          {audioUrl && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Recorded Audio Preview:
              </p>

              <audio
                controls
                src={audioUrl}
                className="w-full"
              />
            </div>
          )}
        </div>

        {result && (
          <div className="mt-8 rounded-2xl border bg-purple-50 p-6">
            <h2 className="text-2xl font-bold text-purple-800">
              Voice Analysis Result
            </h2>

            <div className="mt-4 space-y-2 text-gray-800">
              <p>
                <strong>Detected Voice Emotion:</strong>{" "}
                {result.voice_emotion}
              </p>

              <p>
                <strong>Wellbeing Cue:</strong>{" "}
                {result.wellbeing_cue}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {result.confidence}%
              </p>

              <p>
                <strong>Voice Score:</strong>{" "}
                {result.voice_score}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              This is an individual voice emotional cue result only.
              For final emotional wellbeing analysis, use the
              combined voice assessment flow.
            </p>
          </div>
        )}
      </div>    
    </div>
  );
};

export default VoiceAnalysis;