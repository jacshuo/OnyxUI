import { useState } from "react";
import { CodeBlock, type CodeBlockLanguage } from "../../src";
import { Section, PageTitle } from "./helpers";

const tsExample = `interface User {
  id: number;
  name: string;
  email: string;
}

function greet(user: User): string {
  // welcome message
  return \`Hello, \${user.name}!\`;
}

const admins: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
];
console.log(greet(admins[0]));`;

const tsxExample = `import React, { useState } from "react";

interface CounterProps {
  initial?: number;
}

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setCount((c) => c - 1)}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}`;

const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hello</title>
  <style>
    body { font-family: sans-serif; color: #333; }
    .highlight { background: yellow; }
  </style>
</head>
<body>
  <h1 class="highlight">Hello, World!</h1>
  <p>This is a <strong>sample</strong> page.</p>
  <script>
    document.querySelector("h1").addEventListener("click", () => {
      alert("Clicked!");
    });
  </script>
</body>
</html>`;

const cssExample = `:root {
  --primary: #0f172a;
  --radius: 0.5rem;
}

.card {
  border-radius: var(--radius);
  padding: 1.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

@media (prefers-color-scheme: dark) {
  .card { background: var(--primary); }
}`;

const pythonExample = `from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    name: str
    email: str
    age: Optional[int] = None

    def greet(self) -> str:
        """Return a greeting message."""
        return f"Hello, {self.name}!"

users = [User("Alice", "alice@example.com", 30)]
for user in users:
    print(user.greet())  # Hello, Alice!`;

const jsonExample = `{
  "name": "@jacshuo/onyx",
  "version": "0.1.9",
  "dependencies": {
    "react": "^18.0.0",
    "shiki": "^1.0.0"
  },
  "scripts": {
    "dev": "webpack serve --config webpack.dev.config.cjs",
    "build": "tsup && node scripts/build-css.mjs"
  }
}`;

const markdownExample = `# CodeBlock Component

A syntax-highlighted code block with **Shiki** integration.

## Features

- Supports 20+ languages out of the box
- \`light\` and \`dark\` theme via CSS variables
- Line numbers with \`lineNumbers\` prop

### Example

\`\`\`tsx
<CodeBlock code={myCode} language="typescript" />
\`\`\`

> Built on top of [Shiki](https://shiki.style/).`;

const vueExample = `<template>
  <div class="counter">
    <button @click="count--">−</button>
    <span>{{ count }}</span>
    <button @click="count++">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<style scoped>
.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>`;

const sqlExample = `SELECT
  u.id,
  u.name,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2025-01-01'
  AND u.status = 'active'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`;

const bashExample = `#!/bin/bash
set -euo pipefail

# Deploy script
echo "Building project..."
npm run build

if [ -d "dist" ]; then
  echo "Deploying to production..."
  rsync -avz --delete dist/ server:/var/www/app/
  echo "Done! ✅"
else
  echo "Error: dist directory not found" >&2
  exit 1
fi`;

type Sample = { label: string; language: CodeBlockLanguage; code: string };

const samples: Sample[] = [
  { label: "TypeScript", language: "typescript", code: tsExample },
  { label: "TSX", language: "tsx", code: tsxExample },
  { label: "HTML", language: "html", code: htmlExample },
  { label: "CSS", language: "css", code: cssExample },
  { label: "Python", language: "python", code: pythonExample },
  { label: "JSON", language: "json", code: jsonExample },
  { label: "Markdown", language: "markdown", code: markdownExample },
  { label: "Vue", language: "vue", code: vueExample },
  { label: "SQL", language: "sql", code: sqlExample },
  { label: "Bash", language: "bash", code: bashExample },
];

const editableLangs: { label: string; value: CodeBlockLanguage }[] = [
  { label: "TypeScript", value: "typescript" },
  { label: "TSX", value: "tsx" },
  { label: "JavaScript", value: "javascript" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
  { label: "JSON", value: "json" },
  { label: "SQL", value: "sql" },
  { label: "Bash", value: "bash" },
];

export default function CodeBlockPage() {
  const [active, setActive] = useState(0);
  const current = samples[active];

  const [editCode, setEditCode] = useState(
    `function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));`,
  );
  const [editLang, setEditLang] = useState<CodeBlockLanguage>("typescript");

  return (
    <div className="space-y-8">
      <PageTitle>CodeBlock</PageTitle>

      <Section title="Language Selector">
        <div className="mb-4 flex flex-wrap gap-2">
          {samples.map((s, i) => (
            <button
              key={s.language}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                i === active
                  ? "bg-primary-600 text-white"
                  : "bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300 dark:hover:bg-primary-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <CodeBlock code={current.code} language={current.language} />
      </Section>

      <Section title="Line Numbers">
        <CodeBlock code={tsExample} language="typescript" lineNumbers />
      </Section>

      <Section title="Sizes">
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs font-medium text-secondary-500">Small</p>
            <CodeBlock code={`const x = 42;\nconsole.log(x);`} language="typescript" size="sm" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-secondary-500">Medium (default)</p>
            <CodeBlock code={`const x = 42;\nconsole.log(x);`} language="typescript" size="md" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-secondary-500">Large</p>
            <CodeBlock code={`const x = 42;\nconsole.log(x);`} language="typescript" size="lg" />
          </div>
        </div>
      </Section>

      <Section title="Mixed: TSX with HTML + JS">
        <CodeBlock code={tsxExample} language="tsx" lineNumbers />
      </Section>

      <Section title="Vue SFC (HTML + TS + CSS)">
        <CodeBlock code={vueExample} language="vue" lineNumbers />
      </Section>

      <Section title="Live Editor (editable)">
        <div className="mb-3 flex items-center gap-3">
          <label className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Language:
          </label>
          <select
            value={editLang}
            onChange={(e) => setEditLang(e.target.value as CodeBlockLanguage)}
            className="rounded-md border border-primary-300 bg-white px-2 py-1 text-sm text-primary-800 dark:border-primary-600 dark:bg-primary-800 dark:text-primary-200"
          >
            {editableLangs.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <CodeBlock
          code={editCode}
          language={editLang}
          editable
          onCodeChange={setEditCode}
          lineNumbers
          className="min-h-50"
        />
        <p className="mt-2 text-xs text-secondary-400">
          Click inside the code block and start typing. Tab inserts 2 spaces.
        </p>
      </Section>
    </div>
  );
}
