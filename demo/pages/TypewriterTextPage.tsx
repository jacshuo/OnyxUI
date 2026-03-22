import { useState, useEffect, useRef, useCallback } from "react";
import { TypewriterText } from "../../src";
import { PageTitle, Section, CodeExample } from "./helpers";

/* ── AI response scenarios ─────────────────────────────── */

const AI_RESPONSES = [
  {
    prompt: "Write a debounce hook in React",
    response: `Here's a clean \`useDebounce\` hook in React:

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
\`\`\`

The hook delays updating the returned value until \`delay\` milliseconds have passed without a new \`value\` change. Ideal for rate-limiting search inputs or API calls triggered by user typing.`,
  },
  {
    prompt: "Explain TypeScript generics",
    response: `TypeScript generics let you write reusable code that works across multiple types while preserving type safety.

Think of them as *type parameters* — placeholders that get filled in at call-site:

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello"); // returns string
identity<number>(42);      // returns number
\`\`\`

Common use-cases include typed collections, utility types, and API wrappers where the shape of data varies by context.`,
  },
  {
    prompt: "How does CSS grid work?",
    response: `CSS Grid is a two-dimensional layout system built into the browser.

You define a **grid container** with rows and columns, then place **grid items** into named areas or explicit coordinates:

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.sidebar { grid-column: 1; grid-row: 1 / 3; }
.main    { grid-column: 2; grid-row: 1;     }
\`\`\`

The \`fr\` unit divides remaining space proportionally. Combined with \`minmax()\` and \`auto-fill\`, Grid handles complex responsive layouts with minimal media queries.`,
  },
];

/* ── Helper: word-by-word stream simulator ─────────────── */

function useSimulatedStream(delay = 1500, chunkInterval = 60) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const start = useCallback(
    (index: number) => {
      stop();
      setText("");
      setThinking(true);
      setStreaming(false);

      const fullText = AI_RESPONSES[index].response;
      // Break into ~3-char chunks to simulate token streaming
      const chars = fullText.split("");
      let pos = 0;

      timeoutRef.current = setTimeout(() => {
        setThinking(false);
        setStreaming(true);

        timerRef.current = setInterval(() => {
          // Add 2–4 chars per tick (simulates variable-size tokens)
          const chunkSize = 2 + Math.floor(Math.random() * 3);
          pos = Math.min(pos + chunkSize, chars.length);
          setText(fullText.slice(0, pos));

          if (pos >= chars.length) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            // Small pause then signal done
            timeoutRef.current = setTimeout(() => setStreaming(false), 300);
          }
        }, chunkInterval);
      }, delay);
    },
    [stop, delay, chunkInterval],
  );

  useEffect(() => () => stop(), [stop]);

  return { text, thinking, streaming, start, stop, promptIndex, setPromptIndex };
}

/* ── Demo section: full AI chat simulation ─────────────── */

