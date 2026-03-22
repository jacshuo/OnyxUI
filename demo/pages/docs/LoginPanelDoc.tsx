import { LoginPanel } from "../../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const installCode = `import { LoginPanel } from "@jacshuo/onyx";`;

const usageCode = `import { LoginPanel } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [mode, setMode] = useState("login");

  return (
    <LoginPanel
      mode={mode}
      onModeChange={setMode}
      onLogin={(email, password, rememberMe) => {
        console.log({ email, password, rememberMe });
      }}
    />
  );
}`;

const socialCode = `<LoginPanel
  socialLogins={[
    {
      label: "Continue with GitHub",
      icon: <GithubIcon />,
      onClick: () => handleGithub(),
    },
  ]}
/>`;

const loginPanelProps: PropRow[] = [
  {
    prop: "mode",
    type: '"login" | "register" | "otp" | "forgot"',
    default: '"login"',
    description: "Controlled active form mode.",
  },
  {
    prop: "onModeChange",
    type: "(mode: LoginPanelMode) => void",
    description: "Fires when the internal mode changes.",
  },
  {
    prop: "onLogin",
    type: "(email: string, password: string, rememberMe: boolean) => void | Promise<void>",
    description: "Login form submit handler.",
  },
  {
    prop: "onRegister",
    type: "(name: string, email: string, password: string) => void | Promise<void>",
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
  { prop: "logo", type: "ReactNode", description: "Custom logo element at the top of the panel." },
  { prop: "title", type: "string", description: "Override the panel heading." },
  { prop: "subtitle", type: "string", description: "Override the panel sub-heading." },
  {
    prop: "socialLogins",
    type: "Array<{ label: string; icon: ReactNode; onClick: () => void }>",
    description: "Social login buttons shown above the form divider.",
  },
  {
    prop: "showRememberMe",
    type: "boolean",
    default: "true",
    description: 'Show "Remember me" checkbox in login mode.',
  },
  {
    prop: "isLoading",
    type: "boolean",
    default: "false",
    description: "Disable submit and show loading spinner.",
  },
  { prop: "error", type: "string", description: "Error message shown below the form." },
  {
    prop: "className",
    type: "string",
    description: "Additional class names on the panel container.",
  },
  { prop: "style", type: "CSSProperties", description: "Inline styles on the panel container." },
];

export default function LoginPanelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>LoginPanel</PageTitle>

      <Section title="Import">
        <CodeExample code={installCode} language="ts" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Social Logins">
        <CodeExample code={socialCode} />
      </Section>

      <Section title="Live Preview">
        <div className="flex justify-center">
          <LoginPanel />
        </div>
      </Section>

      <Section title="Props">
        <PropTable rows={loginPanelProps} />
      </Section>

      <Section title="LoginPanelMode Type">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          <code className="rounded bg-primary-100 px-1.5 py-0.5 font-mono text-xs dark:bg-primary-800">
            {`type LoginPanelMode = "login" | "register" | "otp" | "forgot"`}
          </code>
        </p>
      </Section>
    </div>
  );
}
