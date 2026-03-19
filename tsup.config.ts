import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { defineConfig } from "tsup";

// Discover category entrypoints:
// - src/components/<Category>/index.ts               -> dist/<Category>.js
// - src/components/<Category>/<Component>/index.ts   -> dist/<Category>/<Component>.js
const categoryEntries = Object.fromEntries(
  readdirSync("src/components", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => entry.name !== "Form")
    .flatMap((categoryDir) => {
      const categoryName = categoryDir.name;
      const categoryRoot = join("src/components", categoryName);
      const entries: Array<[string, string]> = [];

      const categoryIndex = join(categoryRoot, "index.ts");
      if (existsSync(categoryIndex)) {
        entries.push([categoryName, categoryIndex]);
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
  dts: true,
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
  ],
  outDir: "dist",
  clean: true,
  target: "es2020",
  jsx: "automatic",
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name]-[hash]";
  },
});
