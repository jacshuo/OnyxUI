import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

/* ── Prop tables ─────────────────────────────────────────── */

const mainProps: PropRow[] = [
  { prop: "value", type: "Date | null", description: "Controlled selected value." },
  { prop: "defaultValue", type: "Date | null", description: "Uncontrolled initial value." },
  {
    prop: "onChange",
    type: "(date: Date | null) => void",
    description: "Called when the user confirms a new selection.",
  },
  {
    prop: "mode",
    type: '"date" | "time" | "datetime"',
    default: '"datetime"',
    description: 'Picker mode. "date" shows date columns only, "time" shows time columns only.',
  },
  {
    prop: "minDate",
    type: "Date",
    description: "Minimum selectable date. Days before this are disabled in the calendar.",
  },
  {
    prop: "maxDate",
    type: "Date",
    description: "Maximum selectable date. Days after this are disabled.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the trigger and prevents all interaction.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Text shown in the trigger when no value is selected.",
  },
  {
    prop: "format",
    type: "string",
    description:
      "Display-format string. Available tokens: YYYY YY MMMM MMM MM M DD D HH H hh h mm ss A a",
  },
  {
    prop: "use24Hour",
    type: "boolean",
    default: "true",
    description: "24-hour clock. Set false to show a 12-hour column with an AM/PM column.",
  },
  {
    prop: "showSeconds",
    type: "boolean",
    default: "true",
    description: "Show the seconds column when mode includes time.",
  },
  {
    prop: "locale",
    type: "string",
    default: '"en-US"',
    description: "BCP-47 locale for month and weekday name localisation.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra class applied to the root inline wrapper element.",
  },
  {
    prop: "popupClassName",
    type: "string",
    description: "Extra class applied to the frosted-glass popup panel.",
  },
  {
    prop: "triggerClassName",
    type: "string",
    description: "Extra class applied to the trigger button.",
  },
  { prop: "onOpen", type: "() => void", description: "Called when the popup opens." },
  {
    prop: "onClose",
    type: "() => void",
    description: "Called when the popup closes (either cancel or confirm).",
  },
];

/* ── Code examples ───────────────────────────────────────── */

const basicCode = `import { DateTimePicker } from "@jacshuo/onyx";

// Uncontrolled
<DateTimePicker defaultValue={new Date()} />`;

const controlledCode = `import { useState } from "react";
import { DateTimePicker } from "@jacshuo/onyx";

export function Example() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      placeholder="Select a date…"
    />
  );
}`;

const modesCode = `// Date only — year / month / day columns
<DateTimePicker mode="date" />

// Time only — hour / minute / second columns
<DateTimePicker mode="time" />

// Full — all columns (default)
<DateTimePicker mode="datetime" />`;

const localeFmtCode = `// Chinese locale
<DateTimePicker locale="zh-CN" />

// Custom display format
<DateTimePicker format="MMMM D, YYYY HH:mm" showSeconds={false} />

// 12-hour AM/PM clock
<DateTimePicker use24Hour={false} format="MM/DD/YYYY hh:mm A" />`;

const constraintsCode = `const min = new Date();
min.setDate(min.getDate() - 7);

const max = new Date();
max.setDate(max.getDate() + 30);

<DateTimePicker mode="date" minDate={min} maxDate={max} />`;

const typesCode = `export type DateTimeMode = "date" | "time" | "datetime";
export type OffsetUnit = "day" | "week" | "month" | "year";
export type OffsetDirection = "future" | "past";

export interface DateTimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: DateTimeMode;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  use24Hour?: boolean;
  showSeconds?: boolean;
  locale?: string;
  className?: string;
  popupClassName?: string;
  triggerClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}`;

