import { useRef, useState } from "react";
import Webcam from "react-webcam";

type FaceResult = {
  emotion: string;
  confidence: number;
  face_score: number;
};

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function FaceAnalysis() {
  const webcamRef = useRef<Webcam | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FaceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Unable to capture image. Please allow camera permission.");
      return;
    }

    setCapturedImage(imageSrc);
    setResult(null);
  };

  const dataURLtoBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const bstr = atob(arr[1]);
    let n = bstr.length;

    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  const analyzeFace = async () => {
    if (!capturedImage) {
      alert("Please capture an image first.");
      return;
    }

    try {
      setLoading(true);

      const imageBlob = dataURLtoBlob(capturedImage);

      const formData = new FormData();
      formData.append("image", imageBlob, "face.jpg");

      const response = await fetch("http://127.0.0.1:5000/predict-face", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Face prediction failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing face.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6ff] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Face Emotion Analysis
        </h1>

        <p className="mt-3 text-gray-600">
          This module analyzes facial emotional cues such as neutral, happy,
          sad, angry, fear, surprise, and disgust. It does not diagnose
          depression. It only provides an emotional cue score for wellbeing
          support.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Camera Preview
            </h2>

            <div className="overflow-hidden rounded-xl border bg-gray-100">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full"
              />
            </div>

            <button
              onClick={captureImage}
              className="mt-4 w-full rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
            >
              Capture Image
            </button>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Captured Image
            </h2>

            <div className="flex min-h-[260px] items-center justify-center rounded-xl border bg-gray-50">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="rounded-xl"
                />
              ) : (
                <p className="text-gray-500">No image captured yet</p>
              )}
            </div>

            <button
              onClick={analyzeFace}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Analyzing..." : "Analyze Face"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 rounded-2xl border bg-purple-50 p-6">
            <h2 className="text-2xl font-bold text-purple-800">
              Analysis Result
            </h2>

            <div className="mt-4 space-y-2 text-gray-800">
              <p>
                <strong>Detected Emotion:</strong> {result.emotion}
              </p>

              <p>
                <strong>Confidence:</strong> {result.confidence}%
              </p>

              <p>
                <strong>Face Score:</strong> {result.face_score}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              This is an individual face emotional cue result only. For final
              emotional wellbeing analysis, use the combined face assessment flow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}