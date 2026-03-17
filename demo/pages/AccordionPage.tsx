import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '../../src';
import { Section, PageTitle } from './helpers';
import { HelpCircle, DollarSign, Moon } from 'lucide-react';

export default function AccordionPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Accordion</PageTitle>

      <Section title="Single (default)">
        <Accordion defaultValue={['a1']}>
          <AccordionItem value="a1">
            <AccordionTrigger><HelpCircle /> What is @jacshuo/onyx?</AccordionTrigger>
            <AccordionContent>
              A cross-platform React component library built with Tailwind CSS v4 and CVA.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="a2">
            <AccordionTrigger><DollarSign /> Is it free?</AccordionTrigger>
            <AccordionContent>Yes, it is MIT licensed.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="a3">
            <AccordionTrigger><Moon /> Does it support dark mode?</AccordionTrigger>
            <AccordionContent>
              Absolutely! Every component respects the dark class on the html element.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Multiple open + bordered">
        <Accordion type="multiple" defaultValue={['b1', 'b2']} intent="bordered">
          <AccordionItem value="b1">
            <AccordionTrigger>Section One</AccordionTrigger>
            <AccordionContent>Multiple items can be open at the same time.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b2">
            <AccordionTrigger>Section Two</AccordionTrigger>
            <AccordionContent>This one is also open by default.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
