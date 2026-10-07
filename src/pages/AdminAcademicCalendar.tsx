import { useState } from "react";
import { CalendarDays, Upload, FileText, CheckCircle2 } from "lucide-react";

const AdminAcademicCalendar = () => {
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
            <CalendarDays className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Academic Calendar</h1>
          </div>
          <p className="text-muted-foreground">
            Upload and manage the tentative academic calendar for the academic year.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <CalendarDays className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">Academic Year</h2>
                <p className="text-sm text-muted-foreground">
                  Select the academic year
                </p>
              </div>
            </div>

            <select className="w-full rounded-md border bg-background px-3 py-2">
              <option>2026 - 2027</option>
              <option>2027 - 2028</option>
              <option>2028 - 2029</option>
            </select>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <Upload className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">
                  Upload Academic Calendar
                </h2>
                <p className="text-sm text-muted-foreground">
                  Upload the tentative calendar received from the university.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 hover:bg-muted/50">
              <Upload className="mb-3 h-8 w-8" />
              <span className="text-sm font-medium">
                Choose Academic Calendar
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Upload Calendar
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Current Calendar</h2>
          <p className="text-sm text-muted-foreground">
            No academic calendar has been uploaded yet.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminAcademicCalendar;
