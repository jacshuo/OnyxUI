import { OTPInput } from "../../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const installCode = `import { OTPInput } from "@jacshuo/onyx";`;

const usageCode = `import { OTPInput } from "@jacshuo/onyx";

export function Example() {
  return (
    <OTPInput
      length={6}
      onComplete={(otp) => console.log("Complete:", otp)}
    />
  );
}`;

const variantsCode = `<OTPInput length={6} variant="outline" />
<OTPInput length={6} variant="filled" />
<OTPInput length={6} variant="underline" />`;

const maskedCode = `<OTPInput length={6} mask />`;

const alphanumericCode = `<OTPInput length={6} alphanumeric />`;

const otpInputProps: PropRow[] = [
  { prop: "length", type: "number", default: "6", description: "Number of input slots." },
  { prop: "value", type: "string", description: "Controlled value string." },
  {
    prop: "defaultValue",
    type: "string",
    default: '""',
    description: "Uncontrolled initial value.",
  },
  { prop: "onChange", type: "(value: string) => void", description: "Called on every keystroke." },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    description: "Called when all slots are filled.",
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Individual slot size.",
  },
  {
    prop: "variant",
    type: '"outline" | "filled" | "underline"',
    default: '"outline"',
    description: "Visual style.",
  },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable all slots." },
  { prop: "readOnly", type: "boolean", default: "false", description: "Read-only display." },
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
    description: "Accept letters and digits (default: digits only).",
  },
  {
    prop: "mask",
    type: "boolean",
    default: "false",
    description: "Show dots instead of characters.",
  },
  { prop: "invalid", type: "boolean", default: "false", description: "Show danger/error ring." },
  { prop: "className", type: "string", description: "Extra classes on the group wrapper." },
];

export default function OTPInputDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>OTPInput</PageTitle>

      <Section title="Import">
        <CodeExample code={installCode} language="ts" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Variants">
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

      <Section title="Masked">
        <OTPInput length={6} mask />
        <CodeExample code={maskedCode} />
      </Section>

      <Section title="Alphanumeric">
        <OTPInput length={6} alphanumeric />
        <CodeExample code={alphanumericCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={otpInputProps} />
      </Section>
    </div>
  );
}
