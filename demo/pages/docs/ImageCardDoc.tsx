import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const imageCardProps: PropRow[] = [
  { prop: "src", type: "string", required: true, description: "Image URL" },
  { prop: "alt", type: "string", description: "Image alt text for accessibility" },
  {
    prop: "aspectRatio",
    type: "string",
    default: `"16/9"`,
    description: "CSS aspect-ratio for the image",
  },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLDivElement>",
    description: "All native div attributes",
  },
];

const usageCode = `import {
  ImageCard,
  ImageCardBody,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardActions,
  Button,
} from "@jacshuo/onyx";

export function Example() {
  return (
    <ImageCard src="https://picsum.photos/400/225" alt="Demo" aspectRatio="16/9">
      <ImageCardBody>
        <ImageCardTitle>Photo title</ImageCardTitle>
        <ImageCardDescription>Short description of the image.</ImageCardDescription>
        <ImageCardActions>
          <Button size="sm" intent="ghost">View</Button>
        </ImageCardActions>
      </ImageCardBody>
    </ImageCard>
  );
}`;

export default function ImageCardDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>ImageCard</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  ImageCard, ImageCardBody, ImageCardTitle,
  ImageCardDescription, ImageCardActions,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="ImageCard Props">
        <PropTable rows={imageCardProps} title="ImageCard" />
      </Section>

      <Section title="Sub-components">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          ImageCardBody, ImageCardTitle, ImageCardDescription, ImageCardActions — all pass through
          HTMLAttributes&lt;HTMLDivElement&gt;.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
