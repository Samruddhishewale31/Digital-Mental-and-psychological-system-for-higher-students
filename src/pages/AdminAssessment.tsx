import AdminNavbar from "@/components/AdminNavbar";
import {
  ArrowLeft,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const assessmentData = [
  {
    name: "Self Assessment",
    count: 30,
  },
  {
    name: "Face",
    count: 15,
  },
  {
    name: "Voice",
    count: 12,
  },
  {
    name: "Voice + Self",
    count: 10,
  },
  {
    name: "Face + Self",
    count: 18,
  },
  {
    name: "All Three",
    count: 15,
  },
];

const AdminAssessment = () => {
  const navigate = useNavigate();

  const totalParticipants = assessmentData.reduce(
    (total, item) => total + item.count,
    0
  );


  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Assessment Analysis
            </h2>

            <p className="mt-1 text-muted-foreground">
              Analysis of the assessment methods selected by
              participating students.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-4 p-5">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">
                Anonymous Assessment Data
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Only aggregated assessment selections are displayed.
                Individual student identities and individual results
                are not visible.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Participants
              </p>

              <p className="text-3xl font-bold">
                {totalParticipants}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Selected Assessment Options
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Each student's selected assessment combination is
              counted as one option.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value: "Number of Students",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Students"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Option Cards */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Assessment Options
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assessmentData.map((item) => (
              <Card key={item.name}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    {item.name}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {item.count}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    participants
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Logic */}
        <Card>
          <CardHeader>
            <CardTitle>
              Assessment Counting Logic
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Each student is counted once according to the assessment
              option they selected.
            </p>

            <p>
              For example, a student selecting{" "}
              <span className="font-medium text-foreground">
                Face + Self
              </span>{" "}
              is counted only under{" "}
              <span className="font-medium text-foreground">
                Face + Self
              </span>
              .
            </p>

            <p>
              Face and Self are not counted separately for that
              student.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAssessment;