import { Input, Label } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const typesCode = `<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Enter password" />
<Input type="number" placeholder="0" min={0} max={100} />
<Input type="search" placeholder="Search…" />
<Input type="date" />
<Input type="time" />`;

const errorCode = `<Input state="error" placeholder="Enter username" defaultValue="ab" />
// Available states: "default" | "error" | "success" | "warning"`;

const sizesCode = `<Input inputSize="sm" placeholder="Small input" />
<Input inputSize="md" placeholder="Medium input (default)" />
<Input inputSize="lg" placeholder="Large input" />`;

const prefixCode = `<Input
  prefix={<><Globe /> https://&lt;/&gt;}
  type="url"
  placeholder="example.com"
/>
<Input prefix={<DollarSign />} type="number" placeholder="0.00" />`;

const suffixCode = `<Input suffix={<Search />} type="search" placeholder="Search…" />
<Input suffix={<Eye />} type="password" placeholder="Password" />`;

const actionCode = `<Input
  action={{
    icon: <Search />,
    onClick: () => handleSearch(),
    "aria-label": "Search",
  }}
  type="search"
  placeholder="Type and click search…"
/>`;
import {
  Mail,
  User,
  Search,
  Send,
  Link,
  Globe,
  DollarSign,
  ArrowRight,
  Eye,
  Lock,
  Hash,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";

export default function InputPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Input</PageTitle>

      <Section title="Input Types">
        <div className="max-w-sm space-y-3">
          <div className="space-y-1">
            <Label>
              <Mail /> Email
            </Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1">
            <Label>
              <Lock /> Password
            </Label>
            <Input type="password" placeholder="Enter password" />
          </div>
          <div className="space-y-1">
            <Label>
              <Hash /> Number
            </Label>
            <Input type="number" placeholder="0" min={0} max={100} />
          </div>
          <div className="space-y-1">
            <Label>
              <Phone /> Telephone
            </Label>
            <Input type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-1">
            <Label>
              <Globe /> URL
            </Label>
            <Input type="url" placeholder="https://example.com" />
          </div>
          <div className="space-y-1">
            <Label>
              <Search /> Search
            </Label>
            <Input type="search" placeholder="Search…" />
          </div>
          <div className="space-y-1">
            <Label>
              <Calendar /> Date
            </Label>
            <Input type="date" />
          </div>
          <div className="space-y-1">
            <Label>
              <Clock /> Time
            </Label>
            <Input type="time" />
          </div>
        </div>
        <CodeExample code={typesCode} />
      </Section>

      <Section title="Error state">
        <div className="max-w-sm space-y-2">
          <Label intent="required">
            <User /> Username
          </Label>
          <Input state="error" placeholder="Enter username" defaultValue="ab" />
          <Label intent="muted" size="sm" className="text-red-500">
            Minimum 3 characters.
          </Label>
        </div>
        <CodeExample code={errorCode} />
      </Section>

      <Section title="Sizes">
        <div className="max-w-sm space-y-3">
          <Input inputSize="sm" type="email" placeholder="Small email input" />
          <Input inputSize="md" type="email" placeholder="Medium email input" />
          <Input inputSize="lg" type="email" placeholder="Large email input" />
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Prefix — highlighted label / icon">
        <div className="max-w-md space-y-3">
          <Input
            prefix={
              <>
                <Globe /> https://
              </>
            }
            type="url"
            placeholder="example.com"
          />
          <Input
            prefix={
              <>
                <Mail /> Email
              </>
            }
            type="email"
            placeholder="you@example.com"
          />
          <Input prefix={<DollarSign />} type="number" placeholder="0.00" step="0.01" />
          <Input
            prefix={
              <>
                <Link /> URL
              </>
            }
            type="url"
            placeholder="paste a link…"
            inputSize="lg"
          />
        </div>
        <CodeExample code={prefixCode} />
      </Section>

      <Section title="Suffix — decorative icon">
        <div className="max-w-md space-y-3">
          <Input suffix={<Search />} type="search" placeholder="Search…" />
          <Input suffix={<Eye />} type="password" placeholder="Password" />
        </div>
        <CodeExample code={suffixCode} />
      </Section>

      <Section title="Action — clickable icon button">
        <div className="max-w-md space-y-3">
          <Input
            action={{
              icon: <Search />,
              onClick: () => alert("Search triggered!"),
              "aria-label": "Search",
            }}
            type="search"
            placeholder="Type and click search…"
          />
          <Input
            action={{
              icon: <Send />,
              onClick: () => alert("Message sent!"),
              "aria-label": "Send message",
            }}
            placeholder="Type a message…"
          />
          <Input
            action={{
              icon: <ArrowRight />,
              onClick: () => alert("Go!"),
              "aria-label": "Go",
            }}
            type="url"
            placeholder="Enter URL and go…"
            prefix={<Globe />}
          />
        </div>
        <CodeExample code={actionCode} />
      </Section>
    </div>
  );
}
