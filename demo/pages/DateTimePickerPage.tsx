import { useState } from "react";
import { DateTimePicker } from "../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "./helpers";

/* ── Props table ─────────────────────────────────────────── */
const propRows: PropRow[] = [
  {
    prop: "value",
    type: "Date | null",
    description: "Controlled selected value.",
  },
  {
    prop: "defaultValue",
    type: "Date | null",
    description: "Uncontrolled initial value.",
  },
  {
    prop: "onChange",
    type: "(date: Date | null) => void",
    description: "Called when the user confirms a selection.",
  },
  {
    prop: "mode",
    type: '"date" | "time" | "datetime"',
    default: '"datetime"',
    description: "Controls which columns / panels are visible.",
  },
  {
    prop: "minDate",
    type: "Date",
    description: "Minimum selectable date (inclusive).",
  },
  {
    prop: "maxDate",
    type: "Date",
    description: "Maximum selectable date (inclusive).",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the trigger and prevent interaction.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Trigger placeholder when no value is selected.",
  },
  {
    prop: "format",
    type: "string",
    description: "Display-format string. Tokens: YYYY MM DD HH mm ss A etc.",
  },
  {
    prop: "use24Hour",
    type: "boolean",
    default: "true",
    description: "24-hour clock; false enables 12-hour AM/PM column.",
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
    description: "BCP-47 locale for month/weekday names.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra class on the root wrapper element.",
  },
  {
    prop: "popupClassName",
    type: "string",
    description: "Extra class on the frosted-glass popup panel.",
  },
  {
    prop: "triggerClassName",
    type: "string",
    description: "Extra class on the trigger button.",
  },
  {
    prop: "onOpen",
    type: "() => void",
    description: "Called when the popup opens.",
  },
  {
    prop: "onClose",
    type: "() => void",
    description: "Called when the popup closes (cancel or confirm).",
  },
];

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString();
}

const minDate = new Date();
minDate.setDate(minDate.getDate() - 7);
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);

/* ── Page ────────────────────────────────────────────────── */

