import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    user,
    login,
    register,
  } = useAuth();

  /*
   * /auth?register=true
   * opens the registration screen directly.
   */
  const [isRegister, setIsRegister] = useState(
    searchParams.get("register") === "true"
  );

  const [mindEaseId, setMindEaseId] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [createdId, setCreatedId] = useState("");

  const [loading, setLoading] = useState(false);

  /*
   * If a user is already logged in and visits /auth,
   * send them to the private website.
   *
   * We use useEffect instead of navigate() directly
   * during render.
   */
  useEffect(() => {
    if (user && !createdId) {
      navigate("/home", {
        replace: true,
      });
    }
  }, [user, createdId, navigate]);

  /*
   * Keep the mode synchronized with:
   * /auth
   * /auth?register=true
   */
  useEffect(() => {
    setIsRegister(
      searchParams.get("register") === "true"
    );
  }, [searchParams]);

  /*
   * Submit
   */
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * ================================================
     * REGISTER
     * ================================================
     */

    if (isRegister) {
      if (password.length < 8) {
        setError(
          "Password must contain at least 8 characters."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        setLoading(true);

        /*
         * IMPORTANT:
         * Use AuthContext.register()
         * instead of registerUser() directly.
         *
         * This updates the global authentication state,
         * so Navbar immediately knows the user is logged in.
         */
        const newUser = await register(password);

        setCreatedId(newUser.id);

        setSuccess(
          "Your anonymous MindEase account has been created."
        );

        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    /*
     * ================================================
     * LOGIN
     * ================================================
     */

    if (!mindEaseId.trim()) {
      setError("Please enter your MindEase ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * Use AuthContext.login()
       * instead of loginUser() directly.
       *
       * This updates:
       *
       * AuthContext.user
       *       ↓
       * Navbar
       *       ↓
       * Profile appears
       */
      await login(
        mindEaseId.trim().toUpperCase(),
        password
      );

      /*
       * If the user originally tried to access
       * a protected page, send them there.
       *
       * Otherwise go to /home.
       */
      const redirectPath =
        (location.state as { from?: string } | null)
          ?.from || "/home";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ================================================
   * REGISTRATION SUCCESS SCREEN
   * ================================================
   */

  if (createdId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="rounded-2xl border bg-card p-8 shadow-sm text-center">

            <div className="mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">
                  ✓
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-semibold mb-2">
              Account Created
            </h1>

            <p className="text-muted-foreground mb-6">
              Your MindEase account is anonymous.
              No name or email is required.
            </p>

            <div className="rounded-xl border bg-muted/40 p-5 mb-5">
              <p className="text-sm text-muted-foreground mb-2">
                Your MindEase ID
              </p>

              <p className="text-2xl font-bold tracking-wider">
                {createdId}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Save this ID somewhere safe. You will need
              it to sign in again.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/home", {
                  replace: true,
                })
              }
              className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Continue to MindEase
            </button>

          </div>

        </div>
      </div>
    );
  }

  /*
   * ================================================
   * AUTH PAGE
   * ================================================
   */

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border bg-card p-8 shadow-sm">

          {/* Header */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-semibold">
              {isRegister
                ? "Create your MindEase account"
                : "Welcome back"}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {isRegister
                ? "Create an anonymous account to keep your wellness journey private."
                : "Sign in to continue your private wellness journey."}
            </p>

          </div>

          {/* Privacy note */}

          <div className="rounded-xl bg-muted/50 border p-4 mb-6">

            <p className="text-sm font-medium mb-1">
              Your privacy matters
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed">
              MindEase does not require your name, phone
              number, or email for this account. You will
              receive a unique anonymous MindEase ID.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
              <p className="text-sm text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Login ID */}

            {!isRegister && (
              <div>

                <label
                  htmlFor="mindEaseId"
                  className="block text-sm font-medium mb-2"
                >
                  MindEase ID
                </label>

                <input
                  id="mindEaseId"
                  type="text"
                  value={mindEaseId}
                  onChange={(e) =>
                    setMindEaseId(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="ME-XXXXXXXX"
                  autoComplete="username"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />

              </div>
            )}

            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete={
                  isRegister
                    ? "new-password"
                    : "current-password"
                }
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />

              {isRegister && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Use at least 8 characters.
                </p>
              )}

            </div>

            {/* Confirm password */}

            {isRegister && (
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />

              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? isRegister
                  ? "Creating account..."
                  : "Signing in..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>

          </form>

          {/* Switch mode */}

          <div className="mt-6 text-center">

            <p className="text-sm text-muted-foreground">

              {isRegister
                ? "Already have a MindEase account?"
                : "Don't have a MindEase account?"}

              <button
                type="button"
                onClick={() => {
                  const nextMode = !isRegister;

                  setIsRegister(nextMode);

                  setError("");
                  setSuccess("");
                  setMindEaseId("");
                  setPassword("");
                  setConfirmPassword("");

                  /*
                   * Update URL too.
                   *
                   * Register → /auth?register=true
                   * Login → /auth
                   */
                  navigate(
                    nextMode
                      ? "/auth?register=true"
                      : "/auth",
                    { replace: true }
                  );
                }}
                className="ml-1 font-medium text-primary hover:underline"
              >
                {isRegister
                  ? "Sign In"
                  : "Create Account"}
              </button>

            </p>

          </div>

          {/* Back home */}

          <div className="mt-5 text-center">

            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to MindEase
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Auth;