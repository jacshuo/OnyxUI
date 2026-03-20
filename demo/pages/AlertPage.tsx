import {
  Button,
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  useAlert,
} from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const staticAlertCode = `<Alert intent="success">
  <AlertIcon><CheckCircle /></AlertIcon>
  <AlertContent>
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>Operation completed successfully.</AlertDescription>
  </AlertContent>
</Alert>
// Available intents: "success" | "warning" | "error" | "info"`;

const toastCode = `const { addAlert } = useAlert();

addAlert({
  intent: "success",
  title: "Saved",
  message: "Changes saved.",
  position: "top-right",
  duration: 3000, // ms, 0 = persistent
});
// positions: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left"`;
import { CheckCircle, AlertTriangle, XCircle, Info, Bell, Pin } from "lucide-react";

export default function AlertPage() {
  const { addAlert } = useAlert();

  return (
    <div className="space-y-8">
      <PageTitle>Alert / Toast</PageTitle>

      <Section title="Static (inline) alerts">
        <div className="space-y-3">
          <Alert intent="success">
            <AlertIcon>
              <CheckCircle />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Operation completed successfully.</AlertDescription>
            </AlertContent>
          </Alert>
          <Alert intent="warning">
            <AlertIcon>
              <AlertTriangle />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Please check your input.</AlertDescription>
            </AlertContent>
          </Alert>
          <Alert intent="error">
            <AlertIcon>
              <XCircle />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong.</AlertDescription>
            </AlertContent>
          </Alert>
          <Alert intent="info">
            <AlertIcon>
              <Info />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>Here is some information.</AlertDescription>
            </AlertContent>
          </Alert>
        </div>
        <CodeExample code={staticAlertCode} />
      </Section>

      <Section title="Toast notifications (fly-in)">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="primary"
            onClick={() =>
              addAlert({
                intent: "success",
                title: "Saved",
                message: "Changes saved.",
                position: "top-right",
              })
            }
          >
            <Bell /> Toast top-right
          </Button>
          <Button
            intent="danger"
            onClick={() =>
              addAlert({
                intent: "error",
                title: "Error",
                message: "Something failed.",
                position: "top-left",
              })
            }
          >
            <XCircle /> Toast top-left
          </Button>
          <Button
            intent="warning"
            onClick={() =>
              addAlert({
                intent: "warning",
                title: "Warning",
                message: "Check your input.",
                position: "bottom-right",
              })
            }
          >
            <AlertTriangle /> Toast bottom-right
          </Button>
          <Button
            intent="outline"
            onClick={() =>
              addAlert({
                intent: "info",
                title: "Info",
                message: "For your information.",
                position: "top-center",
              })
            }
          >
            <Info /> Toast top-center
          </Button>
          <Button
            intent="ghost"
            onClick={() =>
              addAlert({
                intent: "success",
                title: "Persistent",
                message: "This stays until dismissed.",
                duration: 0,
              })
            }
          >
            <Pin /> Persistent toast
          </Button>
        </div>
        <CodeExample code={toastCode} language="typescript" />
      </Section>
    </div>
  );
}
