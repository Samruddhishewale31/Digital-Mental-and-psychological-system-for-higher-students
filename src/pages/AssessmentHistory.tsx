import { useEffect, useState } from "react";
import { Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
 getAnxietyLevel,
 getDepressionLevel
} from "@/utils/riskLevelHelper";
import {
  getAssessmentHistory,
  deleteAssessment,
  clearAssessmentHistory,
  AssessmentHistoryItem,
} from "@/utils/historyStorage";

const AssessmentHistory = () => {

  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getAssessmentHistory());
  };

  const handleDelete = (id: string) => {
    deleteAssessment(id);
    loadHistory();
  };

  const handleClear = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all assessment history?"
    );

    if (confirmDelete) {
      clearAssessmentHistory();
      loadHistory();
    }
  };

  return (
    <div className="container mx-auto px-5 py-12">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-3">

            <History className="w-8 h-8 text-primary" />

            <div>

              <h1 className="text-3xl font-bold">
                Assessment History
              </h1>

              <p className="text-muted-foreground">
                View your previous mental wellness assessments.
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

        {/* Empty State */}

        {history.length === 0 ? (

          <div className="text-center bg-card rounded-3xl shadow p-10">

            <History className="mx-auto w-14 h-14 text-muted-foreground mb-5" />

            <h2 className="text-2xl font-semibold">

              No Assessments Yet

            </h2>

            <p className="mt-3 text-muted-foreground">

              Complete a mental wellness assessment to
              see your history here.

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {history.map((item) => (

              <div
                key={item.id}
                className="bg-card rounded-2xl shadow p-6 border"
              >

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
                    onClick={() => handleDelete(item.id)}
                  >

                    <Trash2 className="w-4 h-4" />

                  </Button>

                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-6">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Overall Score

                    </p>

                    <h3 className="text-xl font-bold">

                      {item.totalScore}/30

                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Depression

                    </p>

                    <h3 className="text-xl font-bold">

{getDepressionLevel(item.depressionScore)}

</h3>

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Anxiety

                    </p>

                    <h3 className="text-xl font-bold">
<h3 className="text-xl font-bold">

{getAnxietyLevel(item.anxietyScore)}

</h3>

                    </h3>

                  </div>

                </div>

                <div className="mt-6">

                  <h4 className="font-semibold">

                    Assessment Summary

                  </h4>

                  <p className="mt-2 text-muted-foreground">

                    {item.summary}

                  </p>

                </div>

                <div className="mt-5">

                  <h4 className="font-semibold">

                    Emotional Pattern

                  </h4>

                  <p className="text-primary mt-1">

                    {item.pattern}

                  </p>

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