import { useEffect, useState } from "react";
import { Trash2, History, Brain, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  getCompleteAssessmentHistory,
  CompleteAssessmentHistoryItem,
} from "@/utils/historyStorage";

const AssessmentHistory = () => {

  const [history, setHistory] = useState<
    CompleteAssessmentHistoryItem[]
  >([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getCompleteAssessmentHistory());
  };


  /*
    Delete one complete assessment
  */

  const handleDelete = (id: string) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assessment?"
    );

    if (!confirmDelete) return;

    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "complete-assessment-history",
      JSON.stringify(updatedHistory)
    );

    setHistory(updatedHistory);
  };


  /*
    Delete all complete assessments
  */

  const handleClear = () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to clear all assessment history?"
    );

    if (!confirmDelete) return;

    localStorage.removeItem(
      "complete-assessment-history"
    );

    setHistory([]);
  };


  return (

    <div className="container mx-auto px-5 py-12">

      <div className="max-w-5xl mx-auto">


        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-3">

            <History
              className="w-8 h-8 text-primary"
            />

            <div>

              <h1 className="text-3xl font-bold">
                Assessment History
              </h1>

              <p className="text-muted-foreground">
                View your previous complete wellness assessments.
              </p>

            </div>

          </div>


          {history.length > 0 && (

            <Button
              variant="destructive"
              onClick={handleClear}
            >
              Clear All
            </Button>

          )}

        </div>


        {/* EMPTY STATE */}

        {history.length === 0 ? (

          <div className="text-center bg-card rounded-3xl shadow p-10">

            <History
              className="mx-auto w-14 h-14 text-muted-foreground mb-5"
            />

            <h2 className="text-2xl font-semibold">
              No Complete Assessments Yet
            </h2>

            <p className="mt-3 text-muted-foreground">
              Complete the Self Assessment, Face Analysis
              and Voice Analysis to generate a complete report.
            </p>

          </div>

        ) : (

          <div className="space-y-6">


            {history.map((item) => (

              <div
                key={item.id}
                className="bg-card rounded-2xl shadow p-6 border"
              >


                {/* TOP SECTION */}

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="text-xl font-bold">
                      {item.riskLevel}
                    </h3>

                    <p className="text-muted-foreground mt-1">
                      {item.date}
                    </p>

                  </div>


                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >

                    <Trash2 className="w-4 h-4" />

                  </Button>

                </div>


                {/* SCORE CARDS */}

                <div className="grid md:grid-cols-4 gap-4 mt-6">


                  {/* QUESTIONNAIRE */}

                  <div className="rounded-xl bg-gray-50 border p-5">

                    <p className="text-sm text-muted-foreground">
                      Self Assessment
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {item.questionnaireScore}/30
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.questionnairePercentage}%
                    </p>

                  </div>


                  {/* FACE */}

                  <div className="rounded-xl bg-gray-50 border p-5">

                    <div className="flex items-center gap-2">

                      <Brain className="w-5 h-5 text-primary" />

                      <p className="text-sm text-muted-foreground">
                        Face Analysis
                      </p>

                    </div>

                    <h3 className="text-2xl font-bold mt-2">
                      {item.faceScore}%
                    </h3>

                    {item.faceEmotion && (

                      <p className="text-sm text-gray-500 mt-1">
                        {item.faceEmotion}
                      </p>

                    )}

                  </div>


                  {/* VOICE */}

                  <div className="rounded-xl bg-gray-50 border p-5">

                    <div className="flex items-center gap-2">

                      <Mic className="w-5 h-5 text-primary" />

                      <p className="text-sm text-muted-foreground">
                        Voice Analysis
                      </p>

                    </div>

                    <h3 className="text-2xl font-bold mt-2">
                      {item.voiceScore}%
                    </h3>

                    {item.voiceEmotion && (

                      <p className="text-sm text-gray-500 mt-1">
                        {item.voiceEmotion}
                      </p>

                    )}

                  </div>


                  {/* OVERALL */}

                  <div className="rounded-xl bg-purple-50 border border-purple-200 p-5">

                    <p className="text-sm text-muted-foreground">
                      Overall Score
                    </p>

                    <h3 className="text-2xl font-bold text-purple-700 mt-2">
                      {item.overallScore}%
                    </h3>

                    <p className="text-sm text-purple-600 mt-1">
                      {item.riskLevel}
                    </p>

                  </div>

                </div>


                {/* FACE OBSERVATION */}

                {item.faceObservation && (

                  <div className="mt-6">

                    <h4 className="font-semibold">
                      Face Analysis Summary
                    </h4>

                    <p className="mt-2 text-muted-foreground">
                      {item.faceObservation}
                    </p>

                  </div>

                )}


                {/* VOICE SUMMARY */}

                {item.voiceCue && (

                  <div className="mt-5">

                    <h4 className="font-semibold">
                      Voice Analysis Summary
                    </h4>

                    <p className="mt-2 text-muted-foreground">
                      {item.voiceCue}
                    </p>

                  </div>

                )}


                {/* WEIGHTAGE */}

                <div className="mt-6 rounded-xl bg-muted p-5">

                  <h4 className="font-semibold mb-3">
                    Analysis Weightage
                  </h4>

                  <div className="grid grid-cols-3 gap-4 text-center">

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Self Assessment
                      </p>

                      <p className="font-bold">
                        60%
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Face
                      </p>

                      <p className="font-bold">
                        20%
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Voice
                      </p>

                      <p className="font-bold">
                        20%
                      </p>

                    </div>

                  </div>

                </div>


              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
};

export default AssessmentHistory;