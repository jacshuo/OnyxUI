import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const dialogProps: PropRow[] = [
  { prop: "open", type: "boolean", required: true, description: "Controlled open state" },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Open state change callback",
  },
  {
    prop: "modal",
    type: "boolean",
    default: "true",
    description: "Render as modal with backdrop overlay",
  },
  {
    prop: "closeOnOutsideClick",
    type: "boolean",
    default: "true",
    description: "Close when clicking outside the dialog",
  },
];

const dialogContentProps: PropRow[] = [
  {
    prop: "size",
    type: `"sm" | "md" | "lg" | "xl" | "full"`,
    default: `"md"`,
    description: "Dialog width",
  },
  {
    prop: "position",
    type: `"center" | "bottom"`,
    default: `"center"`,
    description: "Vertical position of the dialog",
  },
];

const usageCode = `import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button intent="secondary">Cancel</Button>
            </DialogClose>
            <Button intent="danger" onClick={() => setOpen(false)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}`;

export default function DialogDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Dialog</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Dialog Props">
        <PropTable rows={dialogProps} title="Dialog" />
      </Section>

      <Section title="DialogContent Props">
        <PropTable rows={dialogContentProps} title="DialogContent" />
      </Section>

      <Section title="Sub-components">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose — pass through
          their respective HTML element attributes.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
