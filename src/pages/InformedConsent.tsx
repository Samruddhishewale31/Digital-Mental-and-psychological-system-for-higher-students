import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InformedConsent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [consentGiven, setConsentGiven] = useState(false);

  const assessmentType = location.state?.assessmentType || "self";

  const getAssessmentData = () => {
    switch (assessmentType) {
      case "face":
        return (
          <li>
            Facial images and emotional expressions may be captured and
            analyzed as part of the assessment.
          </li>
        );

      case "voice":
        return (
          <li>
            Voice/audio data may be recorded and analyzed as part of the
            assessment.
          </li>
        );

      case "face-self":
        return (
          <>
            <li>
              Your questionnaire responses will be collected and analyzed as
              part of the screening.
            </li>
            <li>
              Facial images and emotional expressions may also be captured and
              analyzed.
            </li>
          </>
        );

      case "voice-self":
        return (
          <>
            <li>
              Your questionnaire responses will be collected and analyzed as
              part of the screening.
            </li>
            <li>
              Voice/audio data may also be recorded and analyzed.
            </li>
          </>
        );

      case "complete":
        return (
          <>
            <li>
              Your questionnaire responses will be collected and analyzed as
              part of the screening.
            </li>
            <li>
              Facial images and emotional expressions may be captured and
              analyzed.
            </li>
            <li>
              Voice/audio data may be recorded and analyzed.
            </li>
          </>
        );

      default:
        return (
          <li>
            Your questionnaire responses will be collected and analyzed as
            part of the screening.
          </li>
        );
    }
  };

  const handleContinue = () => {
    if (!consentGiven) return;

    switch (assessmentType) {
      case "face":
        navigate("/face-analysis");
        break;

      case "voice":
        navigate("/voice-analysis");
        break;

      case "face-self":
        navigate("/face-combined");
        break;

      case "voice-self":
        navigate("/voice-combined");
        break;

      case "complete":
        navigate("/complete-analysis");
        break;

      default:
        navigate("/assessment");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#312016]">
            Informed Consent
          </h1>

          <p className="mt-3 text-gray-600">
            Please read the following information carefully before continuing
            with the assessment.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#312016] mb-2">
            Purpose of the Assessment
          </h2>

          <p className="text-gray-700 leading-7">
            This mental wellness screening is designed to identify possible
            indicators of stress, anxiety, and emotional distress. It is
            intended to provide supportive information and is not a replacement
            for professional medical or psychological evaluation.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#312016] mb-3">
            Important Information
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-6">
            <li>
              This is a screening tool and does not provide a medical or
              psychological diagnosis.
            </li>

            <li>
              Participation in this assessment is voluntary.
            </li>

            {getAssessmentData()}

            <li>
              The information collected will be handled confidentially and
              used only for the purposes specified by this project.
            </li>

            <li>
              You may choose not to continue with the assessment at any time.
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-[#FFF9F4] mb-7">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 w-5 h-5 cursor-pointer accent-[#B7202F]"
            />

            <span className="text-gray-700 leading-6">
              I have read and understood the above information and voluntarily
              consent to proceed with this assessment.
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Go Back
          </button>

          <button
            type="button"
            disabled={!consentGiven}
            onClick={handleContinue}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              consentGiven
                ? "bg-[#B7202F] text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            I Agree & Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default InformedConsent;