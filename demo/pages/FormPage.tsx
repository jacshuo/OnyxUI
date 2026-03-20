import { useState } from "react";
import { Form, FormItem, FormSection, Input, Button, Dropdown, Switch, TextBox } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

/* ── Code snippets ──────────────────────────────────────── */

const stackedCode = `<Form>
  <FormItem label="Username" required>
    <Input placeholder="john_doe" />
  </FormItem>
  <FormItem label="Email" required>
    <Input type="email" placeholder="you@example.com" />
  </FormItem>
  <FormItem label="Website" hint="Include https://">
    <Input type="url" placeholder="https://example.com" />
  </FormItem>
</Form>`;

const inlineCode = `<Form layout="inline">
  <FormItem label="First name" required>
    <Input placeholder="Jane" />
  </FormItem>
  <FormItem label="Last name">
    <Input placeholder="Doe" />
  </FormItem>
  <FormItem label="Role">
    <Dropdown options={roleOptions} placeholder="Select a role…" />
  </FormItem>
  <FormItem label="Bio" hint="Max 200 characters">
    <TextBox placeholder="Tell us about yourself…" rows={3} />
  </FormItem>
  <FormItem label="Notifications">
    <Switch label="Receive email notifications" />
  </FormItem>
</Form>`;

const validationCode = `<FormItem
  label="Username"
  required
  validation={{ status: "error", message: "Username is already taken." }}
>
  <Input defaultValue="taken_user" readOnly state="error" />
</FormItem>
<FormItem
  label="Email"
  validation={{ status: "success", message: "Email address is available." }}
>
  <Input type="email" defaultValue="jane@example.com" readOnly />
</FormItem>`;

const sizesCode = `<Form size="sm" layout="inline">
  <FormItem label="Name" required><Input placeholder="Jane Doe" inputSize="sm" /></FormItem>
</Form>
// Available sizes: "sm" | "md" | "lg"`;

const cardCode = `<Form
  intent="card"
  title="Account settings"
  description="Update your account information."
  footer={
    <>
      <Button intent="ghost" type="reset">Cancel</Button>
      <Button type="submit">Save</Button>
    </>
  }
>
  <FormItem label="Display name" required>
    <Input placeholder="Your display name" />
  </FormItem>
</Form>`;

const insetCode = `<Form intent="inset" title="Preferences" layout="inline">
  <FormItem label="Notifications">
    <Switch label="Email notifications" />
  </FormItem>
</Form>`;

const formSectionCode = `<Form title="User profile">
  <FormSection title="Personal information" description="Required">
    <FormItem label="Full name" required><Input placeholder="Jane Doe" /></FormItem>
    <FormItem label="Email" required><Input type="email" placeholder="jane@example.com" /></FormItem>
  </FormSection>
  <FormSection title="Account settings">
    <FormItem label="Username"><Input placeholder="jane_doe" /></FormItem>
  </FormSection>
</Form>`;

const responsiveCode = `{/* layout="inline" stacks on mobile (< md), side-by-side on larger screens */}
<Form layout="inline" intent="card">
  <FormItem label="City" required><Input placeholder="San Francisco" /></FormItem>
  <FormItem label="State"><Input placeholder="CA" /></FormItem>
  <FormItem label="Postal code"><Input placeholder="94105" /></FormItem>
</Form>`;

const onValuesCode = `<Form
  intent="card"
  onValues={async (values, e) => {
    e.preventDefault();
    const errors = {};
    if (values.username === "admin")
      errors.username = { result: false, reason: "Already taken." };
    if (Object.keys(errors).length) return errors;
  }}
  footer={<Button type="submit">Submit</Button>}
>
  <FormItem label="Username" name="username" required>
    <Input placeholder="Try 'admin'" />
  </FormItem>
</Form>`;

