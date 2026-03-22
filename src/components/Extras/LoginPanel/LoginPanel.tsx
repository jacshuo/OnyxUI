import type { CSSProperties } from "react";
import React, { useState, useCallback } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../Primitives/Button";
import { Input } from "../../Primitives/Input";
import { Label } from "../../Primitives/Label";
import { Checkbox } from "../../Primitives/Checkbox";
import { OTPInput } from "../../Forms/OTPInput";
import { Kbd, KbdGroup } from "../../Primitives/Kbd";
import "./LoginPanel.css";

export type LoginPanelMode = "login" | "register" | "otp" | "forgot";

export interface LoginPanelProps {
  mode?: LoginPanelMode;
  onModeChange?: (mode: LoginPanelMode) => void;
  onLogin?: (email: string, password: string, rememberMe: boolean) => void | Promise<void>;
  onRegister?: (name: string, email: string, password: string) => void | Promise<void>;
  onOTPComplete?: (otp: string) => void | Promise<void>;
  onForgotPassword?: (email: string) => void | Promise<void>;
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  socialLogins?: Array<{ label: string; icon: React.ReactNode; onClick: () => void }>;
  showRememberMe?: boolean;
  isLoading?: boolean;
  error?: string;
  className?: string;
  style?: CSSProperties;
}

const defaultTitles: Record<LoginPanelMode, string> = {
  login: "Welcome back",
  register: "Create account",
  otp: "Verify your identity",
  forgot: "Reset password",
};

const defaultSubtitles: Record<LoginPanelMode, string> = {
  login: "Sign in to your account to continue",
  register: "Fill in the details to get started",
  otp: "Enter the 6-digit code sent to your email",
  forgot: "We'll send a reset link to your email",
};

export function LoginPanel({
  mode: controlledMode,
  onModeChange,
  onLogin,
  onRegister,
  onOTPComplete,
  onForgotPassword,
  logo,
  title,
  subtitle,
  socialLogins,
  showRememberMe = true,
  isLoading = false,
  error,
  className,
  style,
}: LoginPanelProps) {
  const [internalMode, setInternalMode] = useState<LoginPanelMode>("login");
  const isControlledMode = controlledMode !== undefined;
  const mode = isControlledMode ? controlledMode : internalMode;

  const setMode = useCallback(
    (m: LoginPanelMode) => {
      if (!isControlledMode) setInternalMode(m);
      onModeChange?.(m);
    },
    [isControlledMode, onModeChange],
  );

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot form state
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onLogin?.(email, password, rememberMe);
    },
    [email, password, rememberMe, onLogin],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onRegister?.(name, regEmail, regPassword);
    },
    [name, regEmail, regPassword, onRegister],
  );

  const handleForgot = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onForgotPassword?.(forgotEmail);
    },
    [forgotEmail, onForgotPassword],
  );

  const panelTitle = title ?? defaultTitles[mode];
  const panelSubtitle = subtitle ?? defaultSubtitles[mode];

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-primary-200 bg-white/90 p-8 shadow-xl backdrop-blur-md",
        "dark:border-primary-700 dark:bg-primary-900/90",
        className,
      )}
      style={style}
    >
      {/* Logo */}
      {logo && <div className="mb-6 flex justify-center">{logo}</div>}

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-primary-900 dark:text-primary-50">{panelTitle}</h2>
        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">{panelSubtitle}</p>
      </div>

      {/* Social logins */}
      {socialLogins && socialLogins.length > 0 && (
        <>
          <div className="mb-4 flex flex-col gap-2">
            {socialLogins.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={s.onClick}
                disabled={isLoading}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg border border-secondary-300 px-4 py-2 text-sm font-medium",
                  "text-secondary-700 transition-colors hover:bg-secondary-50",
                  "dark:border-secondary-600 dark:text-secondary-300 dark:hover:bg-secondary-800",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "[&_svg]:h-4 [&_svg]:w-4",
                )}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
          <div className="relative mb-4 flex items-center">
            <div className="flex-1 border-t border-secondary-200 dark:border-secondary-700" />
            <span className="mx-3 text-xs text-secondary-400 dark:text-secondary-500">
              or continue with
            </span>
            <div className="flex-1 border-t border-secondary-200 dark:border-secondary-700" />
          </div>
        </>
      )}

      {/* Animated form area */}
      <div className="login-panel-slide-enter" key={mode}>
        {/* ── LOGIN ── */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lp-email">Email</Label>
              <Input
                id="lp-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lp-password">Password</Label>
              <Input
                id="lp-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {showRememberMe && (
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(!!v)}
                  label="Remember me"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="text-xs text-primary-500 hover:underline dark:text-primary-400"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            )}
            {error && (
              <p className="rounded-md bg-danger-50 p-2.5 text-sm text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  Sign in{" "}
                  <KbdGroup className="ml-1 opacity-60">
                    <Kbd size="xs">⏎</Kbd>
                  </KbdGroup>
                </>
              )}
            </Button>
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary-500 hover:underline dark:text-primary-400"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </p>
          </form>
        )}

        {/* ── REGISTER ── */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lp-name">Full name</Label>
              <Input
                id="lp-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lp-reg-email">Email</Label>
              <Input
                id="lp-reg-email"
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lp-reg-password">Password</Label>
              <Input
                id="lp-reg-password"
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <p className="rounded-md bg-danger-50 p-2.5 text-sm text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary-500 hover:underline dark:text-primary-400"
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        {/* ── OTP ── */}
        {mode === "otp" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <OTPInput
                length={6}
                size="md"
                onComplete={async (otp) => {
                  await onOTPComplete?.(otp);
                }}
                autoFocus
              />
            </div>
            {error && (
              <p className="rounded-md bg-danger-50 p-2.5 text-center text-sm text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                {error}
              </p>
            )}
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              <button
                type="button"
                className="font-medium text-primary-500 hover:underline dark:text-primary-400"
                onClick={() => setMode("login")}
              >
                ← Back to login
              </button>
            </p>
          </div>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lp-forgot-email">Email address</Label>
              <Input
                id="lp-forgot-email"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <p className="rounded-md bg-danger-50 p-2.5 text-sm text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Send reset link"
              )}
            </Button>
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              <button
                type="button"
                className="font-medium text-primary-500 hover:underline dark:text-primary-400"
                onClick={() => setMode("login")}
              >
                ← Back to login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
