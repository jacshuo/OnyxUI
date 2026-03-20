import { Label } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const intentsCode = `<Label intent="default">Default label</Label>
<Label intent="muted">Muted label</Label>
<Label intent="required">Required label</Label>`;

const sizesCode = `<Label size="sm">Small</Label>
<Label size="md">Medium</Label>
<Label size="lg">Large</Label>`;

export default function LabelPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Label</PageTitle>

      <Section title="Intents">
        <div className="flex flex-col gap-2">
          <Label intent="default">Default label</Label>
          <Label intent="muted">Muted label</Label>
          <Label intent="required">Required label</Label>
        </div>
        <CodeExample code={intentsCode} />
      </Section>

      <Section title="Sizes">
        <div className="flex flex-col gap-2">
          <Label size="sm">Small</Label>
          <Label size="md">Medium</Label>
          <Label size="lg">Large</Label>
        </div>
        <CodeExample code={sizesCode} />
      </Section>
    </div>
  );
}
