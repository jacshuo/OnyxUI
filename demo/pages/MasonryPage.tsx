import type { MasonryItemData } from "../../src";
import { Masonry, Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const waterfallCode = `{/* responsive: auto-calculates columns from columnWidth */}
<Masonry columnWidth={220} gap={12} items={imageItems} onItemClick={handleClick} />`;

const cardWaterfallCode = `{/* fixed column count via columns prop — children API */}
<Masonry columns={3} gap={16} onItemClick={(_, i) => console.log(i)}>
  {cards.map((c, i) => (
    <Card key={i}>
      <CardHeader><CardTitle>{c.title}</CardTitle></CardHeader>
      <CardContent>{c.body}</CardContent>
    </Card>
  ))}
</Masonry>`;

const mixedCode = `<Masonry columnWidth={200} gap={20} items={mixedItems} onItemClick={handleClick} />`;

const singleColCode = `<Masonry columns={1} gap={12}>
  {cards.map((c, i) => <Card key={i}>…</Card>)}
</Masonry>`;

/* ── Sample data ─────────────────────────────────────── */

// picsum.photos serves CORS-friendly placeholder images; /id/N/W/H gives a specific photo at exact dimensions.
// Mix of landscape, square-ish, and tall 9:16 portrait images for a realistic waterfall.
const imageItems: MasonryItemData[] = [
  {
    content: (
      <img
        src="https://picsum.photos/id/10/400/260"
        alt="Photo 1"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Misty Forest",
    description: "A walk through the morning fog",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/11/400/200"
        alt="Photo 2"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Dark Leaves",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/12/400/711"
        alt="Photo 3"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Mountain Waterfall",
    description: "9:16 portrait shot",
    actions: (
      <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
        Save
      </button>
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/13/400/180"
        alt="Photo 4"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/14/400/240"
        alt="Photo 5"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Bridge at Dusk",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/15/400/300"
        alt="Photo 6"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "River Stones",
    description: "Smooth pebbles in the stream",
    actions: (
      <>
        <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
          Like
        </button>
        <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
          Share
        </button>
      </>
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/16/400/711"
        alt="Photo 7"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Stacked Books",
    description: "9:16 portrait",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/17/400/280"
        alt="Photo 8"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/18/400/190"
        alt="Photo 9"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Calm Horizon",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/19/400/340"
        alt="Photo 10"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Twilight Pier",
    description: "Golden hour at the coast",
    actions: (
      <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
        Bookmark
      </button>
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/20/400/210"
        alt="Photo 11"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/21/400/711"
        alt="Photo 12"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Tall Cliffs",
    description: "9:16 portrait",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/22/400/300"
        alt="Photo 13"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Rocky Shore",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/23/400/180"
        alt="Photo 14"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/24/400/250"
        alt="Photo 15"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Autumn Leaves",
    description: "Warm tones in the park",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/25/400/350"
        alt="Photo 16"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Table Setting",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/26/400/200"
        alt="Photo 17"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/27/400/711"
        alt="Photo 18"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Canyon Walls",
    description: "9:16 portrait",
    actions: (
      <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
        Download
      </button>
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/28/400/230"
        alt="Photo 19"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "City Lights",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/29/400/310"
        alt="Photo 20"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/30/400/190"
        alt="Photo 21"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Snowy Path",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/31/400/270"
        alt="Photo 22"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Morning Coffee",
    description: "Start the day right",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/32/400/711"
        alt="Photo 23"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Ocean Waves",
    description: "9:16 portrait",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/33/400/320"
        alt="Photo 24"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/34/400/200"
        alt="Photo 25"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Desert Road",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/35/400/290"
        alt="Photo 26"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Pine Trees",
    description: "Dense forest canopy",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/36/400/220"
        alt="Photo 27"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/37/400/711"
        alt="Photo 28"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Starry Night",
    description: "9:16 portrait",
    actions: (
      <>
        <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
          Like
        </button>
        <button className="px-2 py-0.5 text-xs bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition">
          Save
        </button>
      </>
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/38/400/180"
        alt="Photo 29"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/39/400/260"
        alt="Photo 30"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Sunset Hills",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/40/400/300"
        alt="Photo 31"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Lake Reflection",
    description: "Mirror-still water",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/41/400/210"
        alt="Photo 32"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/42/400/711"
        alt="Photo 33"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Vertical Drop",
    description: "9:16 portrait",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/43/400/330"
        alt="Photo 34"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Cathedral Interior",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/44/400/190"
        alt="Photo 35"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/45/400/280"
        alt="Photo 36"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Meadow Flowers",
    description: "Wildflowers in bloom",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/46/400/240"
        alt="Photo 37"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/47/400/310"
        alt="Photo 38"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Rustic Barn",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/48/400/200"
        alt="Photo 39"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
    title: "Industrial",
    description: "Urban exploration",
  },
  {
    content: (
      <img
        src="https://picsum.photos/id/49/400/270"
        alt="Photo 40"
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
    ),
  },
];

const cards = [
  {
    title: "Getting Started",
    desc: "Quick-start guide for new users",
    body: "Install with npm install @jacshuo/onyx and import what you need.",
  },
  {
    title: "Design Tokens",
    desc: "Semantic color system",
    body: "Onyx uses five semantic palettes — primary, secondary, success, warning, danger — all overridable via CSS custom properties.",
  },
  {
    title: "Tree Shaking",
    desc: "Import only what you use",
    body: "Each component is a separate entry point. Your bundler will only include the components you actually import.",
  },
  {
    title: "Responsive",
    desc: "Desktop-first, mobile-ready",
    body: "All layout components adapt to their container. Use Tailwind breakpoints for further customization.",
  },
  {
    title: "Dark Mode",
    desc: "Built-in theme support",
    body: "Toggle the .dark class on your root element — every component automatically adjusts.",
  },
  {
    title: "Accessibility",
    desc: "ARIA patterns out of the box",
    body: "Dialog, Accordion, Tabs, Tooltip and other interactive components follow WAI-ARIA authoring practices.",
  },
  {
    title: "TypeScript",
    desc: "Full type coverage",
    body: "Every prop, event, and variant is strongly typed with exported type aliases.",
  },
  {
    title: "CVA Variants",
    desc: "Composable styling",
    body: "Variant definitions are exported so you can extend or recombine them in your own components.",
  },
  {
    title: "Zero Dependencies",
    desc: "CodeBlock tokenizer",
    body: "The syntax highlighter uses a custom zero-dependency tokenizer supporting 14 languages.",
  },
];

/* ── Page ─────────────────────────────────────────────── */

export default function MasonryPage() {
  const handleClick = (item: unknown, index: number) => {
    const data = item as { title?: string } | undefined;
    const label = data?.title ?? `Item #${index + 1}`;
    console.log(`[Masonry] clicked: ${label}`, item);
  };

  return (
    <div className="space-y-10">
      <PageTitle>Masonry</PageTitle>

      <Section title="Image waterfall with overlays (responsive columnWidth)">
        <p className="text-xs text-primary-500 dark:text-primary-400">
          Hover over items to see the glass-reflection sweep, enlarge &amp; elevation effects, and
          overlay info. Click for a ripple flash. Resize to see columns adjust.
        </p>
        <Masonry columnWidth={220} gap={12} items={imageItems} onItemClick={handleClick} />
        <CodeExample code={waterfallCode} />
      </Section>

      <Section title="Card waterfall (fixed 3 columns, children API)">
        <Masonry columns={3} gap={16} onItemClick={(_, i) => console.log(`Card ${i} clicked`)}>
          {cards.map((c, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-600 dark:text-primary-300">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </Masonry>
        <CodeExample code={cardWaterfallCode} />
      </Section>

      <Section title="Mixed content (columnWidth = 200, gap = 20)">
        <Masonry
          columnWidth={200}
          gap={20}
          items={[
            ...imageItems.slice(0, 4),
            ...cards.slice(0, 4).map((c) => ({
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary-600 dark:text-primary-300">{c.body}</p>
                  </CardContent>
                </Card>
              ),
              title: c.title,
              description: c.desc,
            })),
          ]}
          onItemClick={handleClick}
        />
        <CodeExample code={mixedCode} />
      </Section>

      <Section title="Single column (columns = 1)">
        <div className="max-w-sm">
          <Masonry columns={1} gap={12} onItemClick={(_, i) => console.log(`Single col item ${i}`)}>
            {cards.slice(0, 3).map((c, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-600 dark:text-primary-300">{c.body}</p>
                </CardContent>
              </Card>
            ))}
          </Masonry>
        </div>
        <CodeExample code={singleColCode} />
      </Section>
    </div>
  );
}
