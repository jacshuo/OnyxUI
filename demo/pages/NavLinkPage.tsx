import { NavLink } from "../../src";
import { Section, PageTitle } from "./helpers";

export default function NavLinkPage() {
  return (
    <div className="space-y-8">
      <PageTitle>NavLink</PageTitle>

      <Section title="Intents">
        <div className="flex items-center gap-6">
          <NavLink href="#" intent="default">
            Default
          </NavLink>
          <NavLink href="#" intent="secondary">
            Secondary
          </NavLink>
          <NavLink href="#" intent="muted">
            Muted
          </NavLink>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex items-center gap-6">
          <NavLink href="#" size="sm">
            Small
          </NavLink>
          <NavLink href="#" size="md">
            Medium
          </NavLink>
          <NavLink href="#" size="lg">
            Large
          </NavLink>
        </div>
      </Section>

      <Section title="Underline">
        <div className="flex items-center gap-6">
          <NavLink href="#" underline="always">
            Always underline
          </NavLink>
          <NavLink href="#" underline="hover">
            Underline on hover
          </NavLink>
          <NavLink href="#" underline="none">
            No underline
          </NavLink>
        </div>
      </Section>

      <Section title="External (auto-detected)">
        <div className="flex items-center gap-6">
          <NavLink href="https://github.com">Auto-detected external</NavLink>
          <NavLink href="https://github.com" external={false}>
            External suppressed
          </NavLink>
          <NavLink href="#" external>
            Forced external icon
          </NavLink>
        </div>
      </Section>

      <Section title="Combinations">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-6">
            <NavLink href="#" intent="default" size="lg" underline="always">
              Primary large always
            </NavLink>
            <NavLink href="#" intent="secondary" size="sm" underline="none">
              Secondary small none
            </NavLink>
            <NavLink href="#" intent="muted" size="md" underline="hover">
              Muted medium hover
            </NavLink>
          </div>
          <div className="flex items-center gap-6">
            <NavLink href="https://github.com" intent="secondary" size="lg">
              External secondary large
            </NavLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