const onValidateCode = `<FormItem
  label="Email"
  required
  onValidate={(val) => {
    const v = String(val ?? "");
    if (!v) return { result: false, reason: "Email is required." };
    return /^[^@]+@[^@]+\\.[^@]+$/.test(v)
      ? { result: true, reason: "Valid email." }
      : { result: false, reason: "Enter a valid email address." };
  }}
>
  <Input type="email" placeholder="jane@example.com" />
</FormItem>`;

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function FormPage() {
  const [submittedValues, setSubmittedValues] = useState<Record<string, string> | null>(null);

  return (
    <div className="space-y-10">
      <PageTitle>Form / FormItem</PageTitle>

      {/* ── Stacked layout (default) ───────────────────────── */}
      <Section title="Stacked layout (default)">
        <div className="max-w-2xl">
          <Form>
            <FormItem label="Username" required>
              <Input placeholder="john_doe" />
            </FormItem>
            <FormItem label="Email" required>
              <Input type="email" placeholder="you@example.com" />
            </FormItem>
            <FormItem label="Website" hint="Include https://">
              <Input type="url" placeholder="https://example.com" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={stackedCode} />
      </Section>

      {/* ── Inline layout ─────────────────────────────────── */}
      <Section title="Inline layout (label column)">
        <div className="max-w-2xl">
          <Form layout="inline">
            <FormItem label="First name" required>
              <Input placeholder="Jane" />
            </FormItem>
            <FormItem label="Last name">
              <Input placeholder="Doe" />
            </FormItem>
            <FormItem label="Role">
              <Dropdown options={roleOptions} placeholder="Select a role…" />
            </FormItem>
            <FormItem label="Bio" hint="Max 200 characters">
              <TextBox placeholder="Tell us about yourself…" rows={3} />
            </FormItem>
            <FormItem label="Notifications">
              <div className="pt-1">
                <Switch label="Receive email notifications" />
              </div>
            </FormItem>
          </Form>
        </div>
        <CodeExample code={inlineCode} />
      </Section>

      {/* ── Validation states ──────────────────────────────── */}
      <Section title="Validation states">
        <div className="max-w-2xl">
          <Form>
            <FormItem
              label="Username"
              required
              validation={{ status: "error", message: "Username is already taken." }}
            >
              <Input defaultValue="taken_user" readOnly state="error" />
            </FormItem>
            <FormItem
              label="Password"
              required
              validation={{ status: "warning", message: "Weak password — add symbols or numbers." }}
            >
              <Input type="password" defaultValue="password" readOnly />
            </FormItem>
            <FormItem
              label="Email"
              validation={{ status: "success", message: "Email address is available." }}
            >
              <Input type="email" defaultValue="jane@example.com" readOnly />
            </FormItem>
            <FormItem label="Website" hint="We'll display this on your public profile.">
              <Input type="url" placeholder="https://example.com" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={validationCode} />
      </Section>

      {/* ── Size variants ─────────────────────────────────── */}
      <Section title="Size variants">
        <div className="max-w-2xl space-y-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="mb-2 text-xs text-primary-400 uppercase tracking-wide font-medium">
                size=&quot;{size}&quot;
              </p>
              <Form size={size} layout="inline">
                <FormItem label="Name" required>
                  <Input placeholder="Jane Doe" inputSize={size} />
                </FormItem>
                <FormItem label="Email">
                  <Input type="email" placeholder="jane@example.com" inputSize={size} />
                </FormItem>
              </Form>
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      {/* ── Card intent ───────────────────────────────────── */}
      <Section title="Card intent">
        <div className="max-w-2xl">
          <Form
            intent="card"
            title="Account settings"
            description="Update your account information below."
            footer={
              <>
                <Button intent="ghost" type="reset">
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </>
            }
          >
            <FormItem label="Display name" required>
              <Input placeholder="Your display name" />
            </FormItem>
            <FormItem label="Email" required>
              <Input type="email" placeholder="you@example.com" />
            </FormItem>
            <FormItem label="New password" hint="Leave blank to keep your current password.">
              <Input type="password" placeholder="••••••••" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={cardCode} />
      </Section>

      {/* ── Inset intent ──────────────────────────────────── */}
      <Section title="Inset intent">
        <div className="max-w-2xl">
          <Form intent="inset" title="Preferences" layout="inline">
            <FormItem label="Notifications">
              <div className="pt-1">
                <Switch label="Email notifications" />
              </div>
            </FormItem>
            <FormItem label="Theme">
              <Dropdown options={themeOptions} placeholder="Choose theme…" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={insetCode} />
      </Section>

      {/* ── FormSection grouping ──────────────────────────── */}
      <Section title="FormSection grouping">
        <div className="max-w-2xl">
          <Form
            title="User profile"
            description="Complete your profile to get started."
            footer={
              <>
                <Button intent="ghost" type="reset">
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </>
            }
          >
            <FormSection title="Personal information" description="Required">
              <FormItem label="Full name" required>
                <Input placeholder="Jane Doe" />
              </FormItem>
              <FormItem label="Email" required>
                <Input type="email" placeholder="jane@example.com" />
              </FormItem>
              <FormItem label="Phone" hint="Include country code.">
                <Input type="tel" placeholder="+1 555 000 0000" />
              </FormItem>
            </FormSection>
            <FormSection title="Account settings">
              <FormItem label="Username" required>
                <Input placeholder="jane_doe" />
              </FormItem>
              <FormItem label="Role">
                <Dropdown options={roleOptions} placeholder="Select a role…" />
              </FormItem>
              <FormItem label="Bio" hint="Max 200 characters">
                <TextBox placeholder="Tell us about yourself…" rows={3} />
              </FormItem>
            </FormSection>
            <FormSection title="Notifications">
              <FormItem label="Email alerts">
                <div className="pt-1">
                  <Switch label="Send me email notifications" />
                </div>
              </FormItem>
            </FormSection>
          </Form>
        </div>
        <CodeExample code={formSectionCode} />
      </Section>

      {/* ── Responsive behavior ───────────────────────────── */}
      <Section title="Responsive behavior">
        <p className="max-w-2xl text-sm text-primary-500 dark:text-primary-400">
          <code className="text-primary-700 dark:text-primary-300">layout=&quot;inline&quot;</code>{" "}
          automatically stacks on small viewports (below{" "}
          <code className="text-primary-700 dark:text-primary-300">md</code>) and switches to a
          fixed-width label column on wider screens.
        </p>
        <div className="max-w-2xl">
          <Form layout="inline" intent="card">
            <FormItem label="City" required>
              <Input placeholder="San Francisco" />
            </FormItem>
            <FormItem label="State">
              <Input placeholder="CA" />
            </FormItem>
            <FormItem label="Postal code">
              <Input placeholder="94105" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={responsiveCode} />
      </Section>

      {/* ── onValues — FormData collection + async validation */}
      <Section title="onValues — collect FormData + async bulk validation">
        <div className="max-w-2xl">
          <Form
            intent="card"
            title="Sign up"
            description="Username 'admin' and email 'taken@example.com' are simulated as taken."
            onValues={async (values, e) => {
              e.preventDefault();
              setSubmittedValues(values as Record<string, string>);
              await new Promise((r) => setTimeout(r, 600));
              const errors: Record<string, { result: boolean; reason: string }> = {};
              if (String(values.username) === "admin")
                errors.username = { result: false, reason: "Username 'admin' is already taken." };
              if (String(values.email) === "taken@example.com")
                errors.email = { result: false, reason: "This email is already registered." };
              if (Object.keys(errors).length) return errors;
            }}
            footer={
              <>
                <Button intent="ghost" type="reset" onClick={() => setSubmittedValues(null)}>
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </>
            }
          >
            <FormItem label="Username" name="username" required>
              <Input placeholder="Try 'admin'" />
            </FormItem>
            <FormItem label="Email" name="email" required>
              <Input type="email" placeholder="Try 'taken@example.com'" />
            </FormItem>
            <FormItem label="Role" name="role">
              <Dropdown options={roleOptions} placeholder="Select a role…" />
            </FormItem>
          </Form>
          {submittedValues && (
            <pre className="mt-3 rounded-md bg-primary-50 p-3 text-xs text-primary-700 dark:bg-primary-800 dark:text-primary-200">
              {JSON.stringify(submittedValues, null, 2)}
            </pre>
          )}
        </div>
        <CodeExample code={onValuesCode} />
      </Section>

      {/* ── onValidate — inline field validation ───────────── */}
      <Section title="onValidate — inline validation callback">
        <div className="max-w-2xl">
          <Form>
            <FormItem
              label="Username"
              required
              hint="3–20 characters, letters and numbers only."
              onValidate={(val) => {
                const v = String(val ?? "");
                if (!v) return { result: false, reason: "Username is required." };
                if (v.length < 3) return { result: false, reason: "Too short — min 3 characters." };
                if (!/^[a-z0-9_]+$/i.test(v))
                  return { result: false, reason: "Only letters, numbers and _ allowed." };
                return { result: true, reason: "Looks good!" };
              }}
            >
              <Input placeholder="jane_doe" />
            </FormItem>
            <FormItem
              label="Email"
              required
              onValidate={(val) => {
                const v = String(val ?? "");
                if (!v) return { result: false, reason: "Email is required." };
                return /^[^@]+@[^@]+\.[^@]+$/.test(v)
                  ? { result: true, reason: "Valid email address." }
                  : { result: false, reason: "Enter a valid email address." };
              }}
            >
              <Input type="email" placeholder="jane@example.com" />
            </FormItem>
            <FormItem
              label="Password"
              required
              onValidate={(val) => {
                const v = String(val ?? "");
                if (v.length < 8)
                  return { result: false, reason: "Minimum 8 characters required." };
                if (!/[0-9]/.test(v))
                  return { result: false, reason: "Must contain at least one number." };
                return { result: true, reason: "Strong password!" };
              }}
            >
              <Input type="password" placeholder="••••••••" />
            </FormItem>
          </Form>
        </div>
        <CodeExample code={onValidateCode} />
      </Section>
    </div>
  );
}
