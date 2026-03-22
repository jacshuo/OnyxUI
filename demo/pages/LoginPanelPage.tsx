import { useState } from "react";
import { LoginPanel } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const defaultCode = `<LoginPanel />`;

const socialCode = `const githubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

<LoginPanel
  socialLogins={[{ label: "Continue with GitHub", icon: githubIcon, onClick: () => {} }]}
/>`;

const modesCode = `<LoginPanel mode="login" />
<LoginPanel mode="register" />
<LoginPanel mode="otp" />
<LoginPanel mode="forgot" />`;

const loadingCode = `<LoginPanel isLoading />`;

const errorCode = `<LoginPanel error="Invalid email or password. Please try again." />`;

const customCode = `<LoginPanel
  logo={<img src="/logo.svg" alt="Logo" className="h-10 w-10" />}
  title="Sign in to Acme"
  subtitle="Securely access your workspace"
/>`;

const loginPanelProps: PropRow[] = [
  {
    prop: "mode",
    type: '"login" | "register" | "otp" | "forgot"',
    default: '"login"',
    description: "Active form mode (controlled).",
  },
  {
    prop: "onModeChange",
    type: "(mode: LoginPanelMode) => void",
    description: "Fires when the mode changes.",
  },
  {
    prop: "onLogin",
    type: "(email, password, rememberMe) => void | Promise<void>",
    description: "Login form submit handler.",
  },
  {
    prop: "onRegister",
    type: "(name, email, password) => void | Promise<void>",
    description: "Register form submit handler.",
  },
  {
    prop: "onOTPComplete",
    type: "(otp: string) => void | Promise<void>",
    description: "Fires when all OTP slots are filled.",
  },
  {
    prop: "onForgotPassword",
    type: "(email: string) => void | Promise<void>",
    description: "Forgot password form submit handler.",
  },
  { prop: "logo", type: "ReactNode", description: "Custom logo rendered at the top." },
  { prop: "title", type: "string", description: "Override the panel title." },
  { prop: "subtitle", type: "string", description: "Override the panel subtitle." },
  {
    prop: "socialLogins",
    type: "Array<{ label, icon, onClick }>",
    description: "Social login buttons (optional).",
  },
  {
    prop: "showRememberMe",
    type: "boolean",
    default: "true",
    description: "Show Remember Me checkbox in login mode.",
  },
  {
    prop: "isLoading",
    type: "boolean",
    default: "false",
    description: "Show loading state on submit button.",
  },
  { prop: "error", type: "string", description: "Error message displayed below the form." },
  { prop: "className", type: "string", description: "Extra class names." },
  { prop: "style", type: "CSSProperties", description: "Inline styles." },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

export default function LoginPanelPage() {
  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot">("login");
  const [loadingMode, setLoadingMode] = useState<"login" | "register" | "otp" | "forgot">("login");

  return (
    <div className="space-y-8">
      <PageTitle>LoginPanel</PageTitle>

      <Section title="Login mode (default)">
        <div className="flex justify-center">
          <LoginPanel />
        </div>
        <CodeExample code={defaultCode} />
      </Section>

      <Section title="All modes — cycle with buttons">
        <div className="flex flex-wrap gap-2 mb-4">
          {(["login", "register", "otp", "forgot"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-primary-500 text-white"
                  : "border border-secondary-300 text-secondary-600 hover:bg-secondary-50 dark:border-secondary-600 dark:text-secondary-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <LoginPanel mode={mode} onModeChange={setMode} />
        </div>
        <CodeExample code={modesCode} />
      </Section>

      <Section title="With social logins (GitHub + Google)">
        <div className="flex justify-center">
          <LoginPanel
            socialLogins={[
              { label: "Continue with GitHub", icon: <GithubIcon />, onClick: () => {} },
              { label: "Continue with Google", icon: <GoogleIcon />, onClick: () => {} },
            ]}
          />
        </div>
        <CodeExample code={socialCode} />
      </Section>

      <Section title="Loading state">
        <div className="flex justify-center">
          <LoginPanel mode={loadingMode} onModeChange={setLoadingMode} isLoading />
        </div>
        <CodeExample code={loadingCode} />
      </Section>

      <Section title="Error state">
        <div className="flex justify-center">
          <LoginPanel error="Invalid email or password. Please try again." />
        </div>
        <CodeExample code={errorCode} />
      </Section>

      <Section title="Custom logo + title + subtitle">
        <div className="flex justify-center">
          <LoginPanel
            logo={
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-2xl text-white">
                ✦
              </div>
            }
            title="Sign in to Acme"
            subtitle="Securely access your workspace"
          />
        </div>
        <CodeExample code={customCode} />
      </Section>

      <Section title="Dark mode preview">
        <div className="dark flex justify-center rounded-2xl bg-primary-900 p-8">
          <LoginPanel />
        </div>
        <p className="mt-2 text-xs text-secondary-400">Rendered with .dark class on the wrapper</p>
      </Section>

      <Section title="Keyboard shortcut hint (Kbd usage)">
        <p className="mb-4 text-sm text-secondary-600 dark:text-secondary-400">
          The Login mode shows a <strong>⏎</strong> keyboard hint on the submit button —
          demonstrating the Kbd component used inside LoginPanel.
        </p>
        <div className="flex justify-center">
          <LoginPanel />
        </div>
      </Section>

      <Section title="Props">
        <PropTable rows={loginPanelProps} />
      </Section>
    </div>
  );
}
