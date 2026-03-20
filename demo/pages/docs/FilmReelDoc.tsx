import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const filmReelPhotoProps: PropRow[] = [
  { prop: "src", type: "string", required: true, description: "Image URL" },
  { prop: "alt", type: "string", description: "Alt text for accessibility" },
  { prop: "title", type: "string", description: "Photo title" },
  { prop: "description", type: "string", description: "Photo description" },
  {
    prop: "metadata",
    type: "{ camera?: string; lens?: string; aperture?: string; shutter?: string; iso?: string; date?: string; location?: string; [key: string]: string }",
    description: "EXIF-style metadata object",
  },
];

const filmReelActionProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique key" },
  { prop: "icon", type: "React.ReactNode", required: true, description: "Default icon element" },
  {
    prop: "activeIcon",
    type: "React.ReactNode",
    description: "Icon shown when the action is toggled active",
  },
  { prop: "label", type: "string", required: true, description: "Accessible label" },
  { prop: "toggle", type: "boolean", description: "Whether this is a toggle action" },
];

const filmReelProps: PropRow[] = [
  {
    prop: "photos",
    type: "FilmReelPhoto[]",
    required: true,
    description: "Array of photos to display",
  },
  {
    prop: "layout",
    type: `"strip" | "sheet" | "stack"`,
    default: `"strip"`,
    description: "Display layout mode",
  },
  { prop: "actions", type: "FilmReelAction[]", description: "Per-photo action buttons" },
  {
    prop: "onAction",
    type: "(action: FilmReelAction, photo: FilmReelPhoto, index: number) => void",
    description: "Action callback",
  },
  {
    prop: "showGrain",
    type: "boolean",
    default: "true",
    description: "Film grain texture overlay",
  },
  { prop: "sheetTitle", type: "string", description: "Title shown in sheet layout" },
  { prop: "sheetLabel", type: "string", description: "Label shown in sheet layout" },
];

const usageCode = `import { FilmReel, type FilmReelPhoto } from "@jacshuo/onyx";
import { Heart } from "lucide-react";

const photos: FilmReelPhoto[] = [
  {
    src: "https://picsum.photos/400/300",
    title: "Sunset",
    description: "Golden hour",
    metadata: { camera: "Sony A7IV", iso: "400" },
  },
  {
    src: "https://picsum.photos/400/301",
    title: "Forest",
    description: "Morning light",
  },
];

export function Example() {
  return (
    <FilmReel
      photos={photos}
      layout="strip"
      showGrain
      actions={[
        { key: "like", icon: <Heart size={16} />, label: "Like", toggle: true },
      ]}
      onAction={(action, photo) => console.log(action.key, photo.title)}
    />
  );
}`;

export default function FilmReelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>FilmReel</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { FilmReel, type FilmReelProps, type FilmReelPhoto } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="FilmReelPhoto">
        <PropTable rows={filmReelPhotoProps} title="FilmReelPhoto" />
      </Section>

      <Section title="FilmReelAction">
        <PropTable rows={filmReelActionProps} title="FilmReelAction" />
      </Section>

      <Section title="FilmReel Props">
        <PropTable rows={filmReelProps} title="FilmReel" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
