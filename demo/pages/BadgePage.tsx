import { Badge } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { CheckCircle, AlertTriangle, XCircle, Info, Star } from "lucide-react";

const intentsCode = `<Badge intent="success"><CheckCircle /> Success</Badge>
<Badge intent="warning"><AlertTriangle /> Warning</Badge>
<Badge intent="error"><XCircle /> Error</Badge>
<Badge intent="info"><Info /> Info</Badge>
<Badge intent="primary"><Star /> Primary</Badge>`;

const sizesCode = `<Badge size="sm" intent="success"><CheckCircle /> Small</Badge>
<Badge size="md" intent="info"><Info /> Medium</Badge>
<Badge size="lg" intent="warning"><AlertTriangle /> Large</Badge>`;

export default function BadgePage() {
  return (
    <div className="space-y-8">
      <PageTitle>Badge</PageTitle>

      <Section title="Intents">
        <div className="flex flex-wrap gap-3">
          <Badge intent="success">
            <CheckCircle /> Success
          </Badge>
          <Badge intent="warning">
            <AlertTriangle /> Warning
          </Badge>
          <Badge intent="error">
            <XCircle /> Error
          </Badge>
          <Badge intent="info">
            <Info /> Info
          </Badge>
          <Badge intent="primary">
            <Star /> Primary
          </Badge>
        </div>
        <CodeExample code={intentsCode} />
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm" intent="success">
            <CheckCircle /> Small
          </Badge>
          <Badge size="md" intent="info">
            <Info /> Medium (default)
          </Badge>
          <Badge size="lg" intent="warning">
            <AlertTriangle /> Large
          </Badge>
        </div>
        <CodeExample code={sizesCode} />
      </Section>
    </div>
  );
}
