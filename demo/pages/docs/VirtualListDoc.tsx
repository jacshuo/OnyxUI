import React from "react";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const propsRows: PropRow[] = [
  {
    prop: "items",
    type: "T[]",
    required: true,
    description:
      "Full dataset to virtualise. Change the array reference to hot-swap or extend data.",
  },
  {
    prop: "itemHeight",
    type: "number | (item: T, index: number) => number",
    required: true,
    description:
      "Fixed height in px (number) or a per-item size function (variable mode). Fixed mode uses O(1) offset lookup; variable mode measures each row via ResizeObserver.",
  },
  {
    prop: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    required: true,
    description:
      "Render callback. Each item is wrapped in an absolutely-positioned div — you don't need to apply any layout styles yourself.",
  },
  {
    prop: "getItemKey",
    type: "(item: T, index: number) => string | number",
    required: false,
    description:
      "Stable key extractor. Defaults to the item index. Always provide this when rows can be reordered or inserted.",
  },
  {
    prop: "estimatedItemHeight",
    type: "number",
    required: false,
    description:
      "Placeholder height (px) used before a variable-height row is measured. Default: 48.",
  },
  {
    prop: "height",
    type: "number | string",
    required: false,
    description:
      'Viewport height (CSS value). Default: "100%". Pass a pixel number or any CSS string.',
  },
  {
    prop: "width",
    type: "number | string",
    required: false,
    description: 'Viewport width (CSS value). Default: "100%".',
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
    description:
      "Extra rows rendered outside the viewport on each side. Higher values reduce white-flash during fast scroll. Default: 3.",
  },
  {
    prop: "onReachEnd",
    type: "() => void",
    required: false,
    description:
      "Callback fired when the user scrolls within reachEndThreshold px of the end. Ideal for infinite-scroll pagination.",
  },
  {
    prop: "reachEndThreshold",
    type: "number",
    required: false,
    description: "Pixel distance from scroll end that triggers onReachEnd. Default: 120.",
  },
  {
    prop: "isLoading",
    type: "boolean",
    required: false,
    description: "When true, shows a loading indicator at the list end.",
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
    description:
      "localStorage key for persisting and restoring the scroll position across page reloads.",
  },
  {
    prop: "onScroll",
    type: "(offset: number) => void",
    required: false,
    description: "Called on every scroll event with the current pixel offset.",
  },
  {
    prop: "onVisibleRangeChange",
    type: "(startIndex: number, endIndex: number) => void",
    required: false,
    description:
      "Fired whenever the set of visually visible items changes (ignores overscan buffer).",
  },
  {
    prop: "itemClassName",
    type: "string",
    required: false,
    description: "Class name applied to every item wrapper div.",
  },
  {
    prop: "className",
    type: "string",
    required: false,
    description: "Class for the outer scroll container.",
  },
  {
    prop: "style",
    type: "CSSProperties",
    required: false,
    description: "Inline style for the outer scroll container.",
  },
  {
    prop: "ref (forwarded)",
    type: "VirtualListHandle",
    required: false,
    description: "Imperative handle — scrollToIndex(), scrollToOffset(), getScrollOffset().",
  },
];

const handleRows: PropRow[] = [
  {
    prop: "scrollToIndex",
    type: "(index: number, align?: VirtualListAlign) => void",
    required: false,
    description:
      'Smooth-scrolls to bring item at index into view. align: "start" | "end" | "center" | "auto" (default).',
  },
  {
    prop: "scrollToOffset",
    type: "(offset: number) => void",
    required: false,
    description: "Smooth-scrolls to an exact pixel offset.",
  },
  {
    prop: "getScrollOffset",
    type: "() => number",
    required: false,
    description: "Returns the current scroll offset in pixels.",
  },
];

const typeRefRows: PropRow[] = [
  {
    prop: "VirtualListAlign",
    type: '"start" | "center" | "end" | "auto"',
    required: false,
    description: "Alignment for scrollToIndex().",
  },
  {
    prop: "VirtualListDirection",
    type: '"vertical" | "horizontal"',
    required: false,
    description: "Scroll axis.",
  },
  {
    prop: "VirtualListHandle",
    type: "interface",
    required: false,
    description: "Imperative handle interface (use as the type of your ref).",
  },
  {
    prop: "VirtualListProps<T>",
    type: "interface",
    required: false,
    description: "Complete props type. Generic over item type T.",
  },
];

