import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const cardProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "primary" | "danger"`,
    default: `"default"`,
    description: "Border and shadow color intent",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Padding size" },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLDivElement>",
    description: "All native div attributes",
  },
];

const horizontalCardProps: PropRow[] = [
  {
    prop: "media",
    type: "{ src: string; alt?: string; width?: number; height?: number; objectFit?: string }",
    required: true,
    description: "Media configuration object",
  },
  {
    prop: "mediaPosition",
    type: `"left" | "right"`,
    default: `"left"`,
    description: "Position of the media relative to content",
  },
  {
    prop: "stackOnMobile",
    type: "boolean",
    default: "true",
    description: "Stack vertically on small screens",
  },
];

const usageCode = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@jacshuo/onyx";

export function Example() {
  return (
    <Card intent="primary" size="md">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Optional description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  );
}`;

const horizontalUsageCode = `import { HorizontalCard, CardContent, CardTitle } from "@jacshuo/onyx";

export function Example() {
  return (
    <HorizontalCard
      media={{ src: "https://picsum.photos/300/200", alt: "Demo image" }}
      mediaPosition="left"
    >
      <CardContent>
        <CardTitle>HorizontalCard</CardTitle>
        <p>Media on the left, content on the right.</p>
      </CardContent>
    </HorizontalCard>
  );
}`;

const subComponentNote =
  "CardHeader, CardTitle, CardDescription, CardContent, CardFooter — all pass through HTMLAttributes<HTMLDivElement>.";

export default function CardDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Card</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, HorizontalCard,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Card Props">
        <PropTable rows={cardProps} title="Card" />
      </Section>

      <Section title="Sub-components">
        <p className="text-sm text-primary-600 dark:text-primary-400">{subComponentNote}</p>
      </Section>

      <Section title="HorizontalCard Props">
        <PropTable rows={horizontalCardProps} title="HorizontalCard" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="HorizontalCard Usage">
        <CodeExample code={horizontalUsageCode} />
      </Section>
    </div>
  );
}