function AIChatDemo() {
  const { text, thinking, streaming, start, stop, promptIndex, setPromptIndex } =
    useSimulatedStream(1200, 40);
  const [running, setRunning] = useState(false);

  function handleGenerate() {
    setRunning(true);
    start(promptIndex);
  }

  function handleStop() {
    stop();
    setRunning(false);
  }

  const currentPrompt = AI_RESPONSES[promptIndex];

  return (
    /* Single unified surface — borders only, no bg-color zone stacking */
    <div className="rounded-xl border border-primary-200 bg-white dark:border-primary-700/50 dark:bg-primary-900 overflow-hidden shadow-sm">
      {/* Toolbar — same bg, just a hairline border between it and body */}
      <div className="flex items-center gap-3 border-b border-primary-100 px-4 py-2.5 dark:border-primary-700/50">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-success-400" />
        </div>
        <span className="ml-1 text-xs font-medium text-primary-400 dark:text-primary-500 select-none">
          AI Assistant
        </span>
      </div>

      {/* Prompt selector — no bg shift, just a bottom divider */}
      <div className="border-b border-primary-100 px-4 py-3 dark:border-primary-700/50">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary-300 dark:text-primary-600 select-none">
          Choose a prompt
        </p>
        <div className="flex flex-wrap gap-2">
          {AI_RESPONSES.map((r, i) => (
            <button
              key={i}
              onClick={() => setPromptIndex(i)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                promptIndex === i
                  ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                  : "border-primary-200 text-primary-500 hover:border-primary-300 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:border-primary-600 dark:hover:bg-primary-800/40"
              }`}
            >
              {r.prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area — same bg as card */}
      <div className="min-h-52 p-4 space-y-4">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl rounded-tr-sm bg-primary-500 px-4 py-2.5 text-sm text-white">
            {currentPrompt.prompt}
          </div>
        </div>

        {/* Assistant response */}
        {(running || text) && (
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[11px] font-bold text-white">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <TypewriterText
                text={text}
                mode="stream"
                speed={120}
                cursor
                thinking={thinking}
                streaming={streaming}
                rich
                className="text-sm leading-relaxed text-primary-800 dark:text-primary-200"
              />
            </div>
          </div>
        )}

        {!running && !text && (
          <p className="text-center text-sm text-primary-300 dark:text-primary-600 py-6">
            Click{" "}
            <strong className="font-medium text-primary-500 dark:text-primary-400">Generate</strong>{" "}
            to see the streaming effect
          </p>
        )}
      </div>

      {/* Actions — same bg, top hairline */}
      <div className="flex justify-end gap-2 border-t border-primary-100 px-4 py-3 dark:border-primary-700/50">
        <button
          onClick={handleStop}
          disabled={!running}
          className="rounded-lg border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 disabled:pointer-events-none disabled:opacity-40 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-800/40"
        >
          Stop
        </button>
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-primary-500 px-5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

/* ── Demo section: typewriter mode ─────────────────────── */

const TYPEWRITER_TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Building beautiful interfaces, one component at a time.",
  "TypewriterText — animate any string with Copilot-style flair.",
];

function TypewriterDemo() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  function nextText() {
    setIdx((i) => (i + 1) % TYPEWRITER_TEXTS.length);
    setKey((k) => k + 1);
  }

  return (
    <div className="rounded-xl border border-primary-200 bg-white p-6 dark:border-primary-700/50 dark:bg-primary-900">
      <p className="mb-5 min-h-[3rem] text-lg font-medium text-primary-900 dark:text-primary-100 leading-relaxed">
        <TypewriterText key={key} text={TYPEWRITER_TEXTS[idx]} mode="typewriter" speed={35} />
      </p>
      <button
        onClick={nextText}
        className="rounded-lg border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-800/40"
      >
        Next sentence →
      </button>
    </div>
  );
}

/* ── Demo section: speed comparison ────────────────────── */

const SPEED_TEXT = "Speed matters — adjust characters per second to match your UI's pacing.";

function SpeedDemo() {
  const [speeds] = useState([15, 40, 100, 300]);
  const [keys, setKeys] = useState([0, 0, 0, 0]);

  function replay() {
    setKeys((ks) => ks.map((k) => k + 1));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {speeds.map((s, i) => (
          <div
            key={s}
            className="rounded-lg border border-primary-200 bg-white p-4 dark:border-primary-700/50 dark:bg-primary-900"
          >
            <p className="mb-1.5 text-[10px] font-semibold text-primary-300 dark:text-primary-600 uppercase tracking-widest">
              speed={s}
            </p>
            <p className="text-sm text-primary-900 dark:text-primary-200 min-h-[2.5rem]">
              <TypewriterText
                key={keys[i]}
                text={SPEED_TEXT}
                mode="typewriter"
                speed={s}
                cursor={false}
              />
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={replay}
        className="rounded-lg border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-800/40"
      >
        ↺ Replay
      </button>
    </div>
  );
}

/* ── Demo section: cursor variants ─────────────────────── */

const CURSORS: { char: string; label: string }[] = [
  { char: "▋", label: "Block (default)" },
  { char: "|", label: "Beam" },
  { char: "▌", label: "Half block" },
  { char: "█", label: "Full block" },
  { char: "_", label: "Underscore" },
  { char: "●", label: "Dot" },
];

function CursorDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CURSORS.map(({ char, label }) => (
        <div
          key={char}
          className="flex items-center gap-3 rounded-lg border border-primary-200 bg-white px-4 py-3 dark:border-primary-700/50 dark:bg-primary-900"
        >
          <span className="font-mono text-xl text-primary-400 dark:text-primary-600 w-6 text-center select-none">
            {char}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-primary-300 dark:text-primary-600 uppercase tracking-widest mb-0.5">
              {label}
            </p>
            <TypewriterText
              text="Hello world"
              mode="instant"
              cursor
              cursorChar={char}
              streaming
              className="font-mono text-sm text-primary-900 dark:text-primary-200"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Demo section: thinking state ──────────────────────── */

function ThinkingDemo() {
  const [state, setState] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const [text, setText] = useState("");

  function run() {
    setState("thinking");
    setText("");

    setTimeout(() => {
      setState("typing");
      const full = "I've thought about it — the answer is 42.";
      let pos = 0;
      const iv = setInterval(() => {
        pos += 3;
        setText(full.slice(0, Math.min(pos, full.length)));
        if (pos >= full.length) {
          clearInterval(iv);
          setTimeout(() => setState("done"), 400);
        }
      }, 40);
    }, 2000);
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="rounded-xl border border-primary-200 bg-white px-5 py-4 dark:border-primary-700/50 dark:bg-primary-900 min-h-[3rem] min-w-[280px]">
        <TypewriterText
          text={text}
          mode="stream"
          speed={80}
          thinking={state === "thinking"}
          streaming={state === "typing"}
          cursor
          cursorChar="▋"
          className="text-sm text-primary-900 dark:text-primary-200"
        />
        {state === "idle" && (
          <span className="text-sm text-primary-300 dark:text-primary-600">
            Click Start to see the effect…
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={run}
          disabled={state !== "idle" && state !== "done"}
          className="rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50"
        >
          Start
        </button>
        {state !== "idle" && (
          <button
            onClick={() => {
              setState("idle");
              setText("");
            }}
            className="rounded-lg border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-800/40"
          >
            Reset
          </button>
        )}
        <span className="text-xs text-primary-300 dark:text-primary-600 capitalize">
          state: {state}
        </span>
      </div>
    </div>
  );
}

/* ── Demo section: rich mode (Markdown + image rendering) ── */

const RICH_MARKDOWN = `# Rich Mode Demo

**TypewriterText** now supports full *Markdown* rendering via the \`rich\` prop.

> Set \`rich={true}\` to render animated streaming output as polished prose — headings, code, blockquotes, lists, and images all animate naturally alongside the text.

## What you get

- **Bold text** and *italic emphasis* out of the box
- \`inline code\` for technical terms
- Full fenced code blocks:

\`\`\`typescript
function streamMarkdown(text: string) {
  return (
    <TypewriterText
      text={text}
      mode="stream"
      rich
      streaming={isStreaming}
    />
  );
}
\`\`\`

---

And here's a sample image that fades in with a gentle entrance animation once its position in the stream is reached:

![Scenic mountain landscape](https://picsum.photos/seed/onyxui/640/280)`;

function useRichStream(fullText: string, chunkInterval = 22) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const start = useCallback(() => {
    stop();
    setText("");
    setThinking(true);
    setStreaming(false);
    let pos = 0;

    timeoutRef.current = setTimeout(() => {
      setThinking(false);
      setStreaming(true);

      timerRef.current = setInterval(() => {
        const chunkSize = 2 + Math.floor(Math.random() * 4);
        pos = Math.min(pos + chunkSize, fullText.length);
        setText(fullText.slice(0, pos));

        if (pos >= fullText.length) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          timeoutRef.current = setTimeout(() => setStreaming(false), 400);
        }
      }, chunkInterval);
    }, 1200);
  }, [stop, fullText, chunkInterval]);

  useEffect(() => () => stop(), [stop]);

  return { text, thinking, streaming, start };
}

function RichModeDemo() {
  const { text, thinking, streaming, start } = useRichStream(RICH_MARKDOWN);
  const [started, setStarted] = useState(false);

  function handleStart() {
    setStarted(true);
    start();
  }

  return (
    <div className="rounded-xl border border-primary-200 bg-white dark:border-primary-700/50 dark:bg-primary-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary-100 px-4 py-2.5 dark:border-primary-700/50">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-300 dark:text-primary-600 select-none">
          rich=&#123;true&#125; — Markdown + image rendering
        </p>
        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-500 dark:bg-primary-800 dark:text-primary-400">
          stream mode
        </span>
      </div>

      {/* Content area */}
      <div className="min-h-64 p-5">
        {!started && !text ? (
          <p className="py-6 text-center text-sm text-primary-300 dark:text-primary-600">
            Click{" "}
            <strong className="font-medium text-primary-500 dark:text-primary-400">
              Start Streaming
            </strong>{" "}
            to watch Markdown render character-by-character
          </p>
        ) : (
          <TypewriterText
            text={text}
            mode="stream"
            speed={120}
            cursor
            thinking={thinking}
            streaming={streaming}
            rich
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t border-primary-100 px-4 py-3 dark:border-primary-700/50">
        <button
          onClick={handleStart}
          className="rounded-lg bg-primary-500 px-5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
        >
          {started ? "↺ Replay" : "Start Streaming"}
        </button>
      </div>
    </div>
  );
}

/* ── Code examples ──────────────────────────────────────── */

const streamCode = `import { TypewriterText } from "@jacshuo/onyx";
import { useState, useEffect } from "react";

function AIChatBubble({ fetchResponse }: { fetchResponse: () => Promise<string> }) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(true);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchResponse().then(async (fullText) => {
      if (cancelled) return;
      setThinking(false);
      setStreaming(true);
      // Simulate token arrival — replace with your real ReadableStream logic
      for (let i = 0; i <= fullText.length; i += 4) {
        if (cancelled) break;
        setText(fullText.slice(0, i));
        await new Promise(r => setTimeout(r, 30));
      }
      setStreaming(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <TypewriterText
      text={text}
      mode="stream"
      speed={120}
      thinking={thinking}
      streaming={streaming}
      cursor
    />
  );
}`;

const typewriterCode = `import { TypewriterText } from "@jacshuo/onyx";

// Basic typewriter — animates the full text on every render cycle
<TypewriterText
  key={text}          // remount to replay on new text
  text="Hello, world!"
  mode="typewriter"
  speed={40}
  cursor
  cursorChar="▋"
  onComplete={() => console.log("done!")}
/>`;

const instantCode = `import { TypewriterText } from "@jacshuo/onyx";

// Instant — no animation; cursor stays for visual consistency
<TypewriterText
  text="Already here."
  mode="instant"
  cursor
  streaming={false}
/>`;

/* ── Page ──────────────────────────────────────────────── */

export default function TypewriterTextPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <PageTitle>TypewriterText</PageTitle>

      <Section title="AI Streaming Simulation">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          Full end-to-end demo. Simulates LLM token streaming with a thinking pause, character-level
          animation, and cursor lifecycle.
        </p>
        <AIChatDemo />
      </Section>

      <Section title="Rich Mode (Markdown & Images)">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          Set{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            {"rich={true}"}
          </code>{" "}
          to render the animated text as full Markdown. Headings, code blocks, blockquotes, lists,
          and images all render with polished prose styles. Images fade in when reached and display
          a graceful placeholder if they fail to load.
        </p>
        <RichModeDemo />
      </Section>

      <Section title="Typewriter Mode">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            mode=&quot;typewriter&quot;
          </code>{" "}
          — animates the full text from empty to complete each time{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            text
          </code>{" "}
          changes. Mount a new instance (or change the{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            key
          </code>
          ) to replay.
        </p>
        <TypewriterDemo />
      </Section>

      <Section title="Speed">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          The{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            speed
          </code>{" "}
          prop sets characters per second.
        </p>
        <SpeedDemo />
      </Section>

      <Section title="Cursor Variants">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          Any string is valid for{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            cursorChar
          </code>
          . Use text, emoji, or a Unicode glyph that matches your design.
        </p>
        <CursorDemo />
      </Section>

      <Section title="Thinking State">
        <p className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          Set{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            {"thinking={true}"}
          </code>{" "}
          to show a blinking cursor before the first token arrives. Transition to{" "}
          <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono text-primary-700 dark:bg-primary-800 dark:text-primary-200">
            {"thinking={false}"}
          </code>{" "}
          when streaming starts.
        </p>
        <ThinkingDemo />
      </Section>

      <Section title="Stream Mode — Usage">
        <CodeExample code={streamCode} />
      </Section>

      <Section title="Typewriter Mode — Usage">
        <CodeExample code={typewriterCode} />
      </Section>

      <Section title="Instant Mode — Usage">
        <CodeExample code={instantCode} />
      </Section>
    </div>
  );
}
