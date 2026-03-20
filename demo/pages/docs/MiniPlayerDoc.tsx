import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const miniPlayerTrackProps: PropRow[] = [
  { prop: "title", type: "string", required: true, description: "Track title" },
  { prop: "artist", type: "string", description: "Artist name" },
  { prop: "album", type: "string", description: "Album name" },
  { prop: "src", type: "string", required: true, description: "Audio URL" },
  { prop: "cover", type: "string", description: "Cover art URL" },
  { prop: "duration", type: "number", description: "Duration in seconds" },
];

const miniPlayerProps: PropRow[] = [
  { prop: "playlist", type: "MiniPlayerTrack[]", required: true, description: "Track list" },
  { prop: "initialTrack", type: "number", default: "0", description: "Starting track index" },
  {
    prop: "position",
    type: `"bottom-right" | "bottom-left" | "top-right" | "top-left"`,
    default: `"bottom-right"`,
    description: "Screen position",
  },
  {
    prop: "entrance",
    type: `"bottom" | "top" | "left" | "right"`,
    default: `"bottom"`,
    description: "Slide-in direction",
  },
  { prop: "theme", type: `"dark" | "light"`, default: `"dark"`, description: "Player color theme" },
  { prop: "docked", type: "boolean", default: "false", description: "Dock to screen edge" },
  { prop: "visible", type: "boolean", default: "true", description: "Controlled visibility" },
  {
    prop: "onVisibleChange",
    type: "(visible: boolean) => void",
    description: "Visibility change callback",
  },
  {
    prop: "onTrackChange",
    type: "(index: number, track: MiniPlayerTrack) => void",
    description: "Track change callback",
  },
  {
    prop: "onLike",
    type: "(index: number, track: MiniPlayerTrack, liked: boolean) => void",
    description: "Like callback",
  },
  { prop: "autoPlay", type: "boolean", default: "false", description: "Auto-play on mount" },
  { prop: "shuffle", type: "boolean", default: "false", description: "Shuffle mode" },
  { prop: "loop", type: "boolean", default: "false", description: "Loop playlist" },
  { prop: "accent", type: "string", description: "Accent color (CSS color value)" },
];

const usageCode = `import { MiniPlayer, type MiniPlayerTrack } from "@jacshuo/onyx";

const playlist: MiniPlayerTrack[] = [
  {
    title: "Midnight Drive",
    artist: "Lo-Fi Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/80",
  },
  {
    title: "Chill Afternoon",
    artist: "Ambient Waves",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
];

export function Example() {
  return (
    <MiniPlayer
      playlist={playlist}
      position="bottom-right"
      theme="dark"
      accent="#6366f1"
    />
  );
}`;

export default function MiniPlayerDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>MiniPlayer</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { MiniPlayer, type MiniPlayerProps, type MiniPlayerTrack } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="MiniPlayerTrack">
        <PropTable rows={miniPlayerTrackProps} title="MiniPlayerTrack" />
      </Section>

      <Section title="MiniPlayer Props">
        <PropTable rows={miniPlayerProps} title="MiniPlayer" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
