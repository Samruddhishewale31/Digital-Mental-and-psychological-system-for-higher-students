import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminNavbar from "@/components/AdminNavbar";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      email === "admin@mindease.com" &&
      password === "admin123"
    ) {
      sessionStorage.setItem("mindease-admin-auth", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ADMIN NAVBAR ONLY */}
      <AdminNavbar />

      <main className="container mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        
        {/* Left Section */}
        <section className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                MindEase Admin
              </h1>
              <p className="text-muted-foreground">
                University Mental Health Analytics
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Monitor student wellbeing.
            <br />
            <span className="text-primary">
              Make informed decisions.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-muted-foreground">
            Access aggregated mental health assessment,
            participation and wellbeing trends through the
            administrative dashboard.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <ShieldCheck className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold">Secure Access</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Restricted administrative access.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <Sparkles className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View wellbeing trends and participation.
              </p>
            </div>
          </div>
        </section>

        {/* Login Card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-7 w-7 text-primary" />
              </div>

              <h2 className="text-2xl font-bold">
                Admin Login
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access the administrative dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <label
                  htmlFor="admin-email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@mindease.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="admin-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
              >
                Login to Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-xl bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">
                Demo Admin Credentials
              </p>

              <p className="text-xs text-muted-foreground">
                Email: admin@mindease.com
              </p>

              <p className="text-xs text-muted-foreground">
                Password: admin123
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Heart className="h-4 w-4" />
              Back to Student Home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
