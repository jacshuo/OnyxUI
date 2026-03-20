import {
  Badge,
  Button,
  ImageCard,
  ImageCardBody,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardActions,
} from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Heart, Share2, Bookmark, MapPin, Clock, ExternalLink } from "lucide-react";

const galleryCode = `<ImageCard
  src="https://example.com/image.jpg"
  alt="Swiss Alps"
>
  <ImageCardBody>
    <ImageCardTitle>Swiss Alps</ImageCardTitle>
    <ImageCardDescription>Breathtaking panoramic view at golden hour.</ImageCardDescription>
  </ImageCardBody>
  <ImageCardActions className="justify-between">
    <Button size="sm" intent="ghost"><Heart /> Like</Button>
    <Button size="sm" intent="ghost"><Bookmark /></Button>
  </ImageCardActions>
</ImageCard>`;

const squareCode = `<ImageCard
  src="https://example.com/image.jpg"
  alt="Enchanted Forest"
  aspectRatio="1/1"
>
  <ImageCardBody>
    <ImageCardTitle>Enchanted Forest</ImageCardTitle>
  </ImageCardBody>
</ImageCard>
// aspectRatio: "16/9" (default) | "1/1" | "4/3" | "3/2" | "21/9"`;

export default function ImageCardPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Image Card</PageTitle>

      <Section title="Gallery grid">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Simple body only */}
          <ImageCard
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=340&fit=crop"
            alt="Swiss Alps"
          >
            <ImageCardBody>
              <ImageCardTitle>Swiss Alps</ImageCardTitle>
              <ImageCardDescription>
                A breathtaking panoramic view of snow-capped peaks at golden hour.
              </ImageCardDescription>
            </ImageCardBody>
          </ImageCard>

          {/* With action buttons */}
          <ImageCard
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=340&fit=crop"
            alt="Downtown Skyline"
          >
            <ImageCardBody>
              <ImageCardTitle>Downtown Skyline</ImageCardTitle>
              <ImageCardDescription>Urban architecture at dusk.</ImageCardDescription>
            </ImageCardBody>
            <ImageCardActions className="justify-between">
              <div className="flex gap-2">
                <Button size="sm" intent="ghost">
                  <Heart className="h-4 w-4" /> Like
                </Button>
                <Button size="sm" intent="ghost">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <Button size="sm" intent="ghost">
                <Bookmark className="h-4 w-4" />
              </Button>
            </ImageCardActions>
          </ImageCard>

          {/* With metadata + badge */}
          <ImageCard
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=340&fit=crop"
            alt="Coastal Retreat"
          >
            <ImageCardBody>
              <ImageCardTitle>Coastal Retreat</ImageCardTitle>
              <div className="text-primary-500 dark:text-primary-400 mt-1 space-y-1 text-sm">
                <p className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Malibu, California
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> 3 days, 2 nights
                </p>
              </div>
            </ImageCardBody>
            <ImageCardActions className="justify-between">
              <Badge intent="success">Available</Badge>
              <Button size="sm">
                <ExternalLink className="h-4 w-4" /> Book Now
              </Button>
            </ImageCardActions>
          </ImageCard>
        </div>
        <CodeExample code={galleryCode} />
      </Section>

      <Section title="Square (1/1)">
        <div className="max-w-xs">
          <ImageCard
            src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=400&h=400&fit=crop"
            alt="Enchanted Forest"
            aspectRatio="1/1"
          >
            <ImageCardBody>
              <ImageCardTitle>Enchanted Forest</ImageCardTitle>
            </ImageCardBody>
          </ImageCard>
        </div>
        <CodeExample code={squareCode} />
      </Section>
    </div>
  );
}
