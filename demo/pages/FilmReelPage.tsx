import { useState } from "react";
import { FilmReel, type FilmReelPhoto } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const stripCode = `<FilmReel photos={photos} layout="strip" onAction={handleAction} />`;

const sheetCode = `<FilmReel
  photos={photos}
  layout="sheet"
  onAction={handleAction}
  sheetTitle="Landscapes Collection · 10 frames"
  sheetLabel="Proof Sheet №1"
/>`;

const stackCode = `<FilmReel photos={photos} layout="stack" onAction={handleAction} />`;

const photos: FilmReelPhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&h=600&fit=crop",
    title: "Yosemite Dawn",
    alt: "Yosemite valley at dawn",
    description:
      "The valley was still asleep when the first light crept over the granite walls. I held my breath — afraid even the shutter click would break the silence.",
    metadata: {
      camera: "Sony A7R IV",
      lens: "24-70mm f/2.8 GM",
      aperture: "f/8",
      shutter: "1/125s",
      iso: "100",
      date: "Jan 2026",
      location: "Yosemite, California",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&h=600&fit=crop",
    title: "Misty Forest",
    alt: "Foggy forest at sunrise",
    description:
      "Every morning the fog writes a different story through these old-growth trees. This was a quiet Tuesday — just me and the ferns.",
    metadata: {
      camera: "Fujifilm X-T5",
      lens: "56mm f/1.2",
      aperture: "f/2.8",
      shutter: "1/250s",
      iso: "400",
      date: "Feb 2026",
      location: "Olympic National Park, WA",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&h=600&fit=crop",
    title: "Alpine Lake",
    alt: "Crystal clear alpine lake",
    description:
      "The water was so still you could not tell where the mountain ended and the reflection began.",
    metadata: {
      camera: "Nikon Z8",
      lens: "14-24mm f/2.8",
      aperture: "f/11",
      shutter: "1/60s",
      iso: "200",
      date: "Mar 2026",
      location: "Swiss Alps",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=900&h=600&fit=crop",
    title: "Golden Fields",
    alt: "Sunset over golden wheat fields",
    description:
      "An old farmer told me: come back at golden hour and the land will sing. He was right.",
    metadata: {
      camera: "Canon EOS R5",
      lens: "85mm f/1.4L",
      aperture: "f/2.0",
      shutter: "1/500s",
      iso: "100",
      date: "Feb 2026",
      location: "Tuscany, Italy",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop",
    title: "Coastal Sunset",
    alt: "Tropical beach at sunset",
    metadata: {
      camera: "Sony A7III",
      lens: "35mm f/1.4 GM",
      aperture: "f/5.6",
      shutter: "1/200s",
      iso: "100",
      date: "Jan 2026",
      location: "Malibu, California",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=600&fit=crop",
    title: "Urban Twilight",
    alt: "City skyline at dusk",
    description:
      "Ten million lives pulsing behind glass and steel. From up here, every lit window is somebody's story.",
    metadata: {
      camera: "Leica Q3",
      lens: "28mm f/1.7",
      aperture: "f/4",
      shutter: "1/30s",
      iso: "800",
      date: "Mar 2026",
      location: "Tokyo, Japan",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=600&fit=crop",
    title: "Mountain Peaks",
    alt: "Dramatic mountain peaks",
    description:
      "The Dolomites do not care about your schedule. You wait for the light, or you miss it.",
    metadata: {
      camera: "Nikon Z9",
      lens: "70-200mm f/2.8",
      aperture: "f/8",
      shutter: "1/640s",
      iso: "200",
      date: "Feb 2026",
      location: "Dolomites, Italy",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=900&h=600&fit=crop",
    title: "Hidden Falls",
    alt: "Waterfall in lush forest",
    description:
      "Half a second of exposure turned the cascade into silk. Some things are only visible when you slow down.",
    metadata: {
      camera: "Fujifilm GFX 100S",
      lens: "32-64mm f/4",
      aperture: "f/11",
      shutter: "0.5s",
      iso: "100",
      date: "Mar 2026",
      location: "Costa Rica",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=900&h=600&fit=crop",
    title: "Pacific Horizon",
    alt: "Ocean waves at golden hour",
    metadata: {
      camera: "Sony A1",
      lens: "16-35mm f/2.8 GM",
      aperture: "f/8",
      shutter: "1/400s",
      iso: "100",
      date: "Jan 2026",
      location: "Big Sur, California",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=900&h=600&fit=crop",
    title: "Northern Ridge",
    alt: "Mountain ridge in dramatic light",
    description:
      "Lofoten in February — four hours of golden hour. The Arctic does not do ordinary light.",
    metadata: {
      camera: "Hasselblad X2D",
      lens: "90mm f/2.5",
      aperture: "f/5.6",
      shutter: "1/250s",
      iso: "100",
      date: "Feb 2026",
      location: "Lofoten, Norway",
    },
  },
];

export default function FilmReelPage() {
  const [actionLog, setActionLog] = useState<string[]>([]);

  const handleAction = (action: string, photo: FilmReelPhoto) => {
    setActionLog((prev) => [`${action}: ${photo.title}`, ...prev].slice(0, 5));
  };

  return (
    <div className="space-y-10">
      <PageTitle>FilmReel</PageTitle>

      <Section title="Film Strip">
        <p className="text-primary-500 dark:text-primary-400 mb-3 text-sm">
          Scroll horizontally through the strip. Click any frame to open the lightbox. Use scroll
          wheel to zoom, drag to pan, press{" "}
          <kbd className="rounded bg-primary-200 px-1 py-0.5 text-xs dark:bg-primary-700">I</kbd>{" "}
          for photo info.
        </p>
        <FilmReel photos={photos} layout="strip" onAction={handleAction} className="mx-auto" />
        <CodeExample code={stripCode} />
      </Section>

      <Section title="Contact Sheet">
        <p className="text-primary-500 dark:text-primary-400 mb-3 text-sm">
          Classic darkroom contact sheet — hover for title, click to view.
        </p>
        <FilmReel
          photos={photos}
          layout="sheet"
          onAction={handleAction}
          sheetTitle="Landscapes Collection · 10 frames"
          sheetLabel="Proof Sheet №1"
        />{" "}
        <CodeExample code={sheetCode} />{" "}
      </Section>

      <Section title="Photo Stack">
        <p className="text-primary-500 dark:text-primary-400 mb-3 text-sm">
          Hover over the pile to fan out the photos. Click any to view.
        </p>
        <FilmReel photos={photos} layout="stack" onAction={handleAction} />
        <CodeExample code={stackCode} />
      </Section>

      {actionLog.length > 0 && (
        <Section title="Action Log">
          <ul className="space-y-1 font-mono text-xs text-primary-500 dark:text-primary-400">
            {actionLog.map((entry, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                {entry}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
