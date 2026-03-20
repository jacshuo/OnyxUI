import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const chatMessageProps: PropRow[] = [
  { prop: "id", type: "string | number", required: true, description: "Unique message identifier" },
  { prop: "sender", type: "string", required: true, description: "Sender name" },
  { prop: "avatar", type: "string | React.ReactNode", description: "Avatar image URL or element" },
  { prop: "content", type: "React.ReactNode", required: true, description: "Message content" },
  { prop: "time", type: "string", description: "Timestamp string" },
  { prop: "self", type: "boolean", description: "True if this message was sent by the local user" },
];

const chatProps: PropRow[] = [
  {
    prop: "messages",
    type: "ChatMessage[]",
    required: true,
    description: "Array of messages to render",
  },
  {
    prop: "mode",
    type: `"split" | "left"`,
    default: `"left"`,
    description: "Layout mode: left aligns all messages left; split puts self on the right",
  },
  {
    prop: "autoScroll",
    type: "boolean",
    default: "true",
    description: "Auto-scroll to the latest message",
  },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLDivElement>",
    description: "All native div attributes",
  },
];

const usageCode = `import { Chat, type ChatMessage } from "@jacshuo/onyx";

const messages: ChatMessage[] = [
  { id: 1, sender: "Alice", content: "Hey, how are you?", time: "10:00 AM" },
  { id: 2, sender: "You", content: "I'm good, thanks!", time: "10:01 AM", self: true },
];

export function Example() {
  return (
    <Chat messages={messages} mode="split" className="h-64 rounded-lg border" />
  );
}`;

export default function ChatDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Chat</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Chat, type ChatMessage } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="ChatMessage">
        <PropTable rows={chatMessageProps} title="ChatMessage" />
      </Section>

      <Section title="Chat Props">
        <PropTable rows={chatProps} title="Chat" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>
    </div>
  );
}
