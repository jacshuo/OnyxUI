import { Panel, PanelHeader, PanelContent } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Layout, Layers, ArrowUpCircle } from "lucide-react";

const defaultCode = `<Panel>
  <PanelHeader><Layout /> Default Panel</PanelHeader>
  <PanelContent>Panel body content goes here.</PanelContent>
</Panel>`;

const insetCode = `<Panel intent="inset">
  <PanelHeader><Layers /> Inset Panel</PanelHeader>
  <PanelContent>Subtle background, no border.</PanelContent>
</Panel>`;

const elevatedCode = `<Panel intent="elevated">
  <PanelHeader><ArrowUpCircle /> Elevated Panel</PanelHeader>
  <PanelContent>Shadow-based prominence.</PanelContent>
</Panel>`;

export default function PanelPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Panel</PageTitle>

      <Section title="Default">
        <Panel>
          <PanelHeader>
            <Layout /> Default Panel
          </PanelHeader>
          <PanelContent>Panel body content goes here.</PanelContent>
        </Panel>
        <CodeExample code={defaultCode} />
      </Section>

      <Section title="Inset">
        <Panel intent="inset">
          <PanelHeader>
            <Layers /> Inset Panel
          </PanelHeader>
          <PanelContent>Subtle background, no border.</PanelContent>
        </Panel>
        <CodeExample code={insetCode} />
      </Section>

      <Section title="Elevated">
        <Panel intent="elevated">
          <PanelHeader>
            <ArrowUpCircle /> Elevated Panel
          </PanelHeader>
          <PanelContent>Shadow-based prominence.</PanelContent>
        </Panel>
        <CodeExample code={elevatedCode} />
      </Section>
    </div>
  );
}
