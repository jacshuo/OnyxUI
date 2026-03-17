import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

/* ── Types ─────────────────────────────────────────────── */

export interface ChatMessage {
  /** Unique id for the message. */
  id: string | number;
  /** Sender display name. */
  sender: string;
  /** Avatar — URL string or ReactNode (icon / component). */
  avatar?: string | React.ReactNode;
  /** Message body. Can be text or rich ReactNode content. */
  content: React.ReactNode;
  /** Timestamp label, e.g. "10:30 AM". */
  time?: string;
  /** Mark as "self" (current user). Controls bubble alignment in split mode. */
  self?: boolean;
}

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of messages to render. */
  messages: ChatMessage[];
  /**
   * Layout mode.
   * - `'split'` — self messages on the right, others on the left (default)
   * - `'left'`  — all messages aligned to the left
   */
  mode?: 'split' | 'left';
  /** Auto-scroll to bottom when messages change. @default true */
  autoScroll?: boolean;
}

/* ── Avatar helper ─────────────────────────────────────── */

function Avatar({ avatar, sender }: { avatar?: string | React.ReactNode; sender: string }) {
  if (!avatar) {
    // Fallback: first letter
    return (
      <div className="bg-primary-200 text-primary-600 dark:bg-primary-700 dark:text-primary-300 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold select-none">
        {sender.charAt(0).toUpperCase()}
      </div>
    );
  }

  if (typeof avatar === 'string') {
    // Check if it's a URL (starts with http/https/data/blob) vs plain text/emoji
    if (/^(?:https?|data|blob):/.test(avatar)) {
      return (
        <img
          src={avatar}
          alt={sender}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
          draggable={false}
        />
      );
    }
    // Plain text or emoji — render as text in a circle
    return (
      <div className="bg-primary-200 text-primary-600 dark:bg-primary-700 dark:text-primary-300 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg select-none">
        {avatar}
      </div>
    );
  }

  // ReactNode (icon / custom)
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full">{avatar}</div>
  );
}

/* ── ChatBubble ────────────────────────────────────────── */

function ChatBubble({ msg, alignRight }: { msg: ChatMessage; alignRight: boolean }) {
  return (
    <div className={cn('flex gap-2.5', alignRight ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar avatar={msg.avatar} sender={msg.sender} />

      <div
        className={cn(
          'flex max-w-[75%] flex-col gap-0.5',
          alignRight ? 'items-end' : 'items-start',
        )}
      >
        {/* Sender name */}
        <span className="text-primary-500 dark:text-primary-400 text-xs">{msg.sender}</span>

        {/* Bubble */}
        <div
          className={cn(
            'rounded-xl px-3 py-2 text-sm leading-relaxed',
            alignRight
              ? 'rounded-tr-sm bg-primary-500 text-white dark:bg-primary-600'
              : 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200 rounded-tl-sm',
          )}
        >
          {msg.content}
        </div>

        {/* Timestamp */}
        {msg.time && (
          <span className="text-primary-400 dark:text-primary-500 text-[10px]">{msg.time}</span>
        )}
      </div>
    </div>
  );
}

/* ── Chat ──────────────────────────────────────────────── */

export function Chat({
  messages,
  mode = 'split',
  autoScroll = true,
  className,
  ...props
}: ChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-y-auto rounded-lg border p-4',
        'border-primary-200 dark:border-primary-700 dark:bg-primary-900 bg-white',
        className,
      )}
      {...props}
    >
      {messages.map((msg) => {
        const alignRight = mode === 'split' && !!msg.self;
        return <ChatBubble key={msg.id} msg={msg} alignRight={alignRight} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
