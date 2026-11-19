
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import {
  getLastMindEaseId,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  requestIdRecovery,
  verifyIdRecovery,
  requestPasswordReset,
  confirmPasswordReset,
} from "@/auth/authService";

type AuthMode = "login" | "register" | "forgotId" | "forgotPassword";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { user, login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>(
    searchParams.get("register") === "true" ? "register" : "login"
  );

  const [mindEaseId, setMindEaseId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [createdId, setCreatedId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMindEaseId(getLastMindEaseId());
  }, []);

  useEffect(() => {
    if (user && !createdId) {
      navigate("/home", { replace: true });
    }
  }, [user, createdId, navigate]);

  useEffect(() => {
    setMode(
      searchParams.get("register") === "true" ? "register" : "login"
    );
  }, [searchParams]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setRegistrationCode("");
    setOtpSent(false);
    setEmailVerified(false);
    clearMessages();

    if (nextMode === "register") {
      navigate("/auth?register=true", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  };

  const validateCollegeEmail = () => {
    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@somaiya\.edu$/.test(normalized)) {
      setError("Please use your official @somaiya.edu email address.");
      return false;
    }

    return true;
  };

  // Send registration OTP.
  const handleSendRegistrationOtp = async () => {
    clearMessages();

    if (!validateCollegeEmail()) return;

    try {
      setLoading(true);

      await sendRegistrationOtp(email.trim().toLowerCase());

      setOtpSent(true);
      setEmailVerified(false);
      setSuccess("Verification code sent. Please check your college email.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify registration OTP.
  const handleVerifyRegistrationOtp = async () => {
    clearMessages();

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the six-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyRegistrationOtp(
        email.trim().toLowerCase(),
        otp.trim()
      );

      setEmailVerified(true);
      setSuccess("College email verified successfully. You can now create your account.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // Create account after verification.
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (!emailVerified) {
      setError("Please verify your college email first.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must contain between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const newUser = await register(
        email.trim().toLowerCase(),
        password,
        registrationCode.trim() || undefined
      );

      setCreatedId(newUser.id);
      setPassword("");
      setConfirmPassword("");
      setSuccess("Your MindEase account has been created.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // Login.
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (!mindEaseId.trim() || !password) {
      setError("Please enter your MindEase ID and password.");
      return;
    }

    try {
      setLoading(true);

      await login(mindEaseId.trim().toUpperCase(), password);

      const redirectPath =
        (location.state as { from?: string } | null)?.from || "/home";

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot ID: send OTP.
  const handleSendIdOtp = async () => {
    clearMessages();

    if (!validateCollegeEmail()) return;

    try {
      setLoading(true);

      const result = await requestIdRecovery(email.trim().toLowerCase());

      setOtpSent(true);
      setSuccess(result.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to request ID recovery."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot ID: verify OTP.
  const handleRecoverId = async () => {
    clearMessages();

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the six-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const result = await verifyIdRecovery(
        email.trim().toLowerCase(),
        otp.trim()
      );

      setSuccess(result.message);
      setOtpSent(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to recover your ID."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: send OTP.
  const handleSendPasswordOtp = async () => {
    clearMessages();

    if (!validateCollegeEmail()) return;

    try {
      setLoading(true);

      const result = await requestPasswordReset(email.trim().toLowerCase());

      setOtpSent(true);
      setSuccess(result.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to request password reset."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: verify OTP and set new password.
  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the six-digit OTP.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must contain between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await confirmPasswordReset(
        email.trim().toLowerCase(),
        otp.trim(),
        password
      );

      setSuccess(result.message);
      setOtpSent(false);
      setPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(createdId);
      setCopied(true);
    } catch {
      setError("Unable to copy automatically. Please select and copy your ID.");
    }
  };

  // Registration success screen.
  if (createdId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl">
            ✓
          </div>

          <h1 className="text-2xl font-semibold mb-2">
            Your account is ready!
          </h1>

          <p className="text-muted-foreground mb-6">
            Your college email has been verified. Your MindEase account is
            ready to use.
          </p>

          <div className="rounded-xl border bg-muted/40 p-5 mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Your MindEase ID
            </p>

            <p className="text-2xl font-bold tracking-wider break-all">
              {createdId}
            </p>

            <button
              type="button"
              onClick={handleCopyId}
              className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              {copied ? "Copied!" : "Copy MindEase ID"}
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            You can find this ID in your profile and recover it using your
            verified college email if you ever forget it.
          </p>

          <button
            type="button"
            onClick={() => navigate("/home", { replace: true })}
            className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:opacity-90"
          >
            Continue to MindEase
          </button>
        </div>
      </div>
    );
  }

  const title =
    mode === "register"
      ? "Create your MindEase account"
      : mode === "forgotId"
        ? "Recover your MindEase ID"
        : mode === "forgotPassword"
          ? "Reset your password"
          : "Welcome back";

  const subtitle =
    mode === "register"
      ? "A private space for your student wellbeing journey."
      : mode === "forgotId"
        ? "Verify your college email to recover your ID."
        : mode === "forgotPassword"
          ? "We'll help you securely reset your password."
          : "Sign in to continue your wellness journey.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>

          <div className="rounded-xl bg-muted/50 border p-4 mb-6">
            <p className="text-sm font-medium mb-1">Your privacy matters</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your MindEase ID is used within the application. Your college
              email is used for affiliation verification and account recovery.
              It is not displayed publicly.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="mindEaseId" className="block text-sm font-medium mb-2">
                  MindEase ID
                </label>
                <input
                  id="mindEaseId"
                  type="text"
                  value={mindEaseId}
                  onChange={(event) =>
                    setMindEaseId(event.target.value.toUpperCase())
                  }
                  placeholder="ME-XXXXXXXX"
                  autoComplete="username"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => changeMode("forgotId")}
                  className="text-primary hover:underline"
                >
                  Forgot MindEase ID?
                </button>

                <button
                  type="button"
                  onClick={() => changeMode("forgotPassword")}
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="collegeEmail" className="block text-sm font-medium mb-2">
                  Somaiya College Email
                </label>

                <input
                  id="collegeEmail"
                  type="email"
                  value={email}
                  disabled={emailVerified}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@somaiya.edu"
                  autoComplete="email"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />

                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendRegistrationOtp}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send Verification OTP"}
                  </button>
                )}
              </div>

              {otpSent && !emailVerified && (
                <div>
                  <label htmlFor="registrationOtp" className="block text-sm font-medium mb-2">
                    Six-digit OTP
                  </label>

                  <input
                    id="registrationOtp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter OTP"
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyRegistrationOtp}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </div>
              )}

              {emailVerified && (
                <>
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-700">
                    College email verified successfully.
                  </div>

                  <div>
                    <label htmlFor="registrationCode" className="block text-sm font-medium mb-2">
                      College Registration Code (Optional)
                    </label>
                    <input
                      id="registrationCode"
                      value={registrationCode}
                      onChange={(event) => setRegistrationCode(event.target.value)}
                      placeholder="Enter code if provided"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-medium mb-2">
                      Create Password
                    </label>
                    <input
                      id="registerPassword"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your password again"
                      autoComplete="new-password"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Creating account..." : "Create MindEase Account"}
                  </button>
                </>
              )}
            </form>
          )}

          {mode === "forgotId" && (
            <div className="space-y-5">
              <div>
                <label htmlFor="recoveryEmail" className="block text-sm font-medium mb-2">
                  Registered College Email
                </label>
                <input
                  id="recoveryEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@somaiya.edu"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendIdOtp}
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Recovery OTP"}
                </button>
              ) : (
                <>
                  <div>
                    <label htmlFor="idOtp" className="block text-sm font-medium mb-2">
                      Six-digit OTP
                    </label>
                    <input
                      id="idOtp"
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRecoverId}
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Recover MindEase ID"}
                  </button>
                </>
              )}
            </div>
          )}

          {mode === "forgotPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium mb-2">
                  Registered College Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@somaiya.edu"
                  disabled={otpSent}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendPasswordOtp}
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Password Reset OTP"}
                </button>
              ) : (
                <>
                  <div>
                    <label htmlFor="resetOtp" className="block text-sm font-medium mb-2">
                      Six-digit OTP
                    </label>
                    <input
                      id="resetOtp"
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your new password again"
                      autoComplete="new-password"
                      className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <>
                Don't have a MindEase account?
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                  className="ml-1 font-medium text-primary hover:underline"
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => changeMode("login")}
                className="font-medium text-primary hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>

          {mode === "login" && (
            <div className="mt-7">
              <div className="relative flex items-center mb-5">
                <div className="flex-grow border-t border-border" />
                <span className="px-3 text-xs text-muted-foreground bg-card">
                  ADMIN ACCESS
                </span>
                <div className="flex-grow border-t border-border" />
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin-login")}
                className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-primary font-medium hover:bg-primary/10"
              >
                Login as Admin
              </button>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                For authorized MindEase administrators only.
              </p>
            </div>
          )}

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
