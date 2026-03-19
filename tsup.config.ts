import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { defineConfig } from "tsup";

// Discover category entrypoints:
// - src/components/<Category>/index.ts               -> dist/<Category>/index.js
// - src/components/<Category>/<Component>/index.ts   -> dist/<Category>/<Component>.js
const categoryEntries = Object.fromEntries(
  readdirSync("src/components", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((categoryDir) => {
      const categoryName = categoryDir.name;
      const categoryRoot = join("src/components", categoryName);
      const entries: Array<[string, string]> = [];

      const categoryIndex = join(categoryRoot, "index.ts");
      if (existsSync(categoryIndex)) {
        entries.push([`${categoryName}/index`, categoryIndex]);
      }

      const componentEntries = readdirSync(categoryRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((componentDir) => {
          const componentIndex = join(categoryRoot, componentDir.name, "index.ts");
          if (!existsSync(componentIndex)) {
            return [];
          }

          return [[`${categoryName}/${componentDir.name}`, componentIndex] as [string, string]];
        });

      entries.push(...componentEntries);

      return entries;
    }),
);

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ...categoryEntries,
    utils: "src/lib/utils.ts",
    theme: "src/styles/theme.ts",
  },
  format: ["esm", "cjs"],
  experimentalDts: true,
  splitting: false,
  treeshake: true,
  minify: true,
  sourcemap: false,
  external: [
    "react",
    "react-dom",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "tailwind-merge",
    "shiki",
    "shiki/core",
    "shiki/engine/javascript",
    "@shikijs/langs",
    "@shikijs/langs/typescript",
    "@shikijs/langs/javascript",
    "@shikijs/langs/tsx",
    "@shikijs/langs/jsx",
    "@shikijs/langs/html",
    "@shikijs/langs/css",
    "@shikijs/langs/json",
    "@shikijs/langs/markdown",
    "@shikijs/langs/python",
    "@shikijs/langs/rust",
    "@shikijs/langs/go",
    "@shikijs/langs/java",
    "@shikijs/langs/c",
    "@shikijs/langs/cpp",
    "@shikijs/langs/csharp",
    "@shikijs/langs/vue",
    "@shikijs/langs/xml",
    "@shikijs/langs/yaml",
    "@shikijs/langs/sql",
    "@shikijs/langs/bash",
    "@shikijs/langs/shell",
  ],
  outDir: "dist",
  clean: true,
  target: "es2020",
  jsx: "automatic",
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name]-[hash]";
  },
});