const cssTokensCode = `/* All --dtp-* custom properties can be overridden per-instance
   or globally on :root / .dark */
:root {
  --dtp-panel-bg: rgba(255, 255, 255, 0.9);  /* frosted glass fill */
  --dtp-panel-border: var(--color-primary-200); /* panel & column border */
  --dtp-blur: 16px;                           /* backdrop-filter blur */
  --dtp-accent: var(--color-primary-500);     /* confirm btn, selected day, offset apply */
  --dtp-accent-bg: var(--color-primary-100);  /* selection highlight band */
  --dtp-text-selected: var(--color-primary-800); /* selected column item */
  --dtp-text-muted: var(--color-secondary-400);  /* unselected column items */
  --dtp-text-primary: var(--color-primary-700);  /* labels, titles */
  --dtp-item-h: 40px;                         /* height of each drum-roll row */
  --dtp-radius: 16px;                         /* panel corner radius */
  --dtp-shadow: 0 20px 60px rgba(0,0,0,.12);  /* panel drop shadow */
}`;

/* ── Page ────────────────────────────────────────────────── */

export default function DateTimePickerDoc() {
  return (
    <div className="space-y-10 max-w-3xl">
      <PageTitle>DateTimePicker</PageTitle>

      {/* Overview ──────────────────────────────────────────── */}
      <Section title="Overview">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
          <strong>DateTimePicker</strong> is a complex date / time selection component that combines
          two interaction paradigms:
        </p>
        <ul className="mt-3 ml-4 space-y-1.5 list-disc text-sm text-secondary-600 dark:text-secondary-400">
          <li>
            <strong>Drum-roll (scroll-wheel) columns</strong> — iOS / Android-style infinite-feel
            scroll columns for year, month, day, hour, minute, and second. Native touch-scroll works
            on mobile; click-to-select works everywhere.
          </li>
          <li>
            <strong>Calendar grid</strong> — a standard month grid toggled from the panel header.
            Disabled days respect <code>minDate</code> / <code>maxDate</code>; today is highlighted.
          </li>
          <li>
            <strong>Quick-offset row</strong> — a one-liner at the bottom of the panel lets users
            type <em>N days / weeks / months / years from now / before now</em> and click Apply.
          </li>
        </ul>
        <p className="mt-3 text-sm text-secondary-600 dark:text-secondary-400">
          The panel uses <strong>frosted glass</strong> (backdrop-filter blur) and adapts to a
          bottom-sheet on narrow screens. No external date libraries are used — all logic relies on
          the native <code>Date</code> / <code>Intl.DateTimeFormat</code> APIs.
        </p>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          Place in the <strong>Extras</strong> category (high complexity, heavy API surface).
        </p>
      </Section>

      {/* Basic usage ───────────────────────────────────────── */}
      <Section title="Basic usage">
        <CodeExample code={basicCode} />
      </Section>

      {/* Controlled ────────────────────────────────────────── */}
      <Section title="Controlled">
        <CodeExample code={controlledCode} />
      </Section>

      {/* Modes ─────────────────────────────────────────────── */}
      <Section title="Modes">
        <CodeExample code={modesCode} />
      </Section>

      {/* Locale & format ───────────────────────────────────── */}
      <Section title="Locale & format">
        <CodeExample code={localeFmtCode} />
      </Section>

      {/* Constraints ───────────────────────────────────────── */}
      <Section title="Min/Max constraints">
        <CodeExample code={constraintsCode} />
      </Section>

      {/* Props / API table ──────────────────────────────────── */}
      <Section title="Props">
        <PropTable rows={mainProps} title="DateTimePickerProps" />
      </Section>

      {/* Type references ───────────────────────────────────── */}
      <Section title="Type References">
        <CodeExample code={typesCode} language="typescript" />
      </Section>

      {/* CSS token overrides ───────────────────────────────── */}
      <Section title="CSS Token Overrides">
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
          All visual properties are exposed as CSS custom properties prefixed <code>--dtp-</code>.
          Override them on <code>:root</code>, <code>.dark</code>, or any ancestor to theme the
          picker.
        </p>
        <CodeExample code={cssTokensCode} language="css" />
      </Section>
    </div>
  );
}
