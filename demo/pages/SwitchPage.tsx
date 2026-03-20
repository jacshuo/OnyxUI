import { useState } from "react";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Check,
  X,
  Eye,
  EyeOff,
  Bell,
  BellOff,
} from "lucide-react";
import { Switch } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const defaultCode = `<Switch label="Notifications" />
<Switch defaultChecked label="Dark mode" />
<Switch disabled label="Disabled off" />
<Switch disabled defaultChecked label="Disabled on" />`;

const sizesCode = `<Switch size="sm" defaultChecked label="Small" />
<Switch size="md" defaultChecked label="Medium" />
<Switch size="lg" defaultChecked label="Large" />`;

const intentsCode = `<Switch intent="primary"   defaultChecked label="Primary"   />
<Switch intent="secondary" defaultChecked label="Secondary" />
<Switch intent="success"   defaultChecked label="Success"   />
<Switch intent="warning"   defaultChecked label="Warning"   />
<Switch intent="danger"    defaultChecked label="Danger"    />`;

const textCode = `<Switch
  size="lg" intent="primary"
  checkedContent="ON" uncheckedContent="OFF"
  defaultChecked label="Power"
/>`;

const longTextCode = `<Switch
  size="lg" intent="success"
  checkedContent="Enabled" uncheckedContent="Disabled"
  defaultChecked label="Feature toggle"
/>`;

const iconsCode = `<Switch
  size="lg" intent="primary"
  checkedContent={<Sun />} uncheckedContent={<Moon />}
  defaultChecked label="Theme"
/>
<Switch
  size="lg" intent="success"
  checkedContent={<Volume2 />} uncheckedContent={<VolumeX />}
  defaultChecked label="Sound"
/>`;

const controlledCode = `const [checked, setChecked] = useState(false);

<Switch
  size="lg" intent="success"
  checked={checked} onCheckedChange={setChecked}
  checkedContent={<Check />} uncheckedContent={<X />}
  label={checked ? "Active" : "Inactive"}
/>`;

export default function SwitchPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-8">
      <PageTitle>Switch</PageTitle>

      {/* ── Default (no content) ─────────────────────── */}
      <Section title="Default — no text or icons">
        <div className="flex flex-wrap items-center gap-6">
          <Switch label="Notifications" />
          <Switch defaultChecked label="Dark mode" />
          <Switch disabled label="Disabled off" />
          <Switch disabled defaultChecked label="Disabled on" />
        </div>{" "}
        <CodeExample code={defaultCode} />{" "}
      </Section>

      {/* ── Sizes ────────────────────────────────────── */}
      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-6">
          <Switch size="sm" defaultChecked label="Small" />
          <Switch size="md" defaultChecked label="Medium" />
          <Switch size="lg" defaultChecked label="Large" />
        </div>
        <CodeExample code={sizesCode} />
      </Section>
      <Section title="Colors (intents)">
        <div className="flex flex-wrap items-center gap-6">
          <Switch intent="primary" defaultChecked label="Primary" />
          <Switch intent="secondary" defaultChecked label="Secondary" />
          <Switch intent="success" defaultChecked label="Success" />
          <Switch intent="warning" defaultChecked label="Warning" />
          <Switch intent="danger" defaultChecked label="Danger" />
        </div>
        <CodeExample code={intentsCode} />
      </Section>
      <Section title="With text inside">
        <div className="flex flex-wrap items-center gap-6">
          <Switch
            size="lg"
            intent="primary"
            checkedContent="ON"
            uncheckedContent="OFF"
            defaultChecked
            label="Power"
          />
          <Switch
            size="lg"
            intent="success"
            checkedContent="YES"
            uncheckedContent="NO"
            label="Confirm"
          />
          <Switch
            size="lg"
            intent="danger"
            checkedContent="启"
            uncheckedContent="停"
            defaultChecked
            label="状态"
          />
        </div>
        <CodeExample code={textCode} />
      </Section>
      <Section title="Long text — auto-sizing track">
        <div className="flex flex-wrap items-center gap-6">
          <Switch
            size="lg"
            intent="success"
            checkedContent="Enabled"
            uncheckedContent="Disabled"
            defaultChecked
            label="Feature toggle"
          />
          <Switch
            size="lg"
            intent="primary"
            checkedContent="已连接"
            uncheckedContent="未连接"
            label="连接状态"
          />
          <Switch
            size="md"
            intent="warning"
            checkedContent="Public"
            uncheckedContent="Private"
            defaultChecked
            label="Visibility"
          />
        </div>
        <CodeExample code={longTextCode} />
      </Section>

      {/* ── With icons ───────────────────────────────── */}
      <Section title="With icons inside">
        <div className="flex flex-wrap items-center gap-6">
          <Switch
            size="lg"
            intent="primary"
            checkedContent={<Sun />}
            uncheckedContent={<Moon />}
            defaultChecked
            label="Theme"
          />
          <Switch
            size="lg"
            intent="success"
            checkedContent={<Volume2 />}
            uncheckedContent={<VolumeX />}
            defaultChecked
            label="Sound"
          />
          <Switch
            size="lg"
            intent="warning"
            checkedContent={<Wifi />}
            uncheckedContent={<WifiOff />}
            label="Wi-Fi"
          />
          <Switch
            size="lg"
            intent="danger"
            checkedContent={<Check />}
            uncheckedContent={<X />}
            defaultChecked
            label="Approve"
          />
          <Switch
            size="lg"
            intent="secondary"
            checkedContent={<Eye />}
            uncheckedContent={<EyeOff />}
            label="Visibility"
          />
          <Switch
            size="lg"
            intent="primary"
            checkedContent={<Bell />}
            uncheckedContent={<BellOff />}
            defaultChecked
            label="Alerts"
          />
        </div>
        <CodeExample code={iconsCode} />
      </Section>

      {/* ── Controlled ───────────────────────────────── */}
      <Section title="Controlled">
        <div className="flex items-center gap-4">
          <Switch
            size="lg"
            intent="success"
            checked={checked}
            onCheckedChange={setChecked}
            checkedContent={<Check />}
            uncheckedContent={<X />}
            label={checked ? "Active" : "Inactive"}
          />
          <button
            type="button"
            onClick={() => setChecked((v) => !v)}
            className="rounded border border-primary-300 px-3 py-1 text-sm text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-800"
          >
            Toggle externally
          </button>
        </div>
        <CodeExample code={controlledCode} />
      </Section>

      {/* ── All intents with icons ────────────────────── */}
      <Section title="All intents with icons (medium size)">
        <div className="flex flex-wrap items-center gap-6">
          {(["primary", "secondary", "success", "warning", "danger"] as const).map((intent) => (
            <Switch
              key={intent}
              intent={intent}
              checkedContent={<Check />}
              uncheckedContent={<X />}
              defaultChecked
              label={intent}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
