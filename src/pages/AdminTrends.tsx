
import AdminNavbar from "@/components/AdminNavbar";
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// MindEase purple theme
const PURPLE = "#7C3AED";
const LIGHT_PURPLE = "#C084FC";
const DARK_PURPLE = "#9333EA";
const DEEP_PURPLE = "#581C87";
const GRID_PURPLE = "#E9D5FF";

const monthlyData = [
  {
    month: "May",
    assessments: 12,
    anxiety: 35,
    depression: 30,
    risk: 8,
  },
  {
    month: "Jun",
    assessments: 18,
    anxiety: 38,
    depression: 32,
    risk: 10,
  },
  {
    month: "Jul",
    assessments: 25,
    anxiety: 40,
    depression: 35,
    risk: 12,
  },
  {
    month: "Aug",
    assessments: 31,
    anxiety: 42,
    depression: 37,
    risk: 14,
  },
  {
    month: "Sep",
    assessments: 42,
    anxiety: 45,
    depression: 40,
    risk: 17,
  },
  {
    month: "Oct",
    assessments: 53,
    anxiety: 48,
    depression: 43,
    risk: 20,
  },
];

const AdminTrends = () => {
  const navigate = useNavigate();

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
              Trends & Patterns
            </h2>

            <p className="mt-1 text-muted-foreground">
              Monitor changes in student participation and aggregated
              mental-health patterns over time.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-4 p-5">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">
                Aggregated Trend Analysis
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Trends represent overall statistics and do not reveal
                individual student identities or personal assessment
                records.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>
              Assessment Activity Over Time
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Number of completed assessments recorded each month.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    stroke={GRID_PURPLE}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B21A8" }}
                    axisLine={{ stroke: "#D8B4FE" }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6B21A8" }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Assessments",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#6B21A8",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FAF5FF",
                      border: "1px solid #D8B4FE",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: PURPLE,
                    }}
                    labelStyle={{
                      color: DEEP_PURPLE,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="assessments"
                    name="Assessments"
                    stroke={PURPLE}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: PURPLE,
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 7,
                      fill: PURPLE,
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mental Health Trends */}
        <Card>
          <CardHeader>
            <CardTitle>
              Mental Health Pattern Trends
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Aggregated percentage patterns observed over time.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    stroke={GRID_PURPLE}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B21A8" }}
                    axisLine={{ stroke: "#D8B4FE" }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#6B21A8" }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Percentage",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#6B21A8",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FAF5FF",
                      border: "1px solid #D8B4FE",
                      borderRadius: "10px",
                    }}
                    labelStyle={{
                      color: DEEP_PURPLE,
                    }}
                  />

                  <Legend />

                  {/* Anxiety - Light Purple */}
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    name="Anxiety"
                    stroke={LIGHT_PURPLE}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: LIGHT_PURPLE,
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                  />

                  {/* Depression - Medium Purple */}
                  <Line
                    type="monotone"
                    dataKey="depression"
                    name="Depression"
                    stroke={DARK_PURPLE}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: DARK_PURPLE,
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                  />

                  {/* Higher Risk - Deep Purple */}
                  <Line
                    type="monotone"
                    dataKey="risk"
                    name="Higher Risk"
                    stroke={DEEP_PURPLE}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: DEEP_PURPLE,
                      stroke: "#FFFFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Summary */}
        <div className="grid gap-4 md:grid-cols-3">

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="mb-3 h-6 w-6 text-primary" />

              <p className="text-sm text-muted-foreground">
                Assessment Activity
              </p>

              <p className="mt-1 text-2xl font-bold">
                Increasing
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Based on the displayed monthly trend.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="mb-3 h-6 w-6 text-primary" />

              <p className="text-sm text-muted-foreground">
                Anxiety Pattern
              </p>

              <p className="mt-1 text-2xl font-bold">
                Monitor
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Track changes across future assessment periods.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="mb-3 h-6 w-6 text-primary" />

              <p className="text-sm text-muted-foreground">
                Risk Pattern
              </p>

              <p className="mt-1 text-2xl font-bold">
                Monitor
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Useful for planning university support services.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Note */}
        <Card>
          <CardHeader>
            <CardTitle>
              About the Trends
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            <p>
              Trend analysis helps the university understand changes
              in overall student participation and mental-health
              indicators across different periods. These values are
              currently demonstration data and should be replaced with
              actual aggregated project data when the backend is
              connected.
            </p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminTrends;
