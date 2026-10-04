import AdminNavbar from "@/components/AdminNavbar";
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  UserCheck,
  ClipboardCheck,
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

const participationData = [
  {
    name: "Self Assessment",
    participants: 30,
  },
  {
    name: "Face",
    participants: 15,
  },
  {
    name: "Voice",
    participants: 12,
  },
  {
    name: "Voice + Self",
    participants: 10,
  },
  {
    name: "Face + Self",
    participants: 18,
  },
  {
    name: "All Three",
    participants: 15,
  },
];

const monthlyParticipation = [
  {
    month: "May",
    participants: 12,
  },
  {
    month: "Jun",
    participants: 18,
  },
  {
    month: "Jul",
    participants: 25,
  },
  {
    month: "Aug",
    participants: 31,
  },
  {
    month: "Sep",
    participants: 42,
  },
  {
    month: "Oct",
    participants: 53,
  },
];

const AdminParticipation = () => {
  const navigate = useNavigate();


  const totalParticipants = participationData.reduce(
    (total, item) => total + item.participants,
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
              Student Participation
            </h2>

            <p className="mt-1 text-muted-foreground">
              Aggregated participation statistics across the
              university.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-4 p-5">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">
                Student Privacy Maintained
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                This page displays only aggregated participation
                information. No student names, IDs, email addresses or
                individual assessment results are displayed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
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

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Participating Students
                </p>

                <p className="text-3xl font-bold">
                  {totalParticipants}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Assessment Options
                </p>

                <p className="text-3xl font-bold">
                  6
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participation by Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>
              Participation by Assessment Option
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Number of students selecting each assessment option.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={participationData}
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
                      value: "Students",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="participants"
                    name="Participants"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Participation */}
        <Card>
          <CardHeader>
            <CardTitle>
              Monthly Participation
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Number of participating students recorded each month.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyParticipation}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value: "Students",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="participants"
                    name="Participants"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Option Cards */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Participation by Selected Option
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {participationData.map((item) => (
              <Card key={item.name}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    {item.name}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {item.participants}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    participating students
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Note */}
        <Card>
          <CardHeader>
            <CardTitle>
              Participation Information
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            <p>
              Each student is represented through aggregated
              participation statistics. If a student selects a combined
              assessment such as Face + Self, the student remains under
              the single Face + Self category and is not counted
              separately under Face and Self.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminParticipation;