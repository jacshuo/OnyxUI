import React, { useCallback, useRef, useState } from "react";
import { VirtualList, Panel, PanelHeader, PanelContent, SplitPanel } from "../../src";
import type { VirtualListHandle } from "../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "./helpers";

/* ─── Shared test data generators ─────────────────────────────────────────── */

/** 100 000-item fixed dataset, created once outside the component to avoid re-alloc */
const HUGE_LIST = Array.from({ length: 100_000 }, (_, i) => ({
  id: i,
  name: `Item #${String(i).padStart(6, "0")}`,
  score: Math.floor(Math.random() * 100),
}));

type HugeItem = (typeof HUGE_LIST)[0];

/** Messages with variable body lengths (simulates a chat thread) */
const MESSAGES = Array.from({ length: 5_000 }, (_, i) => {
  const words = 3 + Math.floor(Math.random() * 30);
  const body = Array.from(
    { length: words },
    () =>
      ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"][
        Math.floor(Math.random() * 8)
      ],
  ).join(" ");
  return {
    id: i,
    author: i % 3 === 0 ? "You" : `User ${(i % 5) + 1}`,
    body,
    time: `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`,
  };
});

type Msg = (typeof MESSAGES)[0];

/** Photo cards for horizontal scroll */
const PHOTOS = Array.from({ length: 1_000 }, (_, i) => ({
  id: i,
  hue: Math.floor((i * 137.5) % 360),
  label: `Photo ${i + 1}`,
}));

type Photo = (typeof PHOTOS)[0];

const COLORS = [
  "bg-primary-100 text-primary-700",
  "bg-success-100 text-success-700",
  "bg-warning-100 text-warning-700",
  "bg-danger-100 text-danger-700",
  "bg-secondary-100 text-secondary-700",
];

/* ─── Reusable row renderers ───────────────────────────────────────────────── */

function BasicRow({ item }: { item: HugeItem }) {
  return (
    <div className="flex h-full items-center gap-3 border-b border-primary-100 px-4 dark:border-primary-800">
      <span className="w-20 font-mono text-xs text-primary-400">#{item.id}</span>
      <span className="flex-1 text-sm text-primary-800 dark:text-primary-200">{item.name}</span>
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${COLORS[item.score % COLORS.length]}`}
      >
        {item.score}
      </span>
    </div>
  );
}

/* ─── Demo page ────────────────────────────────────────────────────────────── */

export default function VirtualListPage() {
  /* ── Section 1 — Basic fixed-height, 100k rows ───────────────────────── */
  const [search, setSearch] = useState("");
  const filtered = search ? HUGE_LIST.filter((it) => it.name.includes(search)) : HUGE_LIST;

  /* ── Section 4 — Infinite scroll ────────────────────────────────────── */
  const [infiniteItems, setInfiniteItems] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({ id: i, label: `Loaded row ${i + 1}` })),
  );
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const loadMore = useCallback(() => {
    if (infiniteLoading) return;
    setInfiniteLoading(true);
    setTimeout(() => {
      setInfiniteItems((prev) => [
        ...prev,
        ...Array.from({ length: 30 }, (_, j) => ({
          id: prev.length + j,
          label: `Loaded row ${prev.length + j + 1}`,
        })),
      ]);
      setInfiniteLoading(false);
    }, 800);
  }, [infiniteLoading]);

  /* ── Section 5 — Scroll-to-index ─────────────────────────────────────── */
  const jumpRef = useRef<VirtualListHandle>(null);
  const [jumpIndex, setJumpIndex] = useState(0);

  /* ── Section 6 — Multi-select ────────────────────────────────────────── */
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleSelect = useCallback((id: number) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* ── Section 7 — Scroll restoration ─────────────────────────────────── */
  /* ── Section 8 — Empty / Loading ─────────────────────────────────────── */
  const [showEmpty, setShowEmpty] = useState(false);
  const [artificialLoading, setArtificialLoading] = useState(false);

  /* ── Section 9 — Inside SplitPanel ───────────────────────────────────── */
  const splitNavItems = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    label: `Page ${i + 1}`,
    icon: ["📄", "📁", "🔧", "⚙️", "📊"][i % 5],
  }));
  const [activeNavItem, setActiveNavItem] = useState(0);
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0]);

  /* ─── Prop tables ──────────────────────────────────────────────────── */
  const propsRows: PropRow[] = [
    {
      prop: "items",
      type: "T[]",
      required: true,
      description: "Dataset to virtualise. Swap the reference to replace or extend data.",
    },
    {
      prop: "itemHeight",
      type: "number | (item, index) => number",
      required: true,
      description:
        "Fixed number (uniform rows, O(1) offset) or function (variable heights measured via ResizeObserver).",
    },
    {
      prop: "renderItem",
      type: "(item, index) => ReactNode",
      required: true,
      description:
        "Render callback. The component wraps each item in an absolutely-positioned div — no extra layout work needed.",
    },
    {
      prop: "getItemKey",
      type: "(item, index) => string | number",
      required: false,
      description: "Stable key extractor. Defaults to the item index.",
    },
    {
      prop: "estimatedItemHeight",
      type: "number",
      required: false,
      description: "Placeholder height before measurement (variable-height mode). Default: 48.",
    },
    {
      prop: "height",
      type: "number | string",
      required: false,
      description: 'Viewport height. Default: "100%".',
    },
    {
      prop: "width",
      type: "number | string",
      required: false,
      description: 'Viewport width. Default: "100%".',
    },
    {
      prop: "direction",
      type: '"vertical" | "horizontal"',
      required: false,
      description: 'Scroll axis. Default: "vertical".',
    },
    {
      prop: "overscan",
      type: "number",
      required: false,
      description: "Extra rows rendered outside the viewport on each side. Default: 3.",
    },
    {
      prop: "onReachEnd",
      type: "() => void",
      required: false,
      description: "Fired when scrolled within reachEndThreshold px of the end (infinite scroll).",
    },
    {
      prop: "reachEndThreshold",
      type: "number",
      required: false,
      description: "Pixel distance from end that triggers onReachEnd. Default: 120.",
    },
    {
      prop: "isLoading",
      type: "boolean",
      required: false,
      description: "Shows a loading indicator at the bottom/right of the list.",
    },
    {
      prop: "loadingRenderer",
      type: "() => ReactNode",
      required: false,
      description: "Custom loading indicator (replaces the default spinner entirely).",
    },
    {
      prop: "loadingText",
      type: "string",
      required: false,
      description: 'Text shown in the default loading indicator. Default: "Loading\u2026".',
    },
    {
      prop: "emptyRenderer",
      type: "() => ReactNode",
      required: false,
      description: "Rendered when items is empty (replaces the default empty state entirely).",
    },
    {
      prop: "emptyText",
      type: "string",
      required: false,
      description: 'Text shown in the default empty-state indicator. Default: "No items".',
    },
    {
      prop: "scrollRestorationId",
      type: "string",
      required: false,
      description: "localStorage key for persisting and restoring scroll position.",
    },
    {
      prop: "onScroll",
      type: "(offset: number) => void",
      required: false,
      description: "Called on every scroll event with the current pixel offset.",
    },
    {
      prop: "onVisibleRangeChange",
      type: "(start, end) => void",
      required: false,
      description: "Called whenever the visible item range changes (excludes overscan).",
    },
    {
      prop: "itemClassName",
      type: "string",
      required: false,
      description: "Class applied to every item wrapper div.",
    },
    {
      prop: "className",
      type: "string",
      required: false,
      description: "Class for the scroll container.",
    },
    {
      prop: "style",
      type: "CSSProperties",
      required: false,
      description: "Inline style for the scroll container.",
    },
    {
      prop: "ref (forwarded)",
      type: "VirtualListHandle",
      required: false,
      description: "Exposes scrollToIndex(), scrollToOffset(), and getScrollOffset().",
    },
  ];

  const handleRows: PropRow[] = [
    {
      prop: "scrollToIndex",
      type: "(index: number, align?: VirtualListAlign) => void",
      required: false,
      description:
        'Scrolls to bring item at index into view. align: "start" | "end" | "center" | "auto" (default).',
    },
    {
      prop: "scrollToOffset",
      type: "(offset: number) => void",
      required: false,
      description: "Jumps to an exact pixel offset (smooth).",
    },
    {
      prop: "getScrollOffset",
      type: "() => number",
      required: false,
      description: "Returns the current pixel scroll offset.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle>VirtualList</PageTitle>

      {/* ── 1. Basic fixed-height — 100 000 rows ───────────────────────────── */}
      <Section title="Fixed-Height — 100 000 Rows">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Pass a <strong>number</strong> to <code>itemHeight</code> for the fastest render path —
          offset lookup is O(1) and only ~20–30 DOM nodes exist at any time regardless of dataset
          size.
        </p>
        <div className="mb-2 flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name…"
            className="rounded-md border border-primary-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-100"
          />
          <span className="text-xs text-primary-400">{filtered.length.toLocaleString()} rows</span>
        </div>
        <div className="h-72 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            items={filtered}
            itemHeight={44}
            getItemKey={(it) => it.id}
            renderItem={(item) => <BasicRow item={item} />}
          />
        </div>
        <CodeExample
          code={`import { VirtualList } from "@jacshuo/onyx";

const data = Array.from({ length: 100_000 }, (_, i) => ({ id: i, name: \`Item #\${i}\` }));

<VirtualList
  items={data}
  itemHeight={44}          // fixed — O(1) offset, fastest path
  getItemKey={(it) => it.id}
  renderItem={(item) => (
    <div className="flex h-full items-center border-b px-4">
      <span>{item.name}</span>
    </div>
  )}
/>`}
        />
      </Section>

      {/* ── 2. Variable-height rows ─────────────────────────────────────────── */}
      <Section title="Variable-Height Rows (measured via ResizeObserver)">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Pass a <strong>function</strong> to <code>itemHeight</code> — or just any function that
          returns a rough estimate. The component measures each rendered item via{" "}
          <code>ResizeObserver</code> and corrects the layout automatically. Use{" "}
          <code>estimatedItemHeight</code> to reduce initial layout shift.
        </p>
        <div className="h-80 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-950">
          <VirtualList<Msg>
            items={MESSAGES}
            itemHeight={() => 64}
            estimatedItemHeight={80}
            getItemKey={(m) => m.id}
            renderItem={(msg) => (
              <div
                className={`border-b border-primary-100 px-4 py-3 dark:border-primary-800 ${msg.author === "You" ? "bg-primary-50 dark:bg-primary-900/40" : ""}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {msg.author}
                  </span>
                  <span className="text-xs text-primary-300 dark:text-primary-600">{msg.time}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-primary-800 dark:text-primary-200">
                  {msg.body}
                </p>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`<VirtualList
  items={messages}              // 5 000 chat messages with variable-length text
  itemHeight={() => 64}         // rough estimate — ResizeObserver corrects it
  estimatedItemHeight={80}      // initial placeholder to reduce layout shift
  getItemKey={(m) => m.id}
  renderItem={(msg) => (
    <div className="border-b px-4 py-3">
      <span className="font-semibold">{msg.author}</span>
      <p className="mt-1 text-sm">{msg.body}</p>
    </div>
  )}
/>`}
        />
      </Section>

      {/* ── 3. Horizontal list ──────────────────────────────────────────────── */}
      <Section title="Horizontal List — 1 000 Photo Cards">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Set <code>direction=&quot;horizontal&quot;</code> to virtualise along the X axis. Useful
          for carousels, timeline tracks, and any side-scrolling layout.
        </p>
        <div
          className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700"
          style={{ height: 140 }}
        >
          <VirtualList<Photo>
            items={PHOTOS}
            direction="horizontal"
            itemHeight={160}
            height={140}
            getItemKey={(p) => p.id}
            renderItem={(photo) => (
              <div
                className="flex h-full flex-col items-center justify-center gap-1 border-r border-primary-100 px-2 dark:border-primary-800"
                style={{ background: `hsl(${photo.hue} 60% 94%)` }}
              >
                <div
                  className="flex h-16 w-full items-center justify-center rounded text-2xl"
                  style={{ background: `hsl(${photo.hue} 55% 85%)` }}
                >
                  🖼
                </div>
                <span className="text-xs text-primary-600">{photo.label}</span>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`<VirtualList
  items={photos}
  direction="horizontal"
  itemHeight={160}           // item width in horizontal mode
  height={140}
  renderItem={(photo) => (
    <div className="flex h-full flex-col items-center justify-center">
      <img src={photo.src} className="h-20 w-32 object-cover rounded" />
      <span className="text-xs">{photo.label}</span>
    </div>
  )}
/>`}
        />
      </Section>

      {/* ── 4. Infinite scroll ──────────────────────────────────────────────── */}
      <Section title="Infinite Scroll">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Use <code>onReachEnd</code> + <code>isLoading</code> to implement infinite loading. A
          trailing spinner appears while new data is being fetched.
          <code>onReachEnd</code> fires once per scroll burst — it resets automatically when{" "}
          <code>items</code> grows.
        </p>
        <div className="h-64 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            items={infiniteItems}
            itemHeight={52}
            isLoading={infiniteLoading}
            onReachEnd={loadMore}
            reachEndThreshold={80}
            getItemKey={(it) => it.id}
            renderItem={(item) => (
              <div className="flex h-full items-center gap-3 border-b border-primary-100 px-4 dark:border-primary-800">
                <span className="h-7 w-7 flex-none rounded-full bg-primary-200 text-center text-xs leading-7 dark:bg-primary-700">
                  {item.id % 10}
                </span>
                <span className="text-sm text-primary-800 dark:text-primary-200">{item.label}</span>
              </div>
            )}
          />
        </div>
        <span className="mt-1 block text-xs text-primary-400">
          {infiniteItems.length} rows loaded
        </span>
        <CodeExample
          code={`const [items, setItems] = useState(initialPage);
const [loading, setLoading] = useState(false);

const loadMore = useCallback(() => {
  if (loading) return;
  setLoading(true);
  fetchNextPage().then((page) => {
    setItems((prev) => [...prev, ...page]);
    setLoading(false);
  });
}, [loading]);

<VirtualList
  items={items}
  itemHeight={52}
  isLoading={loading}
  onReachEnd={loadMore}
  reachEndThreshold={80}
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      {/* ── 5. Scroll to index ──────────────────────────────────────────────── */}
      <Section title="Scroll to Index (Imperative Handle)">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Attach a <code>ref</code> to get a <code>VirtualListHandle</code> with{" "}
          <code>scrollToIndex()</code>, <code>scrollToOffset()</code>, and{" "}
          <code>getScrollOffset()</code>.
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={0}
            max={HUGE_LIST.length - 1}
            value={jumpIndex}
            onChange={(e) => setJumpIndex(Number(e.target.value))}
            className="w-28 rounded-md border border-primary-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-400 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-100"
          />
          {(["start", "center", "end", "auto"] as const).map((align) => (
            <button
              key={align}
              onClick={() => jumpRef.current?.scrollToIndex(jumpIndex, align)}
              className="rounded bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
            >
              → {align}
            </button>
          ))}
          <button
            onClick={() => jumpRef.current?.scrollToOffset(0)}
            className="rounded bg-secondary-200 px-3 py-1.5 text-xs font-medium text-secondary-800 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-100"
          >
            ↑ top
          </button>
        </div>
        <div className="h-60 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            ref={jumpRef}
            items={HUGE_LIST}
            itemHeight={44}
            getItemKey={(it) => it.id}
            renderItem={(item, i) => (
              <div
                className={`flex h-full items-center gap-3 border-b border-primary-100 px-4 transition-colors dark:border-primary-800 ${i === jumpIndex ? "bg-primary-100 dark:bg-primary-800" : ""}`}
              >
                <span className="w-20 font-mono text-xs text-primary-400">#{item.id}</span>
                <span className="text-sm text-primary-800 dark:text-primary-200">{item.name}</span>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`import { useRef } from "react";
import { VirtualList } from "@jacshuo/onyx";
import type { VirtualListHandle } from "@jacshuo/onyx";

const listRef = useRef<VirtualListHandle>(null);

// Jump to row 5000, center-aligned
listRef.current?.scrollToIndex(5000, "center");

// Jump to pixel offset
listRef.current?.scrollToOffset(10000);

<VirtualList
  ref={listRef}
  items={data}
  itemHeight={44}
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      {/* ── 6. Multi-select rows ────────────────────────────────────────────── */}
      <Section title="Multi-Select Rows">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Selection state lives outside the list — the <code>renderItem</code> callback receives the
          item and index and can close over any external state. Only visible rows re-render when the
          selection changes.
        </p>
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setSelected(new Set())}
            className="rounded bg-secondary-200 px-3 py-1 text-xs font-medium text-secondary-800 hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-100"
          >
            Clear
          </button>
          <span className="text-xs text-primary-400">{selected.size} selected</span>
        </div>
        <div className="h-64 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            items={HUGE_LIST.slice(0, 2000)}
            itemHeight={44}
            getItemKey={(it) => it.id}
            renderItem={(item) => (
              <div
                role="checkbox"
                aria-checked={selected.has(item.id)}
                onClick={() => toggleSelect(item.id)}
                className={`flex h-full cursor-pointer items-center gap-3 border-b border-primary-100 px-4 transition-colors dark:border-primary-800 ${selected.has(item.id) ? "bg-primary-100 dark:bg-primary-800/60" : "hover:bg-primary-50 dark:hover:bg-primary-900/40"}`}
              >
                <span
                  className={`flex h-4 w-4 flex-none items-center justify-center rounded border transition-colors ${selected.has(item.id) ? "border-primary-500 bg-primary-500 text-white" : "border-primary-300 dark:border-primary-600"}`}
                >
                  {selected.has(item.id) && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="w-20 font-mono text-xs text-primary-400">#{item.id}</span>
                <span className="flex-1 text-sm text-primary-800 dark:text-primary-200">
                  {item.name}
                </span>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`const [selected, setSelected] = useState<Set<number>>(new Set());

<VirtualList
  items={data}
  itemHeight={44}
  renderItem={(item) => (
    <div
      role="checkbox"
      aria-checked={selected.has(item.id)}
      onClick={() => toggleSelect(item.id)}
      className={selected.has(item.id) ? "bg-primary-100" : ""}
    >
      <Checkbox checked={selected.has(item.id)} />
      {item.name}
    </div>
  )}
/>`}
        />
      </Section>

      {/* ── 7. Scroll restoration ───────────────────────────────────────────── */}
      <Section title="Scroll Position Persistence (scrollRestorationId)">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Pass a unique <code>scrollRestorationId</code>. The scroll offset is written to{" "}
          <code>localStorage</code> on every scroll and restored on mount. Reload the page — your
          position is remembered.
        </p>
        <div className="h-56 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            items={HUGE_LIST}
            itemHeight={44}
            scrollRestorationId="demo-huge-list"
            getItemKey={(it) => it.id}
            renderItem={(item) => (
              <div className="flex h-full items-center gap-3 border-b border-primary-100 px-4 dark:border-primary-800">
                <span className="w-20 font-mono text-xs text-primary-400">#{item.id}</span>
                <span className="text-sm text-primary-800 dark:text-primary-200">{item.name}</span>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`<VirtualList
  items={data}
  itemHeight={44}
  scrollRestorationId="my-list-view"   // key: "onyx-vlist:my-list-view"
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      {/* ── 8. Empty and loading states ─────────────────────────────────────── */}
      <Section title="Empty State & Loading Indicator">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          Use <code>emptyText</code> / <code>loadingText</code> to change the default indicator
          labels (supports any language). Provide <code>emptyRenderer</code> /{" "}
          <code>loadingRenderer</code> to replace the default UI entirely.
        </p>
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setShowEmpty((v) => !v)}
            className="rounded bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
          >
            Toggle empty
          </button>
          <button
            onClick={() => setArtificialLoading((v) => !v)}
            className="rounded bg-warning-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-warning-600"
          >
            Toggle loading
          </button>
        </div>
        <div className="h-44 overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <VirtualList
            items={showEmpty ? [] : HUGE_LIST.slice(0, 30)}
            itemHeight={44}
            isLoading={artificialLoading}
            emptyText="Nothing here yet"
            loadingText="Fetching data…"
            renderItem={(item) => (
              <div className="flex h-full items-center border-b border-primary-100 px-4 dark:border-primary-800">
                <span className="text-sm text-primary-800 dark:text-primary-200">{item.name}</span>
              </div>
            )}
          />
        </div>
        <CodeExample
          code={`// Option A — just change the text (supports any language)
<VirtualList
  items={items}
  itemHeight={44}
  isLoading={loading}
  emptyText="暂无数据"        // shown in the default empty state
  loadingText="加载中…"       // shown in the default loading spinner
  renderItem={(item) => <Row item={item} />}
/>

// Option B — replace the UI entirely
<VirtualList
  items={items}
  itemHeight={44}
  isLoading={loading}
  emptyRenderer={() => <MyEmptyState />}
  loadingRenderer={() => <MySpinner />}
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      {/* ── 9. Inside SplitPanel ────────────────────────────────────────────── */}
      <Section title="Inside SplitPanel — Nav + Content">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          <code>VirtualList</code> fills its container when <code>height=&quot;100%&quot;</code>.
          Combine it with <code>SplitPanel</code>, <code>Panel</code>, or any scrollable container
          to build complex desktop-app layouts.
        </p>
        <div
          className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700"
          style={{ height: 280 }}
        >
          <SplitPanel
            direction="horizontal"
            panes={[
              {
                id: "nav",
                defaultSize: 180,
                minSize: 120,
                background: "var(--color-primary-50)",
                children: (
                  <VirtualList
                    items={splitNavItems}
                    itemHeight={36}
                    getItemKey={(it) => it.id}
                    renderItem={(item) => (
                      <button
                        onClick={() => setActiveNavItem(item.id)}
                        className={`flex h-full w-full items-center gap-2 px-3 text-sm transition-colors ${item.id === activeNavItem ? "bg-primary-200 font-medium text-primary-900 dark:bg-primary-700 dark:text-white" : "text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800"}`}
                      >
                        <span>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    )}
                  />
                ),
              },
              {
                id: "content",
                minSize: 200,
                children: (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                    <span className="text-4xl">{splitNavItems[activeNavItem]?.icon}</span>
                    <p className="font-semibold text-primary-800 dark:text-primary-200">
                      {splitNavItems[activeNavItem]?.label}
                    </p>
                    <p className="text-sm text-primary-400">
                      Item {activeNavItem + 1} of {splitNavItems.length}
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <CodeExample
          code={`<SplitPanel
  direction="horizontal"
  panes={[
    {
      id: "nav",
      defaultSize: 180,
      children: (
        // VirtualList fills the entire pane — height="100%" (default)
        <VirtualList
          items={navItems}
          itemHeight={36}
          renderItem={(item) => (
            <button onClick={() => setActive(item.id)} className="...">
              {item.label}
            </button>
          )}
        />
      ),
    },
    { id: "content", children: <ContentArea activeId={active} /> },
  ]}
/>`}
        />
      </Section>

      {/* ── 10. Inside Panel / Card ────────────────────────────────────────── */}
      <Section title="Inside Panel — Visible Range Callback">
        <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">
          <code>onVisibleRangeChange</code> fires whenever the viewport shifts. Use it to show
          position indicators, update a TOC, or lazy-load detail data for only visible rows.
        </p>
        <Panel>
          <PanelHeader>
            Showing rows {visibleRange[0] + 1}–{visibleRange[1] + 1} of{" "}
            {HUGE_LIST.length.toLocaleString()}
          </PanelHeader>
          <PanelContent className="p-0" style={{ height: 200 }}>
            <VirtualList
              items={HUGE_LIST}
              itemHeight={44}
              onVisibleRangeChange={(s, e) => setVisibleRange([s, e])}
              getItemKey={(it) => it.id}
              renderItem={(item) => (
                <div className="flex h-full items-center gap-3 border-b border-primary-100 px-4 dark:border-primary-800">
                  <span className="w-20 font-mono text-xs text-primary-400">#{item.id}</span>
                  <span className="text-sm text-primary-800 dark:text-primary-200">
                    {item.name}
                  </span>
                </div>
              )}
            />
          </PanelContent>
        </Panel>
        <CodeExample
          code={`const [range, setRange] = useState<[number, number]>([0, 0]);

<Panel>
  <PanelHeader>Rows {range[0] + 1}–{range[1] + 1}</PanelHeader>
  <PanelContent style={{ height: 200 }}>
    <VirtualList
      items={data}
      itemHeight={44}
      onVisibleRangeChange={(start, end) => setRange([start, end])}
      renderItem={(item) => <Row item={item} />}
    />
  </PanelContent>
</Panel>`}
        />
      </Section>

      {/* ── Prop tables ──────────────────────────────────────────────────────── */}
      <Section title="VirtualList Props">
        <PropTable rows={propsRows} title="VirtualList<T>" />
      </Section>

      <Section title="VirtualListHandle">
        <PropTable rows={handleRows} title="VirtualListHandle (ref)" />
      </Section>
    </div>
  );
}
