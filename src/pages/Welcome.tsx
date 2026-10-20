import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary/20" />

            <span className="text-2xl font-bold">
              MindEase
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-3xl shadow-sm p-8 md:p-12 text-center">

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Welcome to MindEase
          </h1>

          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            A private space to understand your wellbeing,
            reflect, and find support at your own pace.
          </p>

          {/* Privacy */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-muted/40 p-4">
              <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-2" />

              <p className="text-sm font-medium">
                Private
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                No name or email required
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4">
              <Lock className="w-5 h-5 text-primary mx-auto mb-2" />

              <p className="text-sm font-medium">
                Anonymous
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Get your own MindEase ID
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4">
              <Heart className="w-5 h-5 text-primary mx-auto mb-2" />

              <p className="text-sm font-medium">
                Your Space
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Your wellbeing journey
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              to="/auth?register=true"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-48"
              >
                Create Account
              </Button>
            </Link>

            <Link
              to="/auth"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="soft"
                className="w-full sm:w-48"
              >
                Sign In
              </Button>
            </Link>

          </div>

          {/* Small note */}
          <p className="mt-6 text-xs text-muted-foreground">
            Already have a MindEase ID? Sign in to continue.
          </p>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          MindEase is a private wellbeing support platform.
        </p>

      </div>
    </div>
  );
};

export default Welcome;