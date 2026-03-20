import { useState } from "react";
import { Spin, useSpin, Button, Card } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const standaloneCode = `<Spin size="sm" tip="Small" />
<Spin size="md" tip="Medium" />
<Spin size="lg" tip="Large" />`;

const overlayCode = `<Spin spinning size="lg" tip="Loading (lg)">
  <div className="w-48 rounded-lg border p-6 text-center">Content area</div>
</Spin>`;

const toggleCode = `const [loading, setLoading] = useState(true);

<Spin spinning={loading} tip="Fetching data…">
  <Card className="p-5">…card content…</Card>
</Spin>`;

const tableCode = `<Spin spinning tip="Refreshing…">
  <table>…table content…</table>
</Spin>`;

const noTipCode = `<Spin spinning>
  <div className="h-24 w-64 rounded-lg border" />
</Spin>`;

const useSpinFullCode = `const setSpin = useSpin();

// Cover full page
const close = setSpin(document.documentElement, "Loading application…");
setTimeout(close, 2000);`;

const useSpinElementCode = `const setSpin = useSpin();

// Cover a specific element
const el = document.getElementById("my-box");
if (el) {
  const close = setSpin(el, "Loading…");
  setTimeout(close, 2000);
}`;

export default function SpinPage() {
  const [loading, setLoading] = useState(true);
  const setSpin = useSpin();

  return (
    <div className="space-y-10">
      <PageTitle>Spin (Loading Overlay)</PageTitle>

      {/* ── Standalone spinners ───────────────────────── */}
      <Section title="Standalone spinner">
        <div className="flex items-center gap-8">
          <Spin size="sm" tip="Small" />
          <Spin size="md" tip="Medium" />
          <Spin size="lg" tip="Large" />
        </div>{" "}
        <CodeExample code={standaloneCode} />{" "}
      </Section>

      {/* ── Sizes over content ────────────────────────── */}
      <Section title="Sizes (overlay on content)">
        <div className="flex flex-wrap gap-6">
          {(["sm", "md", "lg"] as const).map((s) => (
            <Spin key={s} spinning size={s} tip={`Loading (${s})`}>
              <div className="w-48 rounded-lg border border-primary-200 bg-white p-6 text-center dark:border-primary-700 dark:bg-primary-800">
                <p className="text-sm text-primary-600 dark:text-primary-300">Content area</p>
              </div>
            </Spin>
          ))}
        </div>
        <CodeExample code={overlayCode} />
      </Section>
      <Section title="Toggle loading state">
        <div className="space-y-3 max-w-md">
          <Button intent="primary" size="sm" onClick={() => setLoading((v) => !v)}>
            {loading ? "Stop loading" : "Start loading"}
          </Button>

          <Spin spinning={loading} tip="Fetching data…">
            <Card className="p-5 space-y-2">
              <h3 className="font-semibold text-primary-800 dark:text-primary-200">User Profile</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400">Name: Jane Doe</p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Email: jane@example.com
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">Role: Admin</p>
            </Card>
          </Spin>
        </div>
        <CodeExample code={toggleCode} />
      </Section>

      {/* ── Over a table ──────────────────────────────── */}
      <Section title="Over a table">
        <Spin spinning tip="Refreshing…">
          <table className="min-w-lg text-sm">
            <thead>
              <tr className="border-b border-primary-200 dark:border-primary-700 text-left">
                <th className="py-2 pr-4 font-semibold text-primary-700 dark:text-primary-300">
                  ID
                </th>
                <th className="py-2 pr-4 font-semibold text-primary-700 dark:text-primary-300">
                  Name
                </th>
                <th className="py-2 font-semibold text-primary-700 dark:text-primary-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: "Widget A", status: "Active" },
                { id: 2, name: "Widget B", status: "Pending" },
                { id: 3, name: "Widget C", status: "Inactive" },
                { id: 4, name: "Widget D", status: "Active" },
              ].map((row) => (
                <tr key={row.id} className="border-b border-primary-100 dark:border-primary-800">
                  <td className="py-2 pr-4 text-primary-600 dark:text-primary-400">{row.id}</td>
                  <td className="py-2 pr-4 text-primary-800 dark:text-primary-200">{row.name}</td>
                  <td className="py-2 text-primary-600 dark:text-primary-400">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Spin>
        <CodeExample code={tableCode} />
      </Section>
      <Section title="Without tip text">
        <Spin spinning>
          <div className="h-24 w-64 rounded-lg border border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-800" />
        </Spin>
        <CodeExample code={noTipCode} />
      </Section>

      {/* ── useSpin() — fullscreen ────────────────────── */}
      <Section title="Fullscreen overlay — useSpin()">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="danger"
            size="sm"
            onClick={() => {
              const close = setSpin(document.documentElement, "Loading application…");
              setTimeout(close, 2000);
            }}
          >
            Fullscreen with tip (2s)
          </Button>
          <Button
            intent="primary"
            size="sm"
            onClick={() => {
              const close = setSpin(document.documentElement);
              setTimeout(close, 2000);
            }}
          >
            Fullscreen without tip (2s)
          </Button>
        </div>
        <CodeExample code={useSpinFullCode} language="typescript" />
      </Section>
      <Section title="Cover a specific element — useSpin()">
        <div className="flex flex-wrap gap-6">
          <div
            id="spin-target-a"
            className="w-48 rounded-lg border border-primary-200 bg-primary-50 p-6 text-center dark:border-primary-700 dark:bg-primary-800"
          >
            <p className="text-sm text-primary-600 dark:text-primary-300">Box A</p>
          </div>
          <div
            id="spin-target-b"
            className="w-48 rounded-lg border border-primary-200 bg-primary-50 p-6 text-center dark:border-primary-700 dark:bg-primary-800"
          >
            <p className="text-sm text-primary-600 dark:text-primary-300">Box B</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            intent="primary"
            size="sm"
            onClick={() => {
              const el = document.getElementById("spin-target-a");
              if (el) {
                const close = setSpin(el, "Loading A…");
                setTimeout(close, 2000);
              }
            }}
          >
            Spin on Box A (2s)
          </Button>
          <Button
            intent="warning"
            size="sm"
            onClick={() => {
              const el = document.getElementById("spin-target-b");
              if (el) {
                const close = setSpin(el);
                setTimeout(close, 2000);
              }
            }}
          >
            Spin on Box B (2s)
          </Button>
          <Button
            intent="secondary"
            size="sm"
            onClick={() => {
              const elA = document.getElementById("spin-target-a");
              const elB = document.getElementById("spin-target-b");
              const closeA = elA ? setSpin(elA, "A…") : null;
              const closeB = elB ? setSpin(elB, "B…") : null;
              setTimeout(() => closeA?.(), 1500);
              setTimeout(() => closeB?.(), 3000);
            }}
          >
            Both (A=1.5s, B=3s)
          </Button>
        </div>
        <CodeExample code={useSpinElementCode} language="typescript" />
      </Section>
    </div>
  );
}
