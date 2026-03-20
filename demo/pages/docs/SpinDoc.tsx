import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const spinProps: PropRow[] = [
  { prop: "spinning", type: "boolean", default: "true", description: "Show the spinner overlay" },
  { prop: "tip", type: "string", description: "Text displayed below the spinner" },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Spinner size" },
  {
    prop: "intent",
    type: `"primary" | "secondary"`,
    default: `"primary"`,
    description: "Spinner color",
  },
];

const usageCode = `import { Spin, useSpin, Button } from "@jacshuo/onyx";

export function Example() {
  const { spinning, start, stop, wrap } = useSpin();

  return (
    <div className="flex flex-col gap-4">
      {/* Overlay spinner wrapping content */}
      <Spin spinning={spinning} tip="Loading…">
        <div className="rounded border p-4">
          <p>This content is covered while loading.</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={start}>Start</Button>
            <Button size="sm" intent="secondary" onClick={stop}>Stop</Button>
          </div>
        </div>
      </Spin>

      {/* Wrap a promise */}
      <Button
        onClick={() =>
          wrap(new Promise((res) => setTimeout(res, 2000)))
        }
      >
        Load (2s)
      </Button>
    </div>
  );
}`;

const hookDescription = `useSpin() returns:
  spinning: boolean  — current spinning state
  start()  → void   — begin spinning
  stop()   → void   — stop spinning
  wrap(promise) → Promise — spin while the promise resolves`;

export default function SpinDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Spin</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Spin, useSpin, type SpinProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Spin Props">
        <PropTable rows={spinProps} title="Spin" />
      </Section>

      <Section title="useSpin hook">
        <CodeExample code={hookDescription} language="typescript" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
