import { useState } from "react";
import { CinePlayer, type CinePlayerMedia } from "../../src";
import { CodeExample } from "./helpers";

/* ── Sample playlist (free CC0 video clips) ──────────── */
const samplePlaylist: CinePlayerMedia[] = [
  {
    title: "Big Buck Bunny",
    subtitle: "Blender Foundation — Short Film",
    type: "movie",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg",
    duration: 596,
  },
  {
    title: "Elephant Dream",
    subtitle: "Blender Foundation — Open Movie",
    type: "movie",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/220px-Elephants_Dream_s5_both.jpg",
    duration: 653,
  },
  {
    title: "For Bigger Blazes",
    subtitle: "Google Chrome Ad",
    type: "clip",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    duration: 15,
  },
  {
    title: "For Bigger Escapes",
    subtitle: "Google Chrome Ad",
    type: "clip",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    duration: 15,
  },
  {
    title: "Subaru Outback",
    subtitle: "On Street and Dirt",
    type: "ad",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    duration: 15,
  },
  {
    title: "Tears of Steel",
    subtitle: "Blender Foundation — Sci-Fi Short",
    type: "movie",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Tears_of_Steel_poster.jpg/220px-Tears_of_Steel_poster.jpg",
    duration: 734,
  },
];

export default function CinePlayerPage() {
  const [log, setLog] = useState<string[]>([]);
  const [accent, setAccent] = useState("#8b5cf6");

  const ACCENTS = [
    ["#8b5cf6", "Violet"],
    ["#3b82f6", "Blue"],
    ["#10b981", "Emerald"],
    ["#f43f5e", "Rose"],
    ["#f59e0b", "Amber"],
    ["#ec4899", "Pink"],
  ] as const;

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">CinePlayer</h1>
        <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
          A cinematic video player with playlist, shuffle, loop, cinema mode, fullscreen, and
          creative animations.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-mono">
          {[
            ["Space / K", "Play/Pause"],
            ["F", "Fullscreen"],
            ["T", "Cinema mode"],
            ["N / P", "Next / Prev"],
            ["← →", "Seek ±5s"],
            ["↑ ↓", "Volume"],
            ["L", "Playlist"],
          ].map(([key, desc]) => (
            <span
              key={key}
              className="rounded bg-primary-200 px-2 py-0.5 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
            >
              <span className="font-semibold">{key}</span> {desc}
            </span>
          ))}
        </div>

        {/* Accent color picker */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
            Accent:
          </span>
          {ACCENTS.map(([color, name]) => (
            <button
              key={color}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${accent === color ? "border-white scale-110 ring-2 ring-primary-400" : "border-transparent"}`}
              style={{ backgroundColor: color }}
              onClick={() => setAccent(color)}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* ── Player ─────────────────────── */}
      <div className="mx-auto max-w-4xl">
        <CinePlayer
          playlist={samplePlaylist}
          autoPlay={false}
          accent={accent}
          onTrackChange={(idx, m) => addLog(`Track → #${idx + 1} "${m.title}"`)}
          onPlayChange={(p) => addLog(p ? "▶ Playing" : "⏸ Paused")}
        />
      </div>

      {/* ── Usage example ───────────────────────────── */}
      <CodeExample
        code={`<CinePlayer
  playlist={[
    {
      title: "Big Buck Bunny",
      subtitle: "Blender Foundation",
      type: "movie",
      src: "/video/bbb.mp4",
      poster: "/poster/bbb.jpg",
      duration: 596,
    },
  ]}
  autoPlay={false}
  accent="#8b5cf6"
  onTrackChange={(idx, media) => console.log(idx, media.title)}
  onPlayChange={(playing) => console.log(playing ? "Playing" : "Paused")}
/>`}
      />

      {/* ── Event log ───────────────────── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-300">
          Event Log
        </h3>
        <div className="h-32 overflow-y-auto rounded-lg border border-primary-200 bg-primary-50 p-3 font-mono text-xs text-primary-600 dark:border-primary-700 dark:bg-primary-900/50 dark:text-primary-400">
          {log.length === 0 ? (
            <span className="italic opacity-50">Play tracks to see events…</span>
          ) : (
            log.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
