import { cva } from "class-variance-authority";

export const tableVariants = cva("w-full text-left text-sm", {
  variants: {
    intent: {
      default: "",
      striped:
        "[&_tbody_tr:nth-child(even)]:bg-primary-50 dark:[&_tbody_tr:nth-child(even)]:bg-primary-800/30",
      bordered:
        "[&_th]:border [&_td]:border [&_th]:border-primary-200 [&_td]:border-primary-200 dark:[&_th]:border-primary-700 dark:[&_td]:border-primary-700",
    },
    density: {
      compact: "[&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1",
      default: "",
      relaxed: "[&_th]:px-6 [&_th]:py-5 [&_td]:px-6 [&_td]:py-5",
    },
  },
  defaultVariants: { intent: "default", density: "default" },
});

export const listVariants = cva("text-sm text-primary-700 dark:text-primary-300", {
  variants: {
    intent: {
      default: "space-y-1",
      bordered:
        "divide-y divide-primary-200 rounded-lg border border-primary-200 dark:divide-primary-700 dark:border-primary-700 [&>li]:px-4 [&>li]:py-2",
      hover:
        "[&>li]:rounded-md [&>li]:px-3 [&>li]:py-2 [&>li]:transition-colors [&>li:hover]:bg-primary-50 dark:[&>li:hover]:bg-primary-800/50",
    },
  },
  defaultVariants: { intent: "default" },
});

export const listItemVariants = cva(
  "group flex w-full items-center gap-1.5 text-left [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "py-0.5 text-xs [&_svg]:h-3 [&_svg]:w-3",
        md: "py-1.5 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5",
        lg: "py-2 text-base [&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const treeItemVariants = cva(
  "flex cursor-pointer items-center gap-1 rounded transition-colors [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "py-0.5 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "py-1 text-sm [&_svg]:h-4 [&_svg]:w-4",
        lg: "py-1.5 text-base [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const codeBlockVariants = cva(
  "overflow-x-auto rounded-lg font-mono [background:var(--color-syntax-bg)] [&_pre]:m-0 [&_pre]:p-4 [&_code]:bg-transparent",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);
