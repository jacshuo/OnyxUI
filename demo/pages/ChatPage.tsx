import { useState } from "react";
import { Chat, type ChatMessage, Button, Input } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Send } from "lucide-react";

const splitModeCode = `<Chat messages={messages} mode="split" className="h-72" />
// mode="split" — self messages on right, others on left`;

const leftModeCode = `<Chat messages={messages} mode="left" className="h-72" />
// mode="left" — all messages on the left side`;

const interactiveCode = `const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

<Chat messages={messages} mode="split" className="h-72" />
<div className="flex gap-2">
  <Input placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
  <Button onClick={send}><Send /> Send</Button>
</div>`;

const splitMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "Alice",
    avatar: "https://ui-avatars.com/api/?name=Alice&background=6366f1&color=fff&size=40",
    content:
      "I especially like the card variants. The horizontal card with image is super flexible.",
    time: "10:02 AM",
  },
  {
    id: 2,
    sender: "You",
    avatar: "https://ui-avatars.com/api/?name=You&background=10b981&color=fff&size=40",
    content: "Agreed. Shall we pair on the dashboard page this afternoon?",
    time: "10:03 AM",
    self: true,
  },
  {
    id: 3,
    sender: "Alice",
    avatar: "https://ui-avatars.com/api/?name=Alice&background=6366f1&color=fff&size=40",
    content: "Sounds good! Let me grab coffee first ☕",
    time: "10:04 AM",
  },
];

const leftMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "Charlie",
    avatar: "https://ui-avatars.com/api/?name=Charlie&background=f59e0b&color=fff&size=40",
    content: "Give me 5 minutes, grabbing coffee.",
    time: "9:02 AM",
  },
  {
    id: 2,
    sender: "Alice",
    avatar: "https://ui-avatars.com/api/?name=Alice&background=6366f1&color=fff&size=40",
    content: "Sure thing! I'll start preparing the board.",
    time: "9:03 AM",
  },
  {
    id: 3,
    sender: "Bot",
    avatar: "🤖",
    content: "Standup reminder: please share your updates before 9:30.",
    time: "9:05 AM",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(splitMessages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "You",
        avatar: "https://ui-avatars.com/api/?name=You&background=10b981&color=fff&size=40",
        content: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        self: true,
      },
    ]);
    setText("");
  };

  return (
    <div className="space-y-8">
      <PageTitle>Chat</PageTitle>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Split mode (self right, others left)">
          <Chat messages={splitMessages} mode="split" className="h-72" />
          <CodeExample code={splitModeCode} />
        </Section>

        <Section title="Left mode (all on one side)">
          <Chat messages={leftMessages} mode="left" className="h-72" />
          <CodeExample code={leftModeCode} />
        </Section>
      </div>

      <Section title="Interactive — type & send">
        <div className="flex flex-col gap-3">
          <Chat messages={messages} mode="split" className="h-72" />
          <div className="flex gap-2">
            <Input
              placeholder="Type a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button onClick={send}>
              <Send /> Send
            </Button>
          </div>
        </div>
        <CodeExample code={interactiveCode} language="typescript" />
      </Section>
    </div>
  );
}
