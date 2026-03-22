import { useState } from "react";
import { Rating } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const defaultCode = `const [val, setVal] = useState(0);

<Rating value={val} onChange={setVal} label="Product rating" />`;

const intentsCode = `<Rating defaultValue={4} intent="warning" label="Warning" />
<Rating defaultValue={4} intent="danger"  label="Danger" />
<Rating defaultValue={4} intent="success" label="Success" />
<Rating defaultValue={4} intent="primary" label="Primary" />`;

const sizesCode = `<Rating defaultValue={3} size="sm" label="Small" />
<Rating defaultValue={3} size="md" label="Medium" />
<Rating defaultValue={3} size="lg" label="Large" />`;

const halfCode = `<Rating defaultValue={3.5} precision={0.5} label="Half-star" />`;

const readOnlyCode = `<Rating value={4.5} precision={0.5} readOnly label="Read-only 4.5/5" />`;

const disabledCode = `<Rating defaultValue={3} disabled label="Disabled" />`;

const customIconCode = `<Rating
  defaultValue={3}
  intent="danger"
  icon={<span>❤️</span>}
  emptyIcon={<span style={{ opacity: 0.3 }}>❤️</span>}
  label="Heart rating"
/>`;

const controlledCode = `const [val, setVal] = useState(2);

<Rating value={val} onChange={setVal} max={10} label="10-star" />
<p>Current value: {val}/10</p>`;

const ratingProps: PropRow[] = [
  { prop: "value", type: "number", description: "Controlled value (0–max)." },
  {
    prop: "defaultValue",
    type: "number",
    default: "0",
    description: "Uncontrolled initial value.",
  },
  { prop: "max", type: "number", default: "5", description: "Number of stars." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Icon size." },
  {
    prop: "intent",
    type: '"warning" | "danger" | "success" | "primary"',
    default: '"warning"',
    description: "Color intent for filled stars.",
  },
  {
    prop: "precision",
    type: "0.5 | 1",
    default: "1",
    description: "Half-star (0.5) or whole-star (1) precision.",
  },
  {
    prop: "readOnly",
    type: "boolean",
    default: "false",
    description: "Disable interaction, show value only.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disabled state (dimmed + non-interactive).",
  },
  { prop: "onChange", type: "(value: number) => void", description: "Fires when star is clicked." },
  { prop: "icon", type: "ReactNode", description: "Custom filled icon." },
  { prop: "emptyIcon", type: "ReactNode", description: "Custom empty icon." },
  { prop: "label", type: "string", default: '"Rating"', description: "Accessible aria-label." },
  { prop: "className", type: "string", description: "Extra class names." },
];

export default function RatingPage() {
  const [controlled, setControlled] = useState(2);
  const [readOnlyVal] = useState(4.5);

  return (
    <div className="space-y-8">
      <PageTitle>Rating</PageTitle>

      <Section title="Default (interactive)">
        <div className="flex flex-col gap-4">
          <Rating label="Product rating" defaultValue={3} />
        </div>
        <CodeExample code={defaultCode} />
      </Section>

      <Section title="All intents">
        <div className="flex flex-col gap-3">
          {(["warning", "danger", "success", "primary"] as const).map((intent) => (
            <div key={intent} className="flex items-center gap-3">
              <span className="w-16 text-sm text-secondary-500 capitalize">{intent}</span>
              <Rating defaultValue={4} intent={intent} label={intent} />
            </div>
          ))}
        </div>
        <CodeExample code={intentsCode} />
      </Section>

      <Section title="All sizes">
        <div className="flex flex-col gap-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="w-10 text-sm text-secondary-500">{size}</span>
              <Rating defaultValue={3} size={size} label={size} />
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Half-star precision">
        <Rating defaultValue={3.5} precision={0.5} label="Half-star rating" />
        <CodeExample code={halfCode} />
      </Section>

      <Section title="Read-only display (4.5 / 5)">
        <Rating value={readOnlyVal} precision={0.5} readOnly label="Read-only 4.5 out of 5 stars" />
        <CodeExample code={readOnlyCode} />
      </Section>

      <Section title="Disabled state">
        <Rating defaultValue={3} disabled label="Disabled rating" />
        <CodeExample code={disabledCode} />
      </Section>

      <Section title="Custom icon (heart)">
        <Rating
          defaultValue={3}
          intent="danger"
          icon={<span>❤️</span>}
          emptyIcon={<span style={{ opacity: 0.3 }}>❤️</span>}
          label="Heart rating"
        />
        <CodeExample code={customIconCode} />
      </Section>

      <Section title="Controlled with numeric display">
        <div className="flex flex-col gap-2">
          <Rating value={controlled} onChange={setControlled} max={10} label="10-star rating" />
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Current value: <strong>{controlled}</strong> / 10
          </p>
        </div>
        <CodeExample code={controlledCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={ratingProps} />
      </Section>
    </div>
  );
}
