import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Brain,
  Activity,
} from "lucide-react";

import {
  getProgressRecords,
  ProgressRecord,
} from "@/utils/historyStorage";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  format,
  startOfWeek,
  startOfMonth,
} from "date-fns";

type ViewMode = "weekly" | "monthly";

type TrendData = {
  label: string;
  mood?: number;
  anxiety?: number;
  depression?: number;
  wellness?: number;
};

const ProgressDashboard = () => {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [viewMode, setViewMode] =
    useState<ViewMode>("weekly");

  /* =====================================================
     LOAD PROGRESS
  ===================================================== */

 useEffect(() => {
  const loadProgress = () => {
    setRecords(getProgressRecords());
  };

  loadProgress();

  window.addEventListener("storage", loadProgress);
  window.addEventListener("wellness-report-updated", loadProgress);
  window.addEventListener("focus", loadProgress);

  return () => {
    window.removeEventListener("storage", loadProgress);
    window.removeEventListener(
      "wellness-report-updated",
      loadProgress
    );
    window.removeEventListener("focus", loadProgress);
  };
}, []);

  /* =====================================================
     SORT RECORDS
  ===================================================== */

  const sortedRecords = useMemo(() => {
    return [...records].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [records]);

  const latestRecord =
    sortedRecords.length > 0
      ? sortedRecords[
          sortedRecords.length - 1
        ]
      : null;

  /* =====================================================
     COUNT
  ===================================================== */

  const assessmentCount =
    sortedRecords.length;
/* =====================================================
   AVAILABLE METRICS
===================================================== */

const hasMoodData = sortedRecords.some(
  (record) =>
    record.moodScore !== undefined
);

const hasAnxietyData = sortedRecords.some(
  (record) =>
    record.anxietyScore !== undefined
);

const hasDepressionData = sortedRecords.some(
  (record) =>
    record.depressionScore !== undefined
);

const hasWellnessData = sortedRecords.some(
  (record) =>
    record.wellnessScore !== undefined
);
  /* =====================================================
     LATEST WELLNESS
  ===================================================== */

  const latestWellness =
    latestRecord?.wellnessScore;

  /* =====================================================
     IMPROVEMENT
     Higher wellness = better
  ===================================================== */

  const firstWellness =
    sortedRecords.find(
      (record) =>
        record.wellnessScore !== undefined
    )?.wellnessScore;

  const improvement =
    firstWellness !== undefined &&
    latestWellness !== undefined
      ? latestWellness - firstWellness
      : undefined;

  /* =====================================================
     TREND DATA
  ===================================================== */

  const trendData = useMemo(() => {
    const grouped: Record<
      string,
      {
        date: Date;
        mood: number[];
        anxiety: number[];
        depression: number[];
        wellness: number[];
      }
    > = {};

    sortedRecords.forEach((record) => {
      const date = new Date(record.date);

      const periodDate =
        viewMode === "weekly"
          ? startOfWeek(date, {
              weekStartsOn: 1,
            })
          : startOfMonth(date);

      const key =
        periodDate.toISOString();

      if (!grouped[key]) {
        grouped[key] = {
          date: periodDate,
          mood: [],
          anxiety: [],
          depression: [],
          wellness: [],
        };
      }

      if (
        record.moodScore !== undefined
      ) {
        grouped[key].mood.push(
          record.moodScore
        );
      }

      if (
        record.anxietyScore !== undefined
      ) {
        grouped[key].anxiety.push(
          record.anxietyScore
        );
      }

      if (
        record.depressionScore !==
        undefined
      ) {
        grouped[key].depression.push(
          record.depressionScore
        );
      }

      if (
        record.wellnessScore !==
        undefined
      ) {
        grouped[key].wellness.push(
          record.wellnessScore
        );
      }
    });

    return Object.values(grouped)
      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      )
      .map((item) => ({
        label:
          viewMode === "weekly"
            ? format(
                item.date,
                "dd MMM"
              )
            : format(
                item.date,
                "MMM yyyy"
              ),

        mood:
          item.mood.length
            ? Math.round(
                item.mood.reduce(
                  (a, b) => a + b,
                  0
                ) /
                  item.mood.length
              )
            : undefined,

        anxiety:
          item.anxiety.length
            ? Math.round(
                item.anxiety.reduce(
                  (a, b) => a + b,
                  0
                ) /
                  item.anxiety.length
              )
            : undefined,

        depression:
          item.depression.length
            ? Math.round(
                item.depression.reduce(
                  (a, b) => a + b,
                  0
                ) /
                  item.depression.length
              )
            : undefined,

        wellness:
          item.wellness.length
            ? Math.round(
                item.wellness.reduce(
                  (a, b) => a + b,
                  0
                ) /
                  item.wellness.length
              )
            : undefined,
      }));
  }, [sortedRecords, viewMode]);

  /* =====================================================
     NO DATA
  ===================================================== */

  if (assessmentCount === 0) {
    return (
      <section
        id="progress"
        className="container mx-auto px-4 py-20"
      >
        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">

          <BarChart3
            className="mx-auto text-primary mb-5"
            size={60}
          />

          <h2 className="text-3xl font-bold">
            My Progress
          </h2>

          <p className="mt-4 text-muted-foreground">
            Your progress will appear here
            after you complete an assessment.
          </p>

        </div>
      </section>
    );
  }

  return (
    <section
      id="progress"
      className="container mx-auto px-4 py-20"
    >

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3 mb-3">

          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart3
              className="text-primary"
              size={25}
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold">
            My Progress
          </h2>

        </div>

        <p className="text-muted-foreground">
          Track your emotional wellbeing
          journey over time.
        </p>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <DashboardCard
          icon={<Activity />}
          title="Assessments"
          value={assessmentCount.toString()}
        />

        <DashboardCard
          icon={<Brain />}
          title="Latest Wellness"
          value={
            latestWellness !== undefined
              ? `${Math.round(
                  latestWellness
                )}%`
              : "N/A"
          }
        />

        <DashboardCard
          icon={
            improvement !== undefined &&
            improvement >= 0 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )
          }
          title="Improvement"
          value={
            improvement !== undefined
              ? `${
                  improvement >= 0
                    ? "+"
                    : ""
                }${Math.round(
                  improvement
                )}%`
              : "N/A"
          }
        />

        <DashboardCard
          icon={<CheckCircle2 />}
          title="Latest Analysis"
          value={
            latestRecord?.assessmentType ||
            "Available"
          }
        />

      </div>

      {/* WEEKLY / MONTHLY */}

      <div className="flex justify-center mb-8">

        <div className="bg-white rounded-2xl shadow-sm border p-2 inline-flex gap-2">

          <button
            onClick={() =>
              setViewMode("weekly")
            }
            className={`px-6 py-2.5 rounded-xl font-semibold transition ${
              viewMode === "weekly"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Weekly
          </button>

          <button
            onClick={() =>
              setViewMode("monthly")
            }
            className={`px-6 py-2.5 rounded-xl font-semibold transition ${
              viewMode === "monthly"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>

        </div>

      </div>

      {/* GRAPHS */}

<div className="grid lg:grid-cols-2 gap-6">

  {hasMoodData && (
    <TrendCard
      title="Mood Trend"
      description="Your emotional wellbeing trend."
      data={trendData}
      dataKey="mood"
      color="#9333ea"
      emptyText="Mood data is not available yet."
    />
  )}

  {hasAnxietyData && (
    <TrendCard
      title="Anxiety Trend"
      description="Changes in your anxiety indicator."
      data={trendData}
      dataKey="anxiety"
      color="#2563eb"
      emptyText="Anxiety data is not available yet."
    />
  )}

  {hasDepressionData && (
    <TrendCard
      title="Depression Trend"
      description="Changes in your depression indicator."
      data={trendData}
      dataKey="depression"
      color="#db2777"
      emptyText="Depression data is not available yet."
    />
  )}

  {hasWellnessData && (
    <TrendCard
      title="Improvement Over Time"
      description="Your overall wellbeing trend."
      data={trendData}
      dataKey="wellness"
      color="#16a34a"
      emptyText="Wellness data is not available yet."
    />
  )}

</div>

      {/* RECENT ACTIVITY */}

      <div className="mt-8 bg-white rounded-3xl shadow-sm border p-6">

        <h3 className="text-xl font-bold mb-5">
          Recent Assessments
        </h3>

        <div className="space-y-3">

          {[...sortedRecords]
            .reverse()
            .slice(0, 5)
            .map((record) => (

              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50"
              >

                <div>
                  <p className="font-semibold">
                    {record.assessmentType}
                  </p>

                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(record.date),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </p>
                </div>

                {record.wellnessScore !==
                  undefined && (
                  <span className="font-semibold text-primary">
                    {Math.round(
                      record.wellnessScore
                    )}
                    %
                  </span>
                )}

              </div>

            ))}

        </div>

      </div>

      {/* DISCLAIMER */}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">

        <h3 className="font-bold text-lg">
          About Your Progress
        </h3>

        <p className="mt-2 text-gray-600 leading-7">
          This dashboard is intended for
          personal monitoring of wellbeing
          indicators. It does not provide a
          medical or psychological diagnosis.
        </p>

      </div>

    </section>
  );
};


/* =====================================================
   DASHBOARD CARD
===================================================== */

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <div className="flex items-center gap-3 text-primary">

        {icon}

        <p className="text-sm text-gray-500">
          {title}
        </p>

      </div>

      <p className="text-3xl font-bold mt-4">
        {value}
      </p>

    </div>
  );
}


/* =====================================================
   TREND CARD
===================================================== */

function TrendCard({
  title,
  description,
  data,
  dataKey,
  color,
  emptyText,
}: {
  title: string;
  description: string;
  data: TrendData[];
  dataKey: keyof TrendData;
  color: string;
  emptyText: string;
}) {
  const hasData = data.some(
    (item) =>
      item[dataKey] !== undefined
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-gray-500 mt-1 mb-6 text-sm">
        {description}
      </p>

      {hasData ? (
        <div className="w-full h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                connectNulls
              />

            </LineChart>

          </ResponsiveContainer>

        </div>
      ) : (
        <div className="h-[320px] flex items-center justify-center text-center">
          <p className="text-gray-400 max-w-md">
            {emptyText}
          </p>
        </div>
      )}

    </div>
  );
}

export default ProgressDashboard;