export default function VirtualListDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>VirtualList</PageTitle>

      <Section title="Overview">
        <p className="text-sm leading-relaxed text-primary-700 dark:text-primary-300">
          <code>VirtualList</code> renders only the visible slice of an arbitrarily large dataset.
          The DOM node count stays constant regardless of how many items you pass — making it
          equally comfortable with 1 000 or 1 000 000 rows.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-primary-600 dark:text-primary-400">
          <li>
            ⚡ <strong>Fixed-height mode</strong> — O(1) offset lookup, zero measurement overhead
          </li>
          <li>
            📐 <strong>Variable-height mode</strong> — per-item heights auto-measured via{" "}
            <code>ResizeObserver</code>
          </li>
          <li>
            ↔ <strong>Horizontal axis</strong> — same API, just set{" "}
            <code>direction=&quot;horizontal&quot;</code>
          </li>
          <li>
            ∞ <strong>Infinite scroll</strong> — <code>onReachEnd</code> + <code>isLoading</code>
          </li>
          <li>
            🎯 <strong>Scroll to index</strong> — imperative <code>ref</code> handle
          </li>
          <li>
            💾 <strong>Scroll restoration</strong> — persist position to localStorage
          </li>
          <li>
            📦 <strong>Container-agnostic</strong> — works inside <code>Panel</code>,{" "}
            <code>SplitPanel</code>, <code>Card</code>, or a plain <code>div</code>
          </li>
        </ul>
      </Section>

      <Section title="Import">
        <CodeExample
          code={`import { VirtualList } from "@jacshuo/onyx";
import type { VirtualListHandle, VirtualListProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Basic Usage — Fixed Height">
        <CodeExample
          code={`import { VirtualList } from "@jacshuo/onyx";

const data = Array.from({ length: 100_000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));

export function MyList() {
  return (
    <div style={{ height: 400 }}>
      <VirtualList
        items={data}
        itemHeight={48}
        getItemKey={(it) => it.id}
        renderItem={(item) => (
          <div className="flex h-full items-center border-b px-4">
            {item.name}
          </div>
        )}
      />
    </div>
  );
}`}
        />
      </Section>

      <Section title="Variable-Height Rows">
        <CodeExample
          code={`<VirtualList
  items={messages}
  // Function form → ResizeObserver measures each item after first render
  itemHeight={() => 64}
  estimatedItemHeight={80}   // placeholder until measured — reduces layout shift
  renderItem={(msg) => (
    <div className="border-b px-4 py-3">
      <strong>{msg.author}</strong>
      <p className="mt-1 text-sm">{msg.body}</p>
    </div>
  )}
/>`}
        />
      </Section>

      <Section title="Horizontal List">
        <CodeExample
          code={`<VirtualList
  items={cards}
  direction="horizontal"
  itemHeight={180}   // item width in horizontal mode
  height={200}
  renderItem={(card) => (
    <div className="flex h-full flex-col items-center justify-center border-r">
      <img src={card.thumb} className="h-32 object-cover" />
      <span className="mt-2 text-xs">{card.title}</span>
    </div>
  )}
/>`}
        />
      </Section>

      <Section title="Infinite Scroll">
        <CodeExample
          code={`const [items, setItems] = useState(initialBatch);
const [loading, setLoading] = useState(false);

const loadMore = useCallback(() => {
  if (loading) return;
  setLoading(true);
  api.fetchNextPage().then((batch) => {
    setItems((prev) => [...prev, ...batch]);
    setLoading(false);
  });
}, [loading]);

<VirtualList
  items={items}
  itemHeight={56}
  isLoading={loading}
  onReachEnd={loadMore}
  reachEndThreshold={100}
  renderItem={(item) => <Row item={item} />}
/>`}
        />
        <p className="mt-2 text-xs text-primary-500">
          <code>onReachEnd</code> fires at most once per scroll burst. It resets automatically when
          the <code>items</code> array grows (new page received).
        </p>
      </Section>

      <Section title="Scroll to Index (Imperative)">
        <CodeExample
          code={`import { useRef } from "react";
import type { VirtualListHandle } from "@jacshuo/onyx";

const listRef = useRef<VirtualListHandle>(null);

// Jump to a specific item
listRef.current?.scrollToIndex(999, "center");

// Scroll to top
listRef.current?.scrollToOffset(0);

// Read current position
const pos = listRef.current?.getScrollOffset();

<VirtualList ref={listRef} items={data} itemHeight={48} renderItem={...} />`}
        />
      </Section>

      <Section title="Scroll Restoration">
        <CodeExample
          code={`// Scroll position is written to localStorage on every scroll
// and restored on component mount.
<VirtualList
  items={data}
  itemHeight={44}
  scrollRestorationId="inbox-list"   // key: "onyx-vlist:inbox-list"
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      <Section title="Inside SplitPanel">
        <CodeExample
          code={`import { SplitPanel, VirtualList } from "@jacshuo/onyx";

<SplitPanel
  direction="horizontal"
  panes={[
    {
      id: "sidebar",
      defaultSize: 200,
      children: (
        // height defaults to "100%" — fills the pane exactly
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
    { id: "main", children: <MainContent activeId={activeId} /> },
  ]}
/>`}
        />
      </Section>

      <Section title="Custom Empty & Loading States">
        <p className="mb-3 text-sm leading-relaxed text-primary-700 dark:text-primary-300">
          Two levels of customisation are available. Use <code>emptyText</code> /{" "}
          <code>loadingText</code> to change the label while keeping the default indicator UI (handy
          for i18n / non-English text). For full control, pass <code>emptyRenderer</code> /{" "}
          <code>loadingRenderer</code> to replace the UI entirely.
        </p>
        <p className="mb-3 text-sm text-primary-700 dark:text-primary-300">
          The empty state and loading indicator are <strong>independent</strong> — both can appear
          simultaneously (e.g. while a first page is loading into an empty list).
        </p>
        <CodeExample
          code={`// Option A — change the label only (i18n-friendly)
<VirtualList
  items={items}
  itemHeight={44}
  isLoading={loading}
  emptyText="暂无数据"        // default empty indicator, custom label
  loadingText="加载中…"       // default spinner, custom label
  renderItem={(item) => <Row item={item} />}
/>

// Option B — replace the UI entirely
<VirtualList
  items={items}
  itemHeight={44}
  isLoading={loading}
  emptyRenderer={() => (
    <div className="flex h-full items-center justify-center text-primary-400">
      No results found
    </div>
  )}
  loadingRenderer={() => (
    <div className="flex justify-center py-4">
      <Spinner />
    </div>
  )}
  renderItem={(item) => <Row item={item} />}
/>`}
        />
      </Section>

      <Section title="onVisibleRangeChange">
        <CodeExample
          code={`const [range, setRange] = useState({ start: 0, end: 0 });

<VirtualList
  items={data}
  itemHeight={44}
  onVisibleRangeChange={(start, end) => setRange({ start, end })}
  renderItem={(item) => <Row item={item} />}
/>
// Use range.start / range.end to drive a scrollbar, TOC, or lazy-detail loader`}
        />
      </Section>

      <Section title="VirtualList Props">
        <PropTable rows={propsRows} title="VirtualList<T>" />
      </Section>

      <Section title="VirtualListHandle">
        <PropTable rows={handleRows} title="ref: VirtualListHandle" />
      </Section>

      <Section title="Type Reference">
        <PropTable rows={typeRefRows} title="Exported Types" />
      </Section>

      <Section title="Performance Notes">
        <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
          <li>
            <strong>Fixed vs variable height:</strong> prefer a number for <code>itemHeight</code>
            whenever rows have the same height. This eliminates all measurement work.
          </li>
          <li>
            <strong>overscan:</strong> the default of 3 balances smoothness vs. extra renders. Raise
            it (e.g. to 6–10) for very fast scroll wheels; lower it inside low-power environments.
          </li>
          <li>
            <strong>getItemKey:</strong> providing a stable key prevents React from unmounting /
            remounting rows during scroll, which matters for rows with internal animations or forms.
          </li>
          <li>
            <strong>renderItem purity:</strong> the callback is called during render for every
            visible row. Keep it cheap — avoid heavy computation inside it.
          </li>
          <li>
            <strong>itemClassName:</strong> prefer this over adding a wrapper in renderItem when you
            need to style all rows uniformly (avoids extra nesting).
          </li>
        </ul>
      </Section>
    </div>
  );
}
