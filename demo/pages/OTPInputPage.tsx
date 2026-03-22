import { useState } from "react";
import { OTPInput } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const defaultCode = `<OTPInput length={6} />`;

const variantsCode = `<OTPInput length={6} variant="outline" />
<OTPInput length={6} variant="filled" />
<OTPInput length={6} variant="underline" />`;

const sizesCode = `<OTPInput length={6} size="sm" />
<OTPInput length={6} size="md" />
<OTPInput length={6} size="lg" />`;

const maskedCode = `<OTPInput length={6} mask />`;

const alphanumericCode = `<OTPInput length={6} alphanumeric />`;

const invalidCode = `<OTPInput length={6} invalid defaultValue="123456" />`;

const pinCode = `<OTPInput length={4} />`;

const completeCode = `const [verified, setVerified] = useState(false);

<OTPInput
  length={6}
  onComplete={(otp) => {
    console.log("OTP complete:", otp);
    setVerified(true);
  }}
/>
{verified && <p>✅ Verified!</p>}`;

const readOnlyCode = `<OTPInput length={6} value="123456" readOnly />`;

const otpInputProps: PropRow[] = [
  { prop: "length", type: "number", default: "6", description: "Number of input slots." },
  { prop: "value", type: "string", description: "Controlled value (string of chars)." },
  {
    prop: "defaultValue",
    type: "string",
    default: '""',
    description: "Uncontrolled initial value.",
  },
  { prop: "onChange", type: "(value: string) => void", description: "Fires on every change." },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    description: "Fires when all slots are filled.",
  },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Input slot size." },
  {
    prop: "variant",
    type: '"outline" | "filled" | "underline"',
    default: '"outline"',
    description: "Visual style.",
  },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable all inputs." },
  { prop: "readOnly", type: "boolean", default: "false", description: "Read-only mode." },
  {
    prop: "autoFocus",
    type: "boolean",
    default: "false",
    description: "Focus first slot on mount.",
  },
  {
    prop: "alphanumeric",
    type: "boolean",
    default: "false",
    description: "Allow letters and numbers (default: digits only).",
  },
  {
    prop: "mask",
    type: "boolean",
    default: "false",
    description: "Hide characters like a password field.",
  },
  { prop: "invalid", type: "boolean", default: "false", description: "Red error state." },
  { prop: "className", type: "string", description: "Extra class names for the wrapper." },
];

export default function OTPInputPage() {
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <div className="space-y-8">
      <PageTitle>OTPInput</PageTitle>

      <Section title="Default 6-digit OTP">
        <OTPInput length={6} />
        <CodeExample code={defaultCode} />
      </Section>

      <Section title="All variants">
        <div className="flex flex-col gap-4">
          {(["outline", "filled", "underline"] as const).map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="w-20 text-sm text-secondary-500">{v}</span>
              <OTPInput length={6} variant={v} />
            </div>
          ))}
        </div>
        <CodeExample code={variantsCode} />
      </Section>

      <Section title="All sizes">
        <div className="flex flex-col gap-4">
          {(["sm", "md", "lg"] as const).map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-10 text-sm text-secondary-500">{s}</span>
              <OTPInput length={6} size={s} />
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Masked input (password style)">
        <OTPInput length={6} mask />
        <CodeExample code={maskedCode} />
      </Section>

      <Section title="Alphanumeric mode">
        <OTPInput length={6} alphanumeric />
        <CodeExample code={alphanumericCode} />
      </Section>

      <Section title="Error / invalid state">
        <OTPInput length={6} invalid defaultValue="123456" />
        <CodeExample code={invalidCode} />
      </Section>

      <Section title="4-digit PIN">
        <OTPInput length={4} />
        <CodeExample code={pinCode} />
      </Section>

      <Section title="onComplete callback — Verified state">
        <div className="flex flex-col gap-3">
          <OTPInput
            length={6}
            onChange={(v) => {
              setOtp(v);
              if (v.length < 6) setVerified(false);
            }}
            onComplete={() => setVerified(true)}
          />
          {verified ? (
            <p className="flex items-center gap-2 text-sm font-medium text-success-600 dark:text-success-400">
              <span>✅</span> Verified! Code: {otp}
            </p>
          ) : (
            <p className="text-sm text-secondary-400">Enter all 6 digits to verify…</p>
          )}
        </div>
        <CodeExample code={completeCode} />
      </Section>

      <Section title="Read-only (pre-filled)">
        <OTPInput length={6} value="123456" readOnly />
        <CodeExample code={readOnlyCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={otpInputProps} />
      </Section>
    </div>
  );
}
