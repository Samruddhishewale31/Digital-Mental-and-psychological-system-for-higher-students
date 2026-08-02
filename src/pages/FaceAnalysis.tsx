import { useRef, useState } from "react";
import Webcam from "react-webcam";

type FaceResult = {
  status: string;
  emotion: string;
  confidence: number;
  face_score: number;
  faces_detected: number;
  face_message: string;
  observation: string;
  disclaimer: string;
  all_predictions: {
    [key: string]: number;
  };
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
      alert("Please allow camera access.");
      return;
    }

    setCapturedImage(imageSrc);
    setResult(null);
  };

  const dataURLtoBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");

    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";

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
      alert("Capture an image first.");
      return;
    }

    try {
      setLoading(true);

      const imageBlob = dataURLtoBlob(capturedImage);

      const formData = new FormData();

      formData.append("image", imageBlob, "face.jpg");

      const response = await fetch(
        "http://127.0.0.1:5000/predict-face",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed.");
      }
const json = await response.json();

if (json.status === "error") {
  throw new Error(json.message);
}

const data: FaceResult =
  json.data ? json.data : json;

setResult(data);



      // Save for final combined report

      localStorage.setItem(
        "analysis_type",
        "face"
      );

      localStorage.setItem(
        "face_score",
        String(data.face_score)
      );

      localStorage.setItem(
        "face_emotion",
        data.emotion
      );

      localStorage.setItem(
        "face_confidence",
        String(data.confidence)
      );

      localStorage.setItem(
        "face_observation",
        data.observation
      );

      localStorage.setItem(
  "faces_detected",
  String(data.faces_detected)
);

// Stay on Face Analysis page
    } catch (err) {
      console.error(err);
      alert("Unable to analyze face.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] py-10 px-6">

      <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-xl p-8">

        <h1 className="text-3xl font-bold text-purple-700">
          AI Face Emotion Analysis
        </h1>

        <p className="mt-4 text-gray-600 leading-7">
          This module analyzes facial emotional cues such as Happy,
          Neutral, Sad, Angry, Fear, Surprise and Disgust using
          Artificial Intelligence.
        </p>

        <div className="mt-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4 text-sm text-gray-700">
          <strong>Disclaimer:</strong> Face analysis is used only as a
          supportive emotional indicator. It is <b>not</b> a medical or
          psychological diagnosis. Final wellbeing assessment combines
          questionnaire responses with optional face and voice analysis.
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* Camera Section */}

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
              className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-white font-semibold hover:bg-purple-700"
            >
              Capture Image
            </button>

          </div>

          {/* Captured Image */}

          <div>

            <h2 className="mb-3 text-xl font-semibold">
              Captured Image
            </h2>

            <div className="flex min-h-[320px] items-center justify-center rounded-xl border bg-gray-50">

              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="rounded-xl"
                />
              ) : (
                <p className="text-gray-500">
                  No image captured.
                </p>
              )}

            </div>

            <button
              onClick={analyzeFace}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Analyzing Face..." : "Analyze Face"}
            </button>

          </div>

        </div>
                {/* ================= RESULT SECTION ================= */}

        {result && (
          <div className="mt-10 rounded-2xl border bg-purple-50 p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-purple-700">
              Face Analysis Result
            </h2>

            {/* Status */}

            <div className="mt-5 rounded-xl bg-white p-4 border">

              <div className="flex items-center justify-between">

                <span className="font-semibold text-gray-700">
                  Status
                </span>

                <span className="rounded-full bg-green-100 px-4 py-1 text-green-700 font-semibold">
                  {result.status}
                </span>

              </div>

            </div>

            {/* Main Cards */}

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <div className="rounded-xl bg-white p-5 shadow">

                <p className="text-gray-500">
                  Detected Emotion
                </p>

                <h3 className="mt-2 text-3xl font-bold text-purple-700">
                  {result.emotion}
                </h3>

              </div>

              <div className="rounded-xl bg-white p-5 shadow">

                <p className="text-gray-500">
                  Emotion Confidence
                </p>

                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {result.confidence}%
                </h3>

              </div>

              <div className="rounded-xl bg-white p-5 shadow">

                <p className="text-gray-500">
                  Face Score
                </p>

                <h3 className="mt-2 text-3xl font-bold text-red-500">
                  {result.face_score}
                </h3>

              </div>

            </div>

            {/* Confidence Progress */}

            <div className="mt-8">

              <div className="mb-2 flex justify-between">

                <span className="font-medium text-gray-700">
                  Prediction Confidence
                </span>

                <span className="font-semibold">
                  {result.confidence}%
                </span>

              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-200">

                <div
                  className="h-4 rounded-full bg-green-500 transition-all duration-700"
                  style={{
                    width: `${result.confidence}%`,
                  }}
                />

              </div>

            </div>

            {/* Faces */}

            <div className="mt-8 rounded-xl border bg-white p-5">

              <h3 className="text-lg font-semibold text-purple-700">
                Face Detection
              </h3>

              <div className="mt-4 space-y-2">

                <p>
                  <strong>Faces Detected:</strong>{" "}
                  {result.faces_detected}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {result.face_message}
                </p>

              </div>

            </div>

            {/* Observation */}

            <div className="mt-8 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5">

              <h3 className="text-lg font-semibold text-blue-700">
                AI Observation
              </h3>

              <p className="mt-3 leading-7 text-gray-700">
                {result.observation}
              </p>

            </div>

            {/* Emotion Probability */}

            <div className="mt-8 rounded-xl bg-white p-6 border">

              <h3 className="text-lg font-semibold text-purple-700 mb-5">
                Emotion Probability Distribution
              </h3>

              <div className="space-y-4">

                {Object.entries(result.all_predictions).map(
                  ([emotion, value]) => (

                    <div key={emotion}>

                      <div className="mb-1 flex justify-between">

                        <span className="capitalize font-medium">
                          {emotion}
                        </span>

                        <span>
                          {value}%
                        </span>

                      </div>

                      <div className="h-3 rounded-full bg-gray-200">

                        <div
                          className="h-3 rounded-full bg-purple-500"
                          style={{
                            width: `${value}%`,
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

                        {/* AI Disclaimer */}

            <div className="mt-8 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5">

              <h3 className="text-lg font-semibold text-yellow-700">
                AI Disclaimer
              </h3>

              <p className="mt-3 leading-7 text-gray-700">
                {result.disclaimer}
              </p>

            </div>

            {/* What's Next */}

            <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-6">

              <h3 className="text-lg font-semibold text-green-700">
  Analysis Completed
</h3>

<p className="mt-3 text-gray-700 leading-7">
  Facial expression analysis has been completed successfully.
  The detected emotion is only a supportive AI observation and
  should not be considered a psychological diagnosis.
</p>
            </div>

            {/* Redirect Box */}

            <div className="mt-8 rounded-xl bg-purple-700 p-5 text-center text-white">

              <h3 className="text-xl font-semibold">
                Face Analysis Completed Successfully
              </h3>

              {/* <p className="mt-2 text-purple-100">
                Redirecting to Self Assessment...
              </p> */}

            </div>

          </div>
        )}

        {/* Footer */}

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">

          <p>
            Digital Mental Health & Psychological Support System
          </p>

          <p className="mt-2">
            AI-assisted Face Analysis • Research Prototype
          </p>

          <p className="mt-2">
            This system provides supportive emotional indicators only and
            should not be used as a substitute for professional mental
            health assessment or diagnosis.
          </p>

        </div>

      </div>
    </div>
  );
}