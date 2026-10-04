import {
  Users,
  ClipboardCheck,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AdminNavbar from "@/components/AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      
      {/* ADMIN NAVBAR ONLY */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>

          <p className="text-muted-foreground">
            Monitor student mental health assessment and participation data.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>

              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                1,248
              </div>

              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Assessments
              </CardTitle>

              <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                876
              </div>

              <p className="text-xs text-muted-foreground">
                Completed assessments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Students at Risk
              </CardTitle>

              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                124
              </div>

              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Participation
              </CardTitle>

              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                70.2%
              </div>

              <p className="text-xs text-muted-foreground">
                Overall participation
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Admin Options
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate("/admin/assessment")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Assessment Analysis
                  <ArrowRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View student assessment results and psychological screening data.
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate("/admin/mental-health")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Mental Health
                  <ArrowRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor stress, anxiety and depression indicators.
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate("/admin/trends")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Trends
                  <ArrowRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze mental health trends and changes over time.
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate("/admin/participation")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Participation
                  <ArrowRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View student engagement and platform participation.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
