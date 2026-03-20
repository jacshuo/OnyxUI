import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const cinePlayerMediaProps: PropRow[] = [
  { prop: "title", type: "string", required: true, description: "Media title" },
  { prop: "subtitle", type: "string", description: "Subtitle / description" },
  { prop: "type", type: "string", description: "Type label (e.g. 'Movie', 'Episode')" },
  { prop: "src", type: "string", required: true, description: "Video URL" },
  { prop: "poster", type: "string", description: "Poster image URL" },
  { prop: "duration", type: "number", description: "Duration in seconds" },
];

const cinePlayerProps: PropRow[] = [
  { prop: "playlist", type: "CinePlayerMedia[]", required: true, description: "Media list" },
  { prop: "initialTrack", type: "number", default: "0", description: "Starting media index" },
  { prop: "autoPlay", type: "boolean", default: "false", description: "Auto-play on mount" },
  { prop: "shuffle", type: "boolean", default: "false", description: "Shuffle mode" },
  { prop: "loop", type: "boolean", default: "false", description: "Loop playlist" },
  {
    prop: "onTrackChange",
    type: "(index: number, media: CinePlayerMedia) => void",
    description: "Track change callback",
  },
  {
    prop: "onPlayChange",
    type: "(playing: boolean) => void",
    description: "Play / pause callback",
  },
  { prop: "accent", type: "string", description: "Accent color (CSS color value)" },
];

const usageCode = `import { CinePlayer, type CinePlayerMedia } from "@jacshuo/onyx";

const playlist: CinePlayerMedia[] = [
  {
    title: "Big Buck Bunny",
    subtitle: "Short film",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
  },
];

export function Example() {
  return (
    <CinePlayer
      playlist={playlist}
      accent="#8b5cf6"
      onTrackChange={(i, m) => console.log(m.title)}
    />
  );
}`;

export default function CinePlayerDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>CinePlayer</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { CinePlayer, type CinePlayerProps, type CinePlayerMedia } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="CinePlayerMedia">
        <PropTable rows={cinePlayerMediaProps} title="CinePlayerMedia" />
      </Section>

      <Section title="CinePlayer Props">
        <PropTable rows={cinePlayerProps} title="CinePlayer" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
