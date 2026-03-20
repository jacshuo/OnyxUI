import { useState } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { AlertTriangle, FileText, X, Check, User, Mail, Info, Layers, Trash2 } from "lucide-react";

const basicCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogClose />
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

const largeSizeCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="lg">
    <DialogClose />
    <DialogHeader>
      <DialogTitle>Terms of Service</DialogTitle>
    </DialogHeader>
    <p>Content…</p>
    <DialogFooter>
      <Button intent="ghost">Decline</Button>
      <Button>Accept</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

const formCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogClose />
    <DialogHeader><DialogTitle>Create Account</DialogTitle></DialogHeader>
    <form onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
      <Input prefix={<User />} placeholder="John Doe" />
      <Input prefix={<Mail />} type="email" placeholder="john@example.com" />
      <DialogFooter>
        <Button intent="ghost" type="button">Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`;

const nonModalCode = `<Dialog open={open} onOpenChange={setOpen} modal={false} closeOnOutsideClick>
  <DialogContent>
    <DialogClose />
    <DialogHeader><DialogTitle>Tip</DialogTitle></DialogHeader>
    <DialogFooter><Button intent="ghost">Got it</Button></DialogFooter>
  </DialogContent>
</Dialog>`;

const nestedCode = `{/* Parent dialog */}
<Dialog open={parent} onOpenChange={setParent}>
  <DialogContent>
    <DialogClose />
    <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
    <DialogFooter>
      <Button intent="danger" onClick={() => setConfirm(true)}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
{/* Nested confirmation */}
<Dialog open={confirm} onOpenChange={setConfirm}>
  <DialogContent><DialogClose />
    <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
  </DialogContent>
</Dialog>`;

const sheetCode = `<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent position="bottom">
    <DialogClose />
    <DialogHeader><DialogTitle>Actions</DialogTitle></DialogHeader>
    <div className="space-y-2 py-2">
      {/* Sheet menu items */}
    </div>
    <DialogFooter><Button intent="ghost">Close</Button></DialogFooter>
  </DialogContent>
</Dialog>`;

export default function DialogPage() {
  const [basic, setBasic] = useState(false);
  const [lg, setLg] = useState(false);
  const [form, setForm] = useState(false);
  const [nonModal, setNonModal] = useState(false);
  const [parent, setParent] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sheet, setSheet] = useState(false);

  return (
    <div className="space-y-8">
      <PageTitle>Dialog</PageTitle>

      <Section title="Basic">
        <Button onClick={() => setBasic(true)}>
          <AlertTriangle /> Open Dialog
        </Button>
        <Dialog open={basic} onOpenChange={setBasic}>
          <DialogContent>
            <DialogClose />
            <DialogHeader>
              <DialogTitle>
                <AlertTriangle className="text-warning-500" /> Confirm Action
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to continue? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button intent="ghost" onClick={() => setBasic(false)}>
                <X /> Cancel
              </Button>
              <Button onClick={() => setBasic(false)}>
                <Check /> Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Large size">
        <Button intent="outline" onClick={() => setLg(true)}>
          <FileText /> Open Large Dialog
        </Button>
        <Dialog open={lg} onOpenChange={setLg}>
          <DialogContent size="lg">
            <DialogClose />
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
              <DialogDescription>Please read carefully before proceeding.</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-primary-600 dark:text-primary-400 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <DialogFooter>
              <Button intent="ghost" onClick={() => setLg(false)}>
                Decline
              </Button>
              <Button onClick={() => setLg(false)}>Accept</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeExample code={largeSizeCode} />
      </Section>

      <Section title="Modal with form">
        <Button onClick={() => setForm(true)}>
          <User /> Create Account
        </Button>
        <Dialog open={form} onOpenChange={setForm}>
          <DialogContent>
            <DialogClose />
            <DialogHeader>
              <DialogTitle>
                <User /> Create Account
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new account.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setForm(false);
              }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Name
                </label>
                <Input prefix={<User className="h-4 w-4" />} placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Email
                </label>
                <Input
                  prefix={<Mail className="h-4 w-4" />}
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <DialogFooter>
                <Button intent="ghost" type="button" onClick={() => setForm(false)}>
                  <X /> Cancel
                </Button>
                <Button type="submit">
                  <Check /> Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <CodeExample code={formCode} />
      </Section>

      <Section title="Non-modal (no backdrop, no scroll lock)">
        <Button intent="outline" onClick={() => setNonModal(true)}>
          <Info /> Open Non-Modal
        </Button>
        <Dialog open={nonModal} onOpenChange={setNonModal} modal={false} closeOnOutsideClick>
          <DialogContent>
            <DialogClose />
            <DialogHeader>
              <DialogTitle>
                <Info /> Tip
              </DialogTitle>
              <DialogDescription>
                This is a non-modal dialog. You can still interact with the page behind it. Click
                outside to dismiss.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button intent="ghost" onClick={() => setNonModal(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeExample code={nonModalCode} />
      </Section>

      <Section title="Nested / stacked dialogs">
        <Button onClick={() => setParent(true)}>
          <Layers /> Open Parent Dialog
        </Button>
        <Dialog open={parent} onOpenChange={setParent}>
          <DialogContent>
            <DialogClose />
            <DialogHeader>
              <DialogTitle>
                <Layers /> Edit Item
              </DialogTitle>
              <DialogDescription>
                Make changes to your item. Click &quot;Delete&quot; to trigger a nested confirmation
                dialog.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Item name
                </label>
                <Input placeholder="My important item" />
              </div>
            </div>
            <DialogFooter>
              <Button intent="danger" onClick={() => setConfirm(true)}>
                <Trash2 /> Delete
              </Button>
              <Button intent="ghost" onClick={() => setParent(false)}>
                <X /> Cancel
              </Button>
              <Button onClick={() => setParent(false)}>
                <Check /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={confirm} onOpenChange={setConfirm}>
          <DialogContent>
            <DialogClose />
            <DialogHeader>
              <DialogTitle>
                <AlertTriangle className="text-danger-500" /> Are you sure?
              </DialogTitle>
              <DialogDescription>
                This will permanently delete the item. You must close this dialog before you can
                interact with the parent dialog.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button intent="ghost" onClick={() => setConfirm(false)}>
                <X /> Cancel
              </Button>
              <Button
                intent="danger"
                onClick={() => {
                  setConfirm(false);
                  setParent(false);
                }}
              >
                <Trash2 /> Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeExample code={nestedCode} />
      </Section>

      <Section title="Bottom sheet (position=bottom)">
        <Button onClick={() => setSheet(true)}>
          <Info /> Open Bottom Sheet
        </Button>
        <Dialog open={sheet} onOpenChange={setSheet}>
          <DialogContent position="bottom">
            <DialogClose />
            <DialogHeader>
              <DialogTitle>Actions</DialogTitle>
              <DialogDescription>
                This dialog slides up from the bottom of the screen, like a native mobile sheet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-primary-800/50"
                onClick={() => setSheet(false)}
              >
                <FileText className="h-4 w-4 text-primary-500" /> View details
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-primary-800/50"
                onClick={() => setSheet(false)}
              >
                <Check className="h-4 w-4 text-success-500" /> Mark as done
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30"
                onClick={() => setSheet(false)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
            <DialogFooter>
              <Button intent="ghost" onClick={() => setSheet(false)}>
                <X /> Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeExample code={sheetCode} />
      </Section>
    </div>
  );
}
