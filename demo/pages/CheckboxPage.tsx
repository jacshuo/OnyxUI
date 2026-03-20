import { useState } from "react";
import { Checkbox } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const intents = ["primary", "secondary", "danger", "warning", "success"] as const;

const defaultCode = `<Checkbox label="Accept terms" />
<Checkbox defaultChecked label="Subscribe" />
<Checkbox disabled label="Disabled off" />
<Checkbox disabled defaultChecked label="Disabled on" />`;

const sizesCode = `<Checkbox size="sm" defaultChecked label="Small" />
<Checkbox size="md" defaultChecked label="Medium" />
<Checkbox size="lg" defaultChecked label="Large" />`;

const intentsCode = `<Checkbox intent="primary" defaultChecked label="Primary" />
<Checkbox intent="success" defaultChecked label="Success" />
<Checkbox intent="danger" defaultChecked label="Danger" />
// Available: "primary" | "secondary" | "danger" | "warning" | "success"`;

const indeterminateCode = `<Checkbox intent="primary" indeterminate label="Primary" />
<Checkbox intent="success" indeterminate label="Success" />`;

const controlledCode = `const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label={checked ? "Checked ✓" : "Unchecked"}
/>`;

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-8">
      <PageTitle>Checkbox</PageTitle>

      {/* ── Default ──────────────────────────────────── */}
      <Section title="Default">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox label="Accept terms" />
          <Checkbox defaultChecked label="Subscribe" />
          <Checkbox disabled label="Disabled off" />
          <Checkbox disabled defaultChecked label="Disabled on" />
        </div>
        <CodeExample code={defaultCode} />
      </Section>

      {/* ── Sizes ──────────────────────────────────── */}
      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox size="sm" defaultChecked label="Small" />
          <Checkbox size="md" defaultChecked label="Medium" />
          <Checkbox size="lg" defaultChecked label="Large" />
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      {/* ── Intents ────────────────────────────────── */}
      <Section title="Color intents">
        <div className="flex flex-wrap items-center gap-6">
          {intents.map((i) => (
            <Checkbox
              key={i}
              intent={i}
              defaultChecked
              label={i.charAt(0).toUpperCase() + i.slice(1)}
            />
          ))}
        </div>{" "}
        <CodeExample code={intentsCode} />{" "}
      </Section>

      {/* ── Indeterminate ────────────────────────────── */}
      <Section title="Indeterminate">
        <div className="flex flex-wrap items-center gap-6">
          {intents.map((i) => (
            <Checkbox
              key={i}
              intent={i}
              indeterminate
              label={i.charAt(0).toUpperCase() + i.slice(1)}
            />
          ))}
        </div>{" "}
        <CodeExample code={indeterminateCode} />{" "}
      </Section>

      {/* ── Controlled ───────────────────────────────── */}
      <Section title="Controlled">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox
            checked={checked}
            onCheckedChange={setChecked}
            label={checked ? "Checked ✓" : "Unchecked"}
          />
          <button
            type="button"
            onClick={() => setChecked((c) => !c)}
            className="rounded bg-primary-500 px-3 py-1.5 text-xs text-white hover:bg-primary-600"
          >
            Toggle externally
          </button>
        </div>
        <CodeExample code={controlledCode} language="typescript" />
      </Section>

      {/* ── All intents unchecked vs checked ──────────── */}
      <Section title="All intents — unchecked vs checked">
        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
          {intents.map((i) => (
            <div key={i} className="flex items-center gap-6">
              <Checkbox intent={i} label={`${i} off`} />
              <Checkbox intent={i} defaultChecked label={`${i} on`} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