export default function DateTimePickerPage() {
  const [controlled, setControlled] = useState<Date | null>(null);
  const [locale, setLocale] = useState<"en-US" | "zh-CN">("en-US");
  const [use24Hour, setUse24Hour] = useState(true);

  return (
    <div className="space-y-10 max-w-3xl">
      <PageTitle>DateTimePicker</PageTitle>

      {/* ── 1. Uncontrolled (default datetime) ──────────────── */}
      <Section title="1 · Uncontrolled — datetime (default)">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">
          Uncontrolled usage with <code>defaultValue</code>. The full drum-roll picker shows year /
          month / day / hour / minute / second columns plus a calendar grid toggle.
        </p>
        <DateTimePicker
          defaultValue={new Date()}
          onOpen={() => console.log("open")}
          onClose={() => console.log("close")}
        />
        <CodeExample
          code={`<DateTimePicker
  defaultValue={new Date()}
  onOpen={() => console.log("open")}
/>`}
        />
      </Section>

      {/* ── 2. Controlled ───────────────────────────────────── */}
      <Section title="2 · Controlled">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">
          Controlled via <code>value</code> / <code>onChange</code>. Selected:{" "}
          <code>{fmt(controlled)}</code>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <DateTimePicker
            value={controlled}
            onChange={setControlled}
            placeholder="Pick a datetime…"
          />
          <button
            type="button"
            onClick={() => setControlled(null)}
            className="text-xs text-secondary-400 hover:text-danger-500 px-2 py-1 border border-primary-200 rounded dark:border-primary-700"
          >
            Reset
          </button>
        </div>
        <CodeExample
          code={`const [value, setValue] = useState<Date | null>(null);

<DateTimePicker value={value} onChange={setValue} placeholder="Pick a datetime…" />`}
        />
      </Section>

      {/* ── 3. Modes ─────────────────────────────────────────── */}
      <Section title="3 · Modes — date / time / datetime">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-secondary-400 mb-2">mode=&quot;date&quot;</p>
            <DateTimePicker mode="date" placeholder="Pick a date" />
          </div>
          <div>
            <p className="text-xs text-secondary-400 mb-2">mode=&quot;time&quot;</p>
            <DateTimePicker mode="time" placeholder="Pick a time" />
          </div>
          <div>
            <p className="text-xs text-secondary-400 mb-2">mode=&quot;datetime&quot;</p>
            <DateTimePicker mode="datetime" placeholder="Pick datetime" />
          </div>
        </div>
        <CodeExample
          code={`<DateTimePicker mode="date" />
<DateTimePicker mode="time" />
<DateTimePicker mode="datetime" />`}
        />
      </Section>

      {/* ── 4. min/max constraint ───────────────────────────── */}
      <Section title="4 · Min/Max date constraints">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">
          Selectable range: −7 days to +30 days from today.
        </p>
        <DateTimePicker
          mode="date"
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Constrained date range"
        />
        <CodeExample
          code={`const min = new Date(); min.setDate(min.getDate() - 7);
const max = new Date(); max.setDate(max.getDate() + 30);

<DateTimePicker mode="date" minDate={min} maxDate={max} />`}
        />
      </Section>

      {/* ── 5. Quick-offset input ───────────────────────────── */}
      <Section title="5 · Quick-offset input">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">
          The row at the bottom of the date/datetime panel lets you type a number, pick a unit (Day
          / Week / Month / Year) and a direction (from now / before now), then click
          <em> Apply</em> to jump directly to that relative date.
        </p>
        <DateTimePicker mode="datetime" placeholder="Open → try Quick Offset row at bottom" />
        <CodeExample
          code={`// Open the picker and use the Quick Offset row:
// [3] [Month] [from now] [Apply]  →  sets working date to 3 months from today
<DateTimePicker mode="datetime" />`}
        />
      </Section>

      {/* ── 6. 24-hour vs AM/PM ─────────────────────────────── */}
      <Section title="6 · 24-hour vs 12-hour AM/PM">
        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={use24Hour}
              onChange={(e) => setUse24Hour(e.target.checked)}
              className="rounded"
            />
            <span>use24Hour</span>
          </label>
          <span className="text-xs text-secondary-400">
            ({use24Hour ? "24-hour HH col" : "12-hour hh + AM/PM cols"})
          </span>
        </div>
        <DateTimePicker mode="time" use24Hour={use24Hour} placeholder="Pick a time" />
        <CodeExample
          code={`// 24-hour (default)
<DateTimePicker mode="time" use24Hour />

// 12-hour with AM/PM column
<DateTimePicker mode="time" use24Hour={false} />`}
        />
      </Section>

      {/* ── 7. Locale ────────────────────────────────────────── */}
      <Section title="7 · Locale switching — en-US / zh-CN">
        <div className="flex items-center gap-3 mb-3">
          {(["en-US", "zh-CN"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`text-xs px-3 py-1 rounded border transition-colors
                ${locale === l ? "bg-primary-600 text-white border-primary-600" : "border-primary-200 text-secondary-500 hover:border-primary-400 dark:border-primary-700"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <DateTimePicker
          locale={locale}
          placeholder={locale === "zh-CN" ? "选择日期时间" : "Select date / time"}
        />
        <CodeExample
          code={`<DateTimePicker locale="zh-CN" placeholder="选择日期时间" />
<DateTimePicker locale="en-US" placeholder="Select date / time" />`}
        />
      </Section>

      {/* ── 8. Disabled ─────────────────────────────────────── */}
      <Section title="8 · Disabled state">
        <DateTimePicker
          disabled
          defaultValue={new Date("2025-06-15T14:30:00")}
          placeholder="Disabled picker"
        />
        <CodeExample code={`<DateTimePicker disabled defaultValue={new Date()} />`} />
      </Section>

      {/* ── 9. Custom format ─────────────────────────────────── */}
      <Section title="9 · Custom format string">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">
          Tokens: <code>YYYY</code> <code>MMMM</code> <code>MMM</code> <code>MM</code>{" "}
          <code>DD</code> <code>HH</code> <code>hh</code> <code>mm</code> <code>ss</code>{" "}
          <code>A</code>
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-secondary-400 mb-2">format=&quot;MMMM D, YYYY HH:mm&quot;</p>
            <DateTimePicker
              mode="datetime"
              format="MMMM D, YYYY HH:mm"
              showSeconds={false}
              defaultValue={new Date()}
            />
          </div>
          <div>
            <p className="text-xs text-secondary-400 mb-2">
              format=&quot;MM/DD/YY hh:mm A&quot; (12-hour)
            </p>
            <DateTimePicker
              mode="datetime"
              format="MM/DD/YY hh:mm A"
              use24Hour={false}
              showSeconds={false}
              defaultValue={new Date()}
            />
          </div>
        </div>
        <CodeExample
          code={`<DateTimePicker
  mode="datetime"
  format="MMMM D, YYYY HH:mm"
  showSeconds={false}
/>`}
        />
      </Section>

      {/* ── Props table ──────────────────────────────────────── */}
      <Section title="API — DateTimePickerProps">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
