import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { HelpCircle, DollarSign, Moon } from "lucide-react";

const singleCode = `<Accordion defaultValue={["a1"]}>
  <AccordionItem value="a1">
    <AccordionTrigger>What is @jacshuo/onyx?</AccordionTrigger>
    <AccordionContent>A cross-platform React component library.</AccordionContent>
  </AccordionItem>
</Accordion>`;

const multipleCode = `<Accordion type="multiple" defaultValue={["b1", "b2"]} intent="bordered">
  <AccordionItem value="b1">
    <AccordionTrigger>Section One</AccordionTrigger>
    <AccordionContent>Multiple items can be open at once.</AccordionContent>
  </AccordionItem>
</Accordion>`;

const sizesCode = `<Accordion size="sm" defaultValue={["s-sm"]}>
  <AccordionItem value="s-sm">
    <AccordionTrigger>Size "sm" trigger</AccordionTrigger>
    <AccordionContent>Content area scales with the size prop.</AccordionContent>
  </AccordionItem>
</Accordion>
// Available sizes: "sm" | "md" | "lg"`;

export default function AccordionPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Accordion</PageTitle>

      <Section title="Single (default)">
        <Accordion defaultValue={["a1"]}>
          <AccordionItem value="a1">
            <AccordionTrigger>
              <HelpCircle /> What is @jacshuo/onyx?
            </AccordionTrigger>
            <AccordionContent>
              A cross-platform React component library built with Tailwind CSS v4 and CVA.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="a2">
            <AccordionTrigger>
              <DollarSign /> Is it free?
            </AccordionTrigger>
            <AccordionContent>Yes, it is MIT licensed.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="a3">
            <AccordionTrigger>
              <Moon /> Does it support dark mode?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! Every component respects the dark class on the html element.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <CodeExample code={singleCode} />
      </Section>

      <Section title="Multiple open + bordered">
        <Accordion type="multiple" defaultValue={["b1", "b2"]} intent="bordered">
          <AccordionItem value="b1">
            <AccordionTrigger>Section One</AccordionTrigger>
            <AccordionContent>Multiple items can be open at the same time.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b2">
            <AccordionTrigger>Section Two</AccordionTrigger>
            <AccordionContent>This one is also open by default.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <CodeExample code={multipleCode} />
      </Section>

      <Section title="Sizes">
        <div className="space-y-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {size}
              </p>
              <Accordion size={size} defaultValue={[`s-${size}`]}>
                <AccordionItem value={`s-${size}`}>
                  <AccordionTrigger>Size &ldquo;{size}&rdquo; trigger</AccordionTrigger>
                  <AccordionContent>Content area scales with the size prop.</AccordionContent>
                </AccordionItem>
                <AccordionItem value={`s-${size}-2`}>
                  <AccordionTrigger>Another item</AccordionTrigger>
                  <AccordionContent>
                    Padding and font size both adjust automatically.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>
    </div>
  );
}
