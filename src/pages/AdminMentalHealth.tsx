
import AdminNavbar from "@/components/AdminNavbar";
import {
  ArrowLeft,
  ShieldCheck,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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

// Purple shades based on severity level
const levelColors: Record<string, string> = {
  Low: "#E9D5FF",
  Moderate: "#C084FC",
  High: "#9333EA",
  Severe: "#581C87",

  "Low Risk": "#E9D5FF",
  "Moderate Risk": "#C084FC",
  "High Risk": "#9333EA",
  "Severe Risk": "#581C87",
};

const anxietyData = [
  { name: "Low", value: 42 },
  { name: "Moderate", value: 28 },
  { name: "High", value: 20 },
  { name: "Severe", value: 10 },
];

const depressionData = [
  { name: "Low", value: 48 },
  { name: "Moderate", value: 27 },
  { name: "High", value: 17 },
  { name: "Severe", value: 8 },
];

const riskData = [
  { name: "Low Risk", value: 50 },
  { name: "Moderate Risk", value: 25 },
  { name: "High Risk", value: 15 },
  { name: "Severe Risk", value: 5 },
];

const AdminMentalHealth = () => {
  const navigate = useNavigate();

  // Reusable Pie Chart
  const renderPieChart = (
    data: { name: string; value: number }[]
  ) => (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((item) => (
            <Cell
              key={item.name}
              fill={levelColors[item.name]}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#FAF5FF",
            border: "1px solid #D8B4FE",
            borderRadius: "10px",
            color: "#581C87",
          }}
          itemStyle={{
            color: "#7C3AED",
          }}
        />

        <Legend
          wrapperStyle={{
            color: "#6B21A8",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

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
              Mental Health Analysis
            </h2>

            <p className="mt-1 text-muted-foreground">
              Aggregated anxiety, depression and risk-level
              statistics.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-4 p-5">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <h3 className="font-semibold">
                Anonymous Analytics
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                These charts show overall patterns across participants.
                Individual student assessment results are not displayed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Anxiety
                </p>

                <p className="text-2xl font-bold">
                  42%
                </p>

                <p className="text-xs text-muted-foreground">
                  Low anxiety
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Depression
                </p>

                <p className="text-2xl font-bold">
                  48%
                </p>

                <p className="text-xs text-muted-foreground">
                  Low depression
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Overall Risk
                </p>

                <p className="text-2xl font-bold">
                  50%
                </p>

                <p className="text-xs text-muted-foreground">
                  Low risk
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Anxiety Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Anxiety Level Distribution
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribution of participants according to anxiety level.
            </p>
          </CardHeader>

          <CardContent>
            {renderPieChart(anxietyData)}
          </CardContent>
        </Card>

        {/* Depression Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Depression Level Distribution
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribution of participants according to depression level.
            </p>
          </CardHeader>

          <CardContent>
            {renderPieChart(depressionData)}
          </CardContent>
        </Card>

        {/* Risk Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Overall Risk Level
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Aggregated risk-level distribution across participants.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    stroke="#E9D5FF"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
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
                      value: "Participants",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#6B21A8",
                    }}
                  />

                  <Tooltip
                    cursor={{ fill: "#F3E8FF" }}
                    contentStyle={{
                      backgroundColor: "#FAF5FF",
                      border: "1px solid #D8B4FE",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: "#7C3AED",
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Participants"
                    radius={[8, 8, 0, 0]}
                  >
                    {riskData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={levelColors[item.name]}
                        stroke="#FFFFFF"
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Colour Legend */}
        <Card>
          <CardHeader>
            <CardTitle>
              Severity Colour Guide
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-6">
            {[
              { name: "Low", color: "#E9D5FF" },
              { name: "Moderate", color: "#C084FC" },
              { name: "High", color: "#9333EA" },
              { name: "Severe", color: "#581C87" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle>
              Interpretation
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            <p>
              The administrator can use these aggregated results to
              understand general mental-health patterns among students
              and identify areas where additional counselling or
              wellness programs may be required.
            </p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default AdminMentalHealth;
