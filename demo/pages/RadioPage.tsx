import { useState } from "react";
import { Radio, RadioGroup } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const intents = ["primary", "secondary", "danger", "warning", "success"] as const;

const defaultCode = `<RadioGroup defaultValue="opt1">
  <Radio value="opt1" label="Option 1" />
  <Radio value="opt2" label="Option 2" />
  <Radio value="opt3" label="Option 3" />
</RadioGroup>`;

const horizontalCode = `<RadioGroup defaultValue="h1" orientation="horizontal">
  <Radio value="h1" label="Left" />
  <Radio value="h2" label="Center" />
  <Radio value="h3" label="Right" />
</RadioGroup>`;

const sizesCode = `<RadioGroup size="sm" defaultValue="a">
  <Radio value="a" label="Small A" />
  <Radio value="b" label="Small B" />
</RadioGroup>
<RadioGroup size="md" defaultValue="a">...</RadioGroup>
<RadioGroup size="lg" defaultValue="a">...</RadioGroup>`;

const intentsCode = `<RadioGroup intent="primary" defaultValue="on">
  <Radio value="on" label="Primary" />
</RadioGroup>
{/* intents: "primary" | "secondary" | "danger" | "warning" | "success" */}`;

const disabledCode = `<RadioGroup disabled defaultValue="d1">
  <Radio value="d1" label="Disabled selected" />
  <Radio value="d2" label="Disabled unselected" />
</RadioGroup>`;

const controlledCode = `const [value, setValue] = useState("b");

<RadioGroup value={value} onValueChange={setValue} intent="success">
  <Radio value="a" label="Alpha" />
  <Radio value="b" label="Bravo" />
  <Radio value="c" label="Charlie" />
</RadioGroup>
<span>Selected: {value}</span>`;

export default function RadioPage() {
  const [value, setValue] = useState("b");

  return (
    <div className="space-y-8">
      <PageTitle>Radio</PageTitle>

      {/* ── Default ──────────────────────────────────── */}
      <Section title="Default (RadioGroup)">
        <RadioGroup defaultValue="opt1">
          <Radio value="opt1" label="Option 1" />
          <Radio value="opt2" label="Option 2" />
          <Radio value="opt3" label="Option 3" />
        </RadioGroup>
        <CodeExample code={defaultCode} />
      </Section>

      {/* ── Horizontal layout ────────────────────────── */}
      <Section title="Horizontal layout">
        <RadioGroup defaultValue="h1" orientation="horizontal">
          <Radio value="h1" label="Left" />
          <Radio value="h2" label="Center" />
          <Radio value="h3" label="Right" />
        </RadioGroup>
        <CodeExample code={horizontalCode} />
      </Section>

      {/* ── Sizes ────────────────────────────────────── */}
      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-8">
          <RadioGroup size="sm" defaultValue="a">
            <Radio value="a" label="Small A" />
            <Radio value="b" label="Small B" />
          </RadioGroup>
          <RadioGroup size="md" defaultValue="a">
            <Radio value="a" label="Medium A" />
            <Radio value="b" label="Medium B" />
          </RadioGroup>
          <RadioGroup size="lg" defaultValue="a">
            <Radio value="a" label="Large A" />
            <Radio value="b" label="Large B" />
          </RadioGroup>
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      {/* ── Intents ──────────────────────────────────── */}
      <Section title="Color intents">
        <div className="flex flex-wrap items-start gap-8">
          {intents.map((i) => (
            <RadioGroup key={i} intent={i} defaultValue="on">
              <Radio value="on" label={i.charAt(0).toUpperCase() + i.slice(1)} />
              <Radio value="off" label="Other" />
            </RadioGroup>
          ))}
        </div>
        <CodeExample code={intentsCode} />
      </Section>

      {/* ── Disabled ─────────────────────────────────── */}
      <Section title="Disabled">
        <RadioGroup disabled defaultValue="d1">
          <Radio value="d1" label="Disabled selected" />
          <Radio value="d2" label="Disabled unselected" />
        </RadioGroup>
        <CodeExample code={disabledCode} />
      </Section>

      {/* ── Controlled ───────────────────────────────── */}
      <Section title="Controlled">
        <div className="flex items-start gap-8">
          <RadioGroup value={value} onValueChange={setValue} intent="success">
            <Radio value="a" label="Alpha" />
            <Radio value="b" label="Bravo" />
            <Radio value="c" label="Charlie" />
          </RadioGroup>
          <span className="rounded bg-success-100 px-3 py-1 text-sm text-success-800 dark:bg-success-900/30 dark:text-success-400">
            Selected: <strong>{value}</strong>
          </span>
        </div>
        <CodeExample code={controlledCode} />
      </Section>
    </div>
  );
}
