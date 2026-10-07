import { useState } from "react";
import {
  CalendarClock,
  Upload,
  FileText,
  CheckCircle2,
  Bell,
} from "lucide-react";

const AdminExamSchedule = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Exam Schedule</h1>
          </div>

          <p className="text-muted-foreground">
            Upload the examination timetable and generate assessment reminders
            for students before their exams.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Upload className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">
                Upload Examination Timetable
              </h2>

              <p className="text-sm text-muted-foreground">
                The system will read the timetable and identify examination
                dates.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 hover:bg-muted/50">
            <Upload className="mb-3 h-9 w-9" />

            <span className="text-sm font-medium">
              Choose Examination Timetable
            </span>

            <span className="mt-1 text-xs text-muted-foreground">
              PDF, DOC, DOCX or XLSX
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {fileName && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border p-3">
              <FileText className="h-5 w-5" />

              <span className="text-sm flex-1">{fileName}</span>

              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          <button
            disabled={!fileName}
            className="mt-4 flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Upload & Read Timetable
          </button>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <CalendarClock className="h-6 w-6" />

            <div>
              <h2 className="text-xl font-semibold">Upcoming Examinations</h2>
              <p className="text-sm text-muted-foreground">
                Exams extracted from the uploaded timetable will appear here.
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-5 text-center">
            <p className="text-sm text-muted-foreground">
              No examination timetable has been uploaded yet.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6" />

            <div>
              <h2 className="text-xl font-semibold">
                Automatic Assessment Reminders
              </h2>

              <p className="text-sm text-muted-foreground">
                Students will receive an assessment reminder 7 days before
                their examination.
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">
              Assessment reminders will be generated automatically after the
              examination timetable is processed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminExamSchedule;
