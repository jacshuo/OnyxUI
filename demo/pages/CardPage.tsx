import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  HorizontalCard,
} from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Rocket, Heart, Share2, ExternalLink, BookOpen, Music, UserCircle } from "lucide-react";

const intentCode = `<Card>
  <CardHeader>
    <CardTitle>Default</CardTitle>
    <CardDescription>Standard bordered card.</CardDescription>
  </CardHeader>
  <CardContent>Body content goes here.</CardContent>
  <CardFooter><Button size="sm">Action</Button></CardFooter>
</Card>
// intents: "default" | "elevated" | "outlined" | "ghost"`;

const horizontalLeftCode = `<HorizontalCard
  media={{ src: "https://example.com/img.jpg", alt: "Alt text", width: "10rem" }}
>
  <CardTitle>Mountain Trail</CardTitle>
  <CardDescription>A scenic hike through alpine meadows.</CardDescription>
  <CardFooter>
    <Button size="sm"><Heart /> Like</Button>
  </CardFooter>
</HorizontalCard>`;

const horizontalRightCode = `<HorizontalCard
  mediaPosition="right"
  media={{ src: "https://example.com/img.jpg", alt: "Alt text", width: "12rem" }}
>
  <CardTitle>Live Session</CardTitle>
  <CardFooter><Button size="sm" intent="ghost"><Music /> Play</Button></CardFooter>
</HorizontalCard>`;

const horizontalIconCode = `<HorizontalCard
  className="max-w-md"
  media={{ icon: <UserCircle className="h-10 w-10" />, width: "5rem" }}
>
  <CardTitle>Jane Doe</CardTitle>
  <CardDescription>Product Designer · San Francisco</CardDescription>
</HorizontalCard>`;

const stackOnMobileCode = `<HorizontalCard
  stackOnMobile
  media={{ src: "https://example.com/img.jpg", alt: "Demo image" }}
>
  <CardTitle>Responsive Card</CardTitle>
  <CardDescription>Stacks on mobile, side-by-side on larger screens.</CardDescription>
</HorizontalCard>`;

export default function CardPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Card</PageTitle>

      <Section title="Intent variants">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>Standard bordered card.</CardDescription>
            </CardHeader>
            <CardContent>Body content goes here.</CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card intent="elevated">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>Shadow on hover.</CardDescription>
            </CardHeader>
            <CardContent>Hover to see the shadow lift.</CardContent>
          </Card>
          <Card intent="outlined">
            <CardHeader>
              <CardTitle>Outlined</CardTitle>
              <CardDescription>Thicker border, transparent bg.</CardDescription>
            </CardHeader>
            <CardContent>Clean outlined look.</CardContent>
          </Card>
          <Card intent="ghost">
            <CardHeader>
              <CardTitle>Ghost</CardTitle>
              <CardDescription>Subtle background tinting.</CardDescription>
            </CardHeader>
            <CardContent>Minimal feel.</CardContent>
          </Card>
        </div>
        <CodeExample code={intentCode} />
      </Section>

      <Section title="Horizontal &mdash; image left">
        <HorizontalCard
          media={{
            src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
            alt: "Mountain trail",
            width: "10rem",
          }}
        >
          <CardTitle>Mountain Trail</CardTitle>
          <CardDescription>A scenic hike through alpine meadows.</CardDescription>
          <CardContent className="mt-2">Difficulty: Moderate &middot; 12&nbsp;km</CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button size="sm" intent="ghost">
                <Heart className="h-4 w-4" /> Like
              </Button>
              <Button size="sm" intent="ghost">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
            <Button size="sm">
              <ExternalLink className="h-4 w-4" /> Read
            </Button>
          </CardFooter>
        </HorizontalCard>

        <HorizontalCard
          className="mt-4"
          media={{
            src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
            alt: "Urban photography",
            width: "10rem",
          }}
        >
          <CardTitle>Urban Photography</CardTitle>
          <CardDescription>Capturing city life at golden hour.</CardDescription>
          <CardContent className="mt-2">Shot on 35mm film &middot; Published Mar 2026</CardContent>
          <CardFooter>
            <span className="text-primary-500 dark:text-primary-400 flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" /> 42
            </span>
            <Button size="sm" intent="ghost">
              <BookOpen className="h-4 w-4" /> Full article
            </Button>
          </CardFooter>
        </HorizontalCard>
        <CodeExample code={horizontalLeftCode} />
      </Section>

      <Section title="Horizontal &mdash; image right">
        <HorizontalCard
          mediaPosition="right"
          media={{
            src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
            alt: "Live session",
            width: "12rem",
          }}
        >
          <CardTitle>Live Session</CardTitle>
          <CardDescription>Acoustic set recorded in Berlin.</CardDescription>
          <CardContent className="mt-2">Duration: 45&nbsp;min &middot; 3 tracks</CardContent>
          <CardFooter>
            <Button size="sm" intent="ghost">
              <Music className="h-4 w-4" /> Play
            </Button>
            <Button size="sm" intent="ghost">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </CardFooter>
        </HorizontalCard>
        <CodeExample code={horizontalRightCode} />
      </Section>

      <Section title="Horizontal &mdash; icon / avatar">
        <HorizontalCard
          className="max-w-md"
          media={{ icon: <UserCircle className="h-10 w-10" />, width: "5rem" }}
        >
          <CardTitle>Jane Doe</CardTitle>
          <CardDescription>Product Designer &middot; San Francisco</CardDescription>
          <CardContent className="mt-2">
            Passionate about design systems and accessible UI.
          </CardContent>
          <CardFooter>
            <Button size="sm">
              <ExternalLink className="h-4 w-4" /> View profile
            </Button>
          </CardFooter>
        </HorizontalCard>
        <CodeExample code={horizontalIconCode} />
      </Section>

      <Section title="Horizontal &mdash; stacked on mobile">
        <p className="mb-3 text-sm text-primary-500 dark:text-primary-400">
          Narrow the window below the <code>sm</code> breakpoint to see the card stack vertically.
        </p>
        <HorizontalCard
          className="max-w-lg"
          media={{ src: "https://picsum.photos/seed/jac/400/300", alt: "Demo image" }}
          stackOnMobile
        >
          <CardTitle>Responsive Horizontal Card</CardTitle>
          <CardDescription>
            Stacks vertically on small screens, side-by-side on larger ones.
          </CardDescription>
          <CardContent className="mt-2">
            Use <code className="text-xs">stackOnMobile</code> to enable this responsive behaviour.
          </CardContent>
          <CardFooter>
            <Button size="sm">
              <BookOpen className="h-4 w-4" /> Read more
            </Button>
          </CardFooter>
        </HorizontalCard>
        <CodeExample code={stackOnMobileCode} />
      </Section>
    </div>
  );
}
