import { cva } from "class-variance-authority";

export const otpInputVariants = cva(
  "w-full rounded-md font-mono text-center transition-all focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 w-9 text-sm",
        md: "h-12 w-12 text-base",
        lg: "h-14 w-14 text-lg",
      },
      variant: {
        outline:
          "border border-secondary-300 bg-transparent focus:border-primary-500 focus:ring-primary-500/20 dark:border-secondary-600 dark:bg-transparent dark:focus:border-primary-400",
        filled:
          "border border-transparent bg-secondary-100 focus:border-primary-500 focus:ring-primary-500/20 dark:bg-secondary-800 dark:focus:border-primary-400",
        underline:
          "rounded-none border-0 border-b-2 border-secondary-300 bg-transparent px-0 focus:border-primary-500 focus:ring-0 dark:border-secondary-600 dark:focus:border-primary-400",
      },
      invalid: {
        true: "border-danger-400 focus:border-danger-500 focus:ring-danger-500/20",
        false: "",
      },
    },
    defaultVariants: { size: "md", variant: "outline", invalid: false },
  },
);

export const formVariants = cva("w-full", {
  variants: {
    intent: {
      default: "",
      card: "rounded-(--form-radius) border border-primary-200 bg-white p-6 shadow-sm dark:border-primary-700 dark:bg-primary-900",
      inset: "rounded-(--form-radius) bg-primary-50 p-6 dark:bg-primary-800/50",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: { intent: "default", size: "md" },
});

export const formItemVariants = cva("flex w-full", {
  variants: {
    layout: {
      stacked: "flex-col gap-1.5",
      inline: "flex-row items-start gap-(--form-item-gap-md)",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: { layout: "stacked", size: "md" },
});

export const formValidationVariants = cva(
  "mt-1 flex items-center gap-1 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0",
  {
    variants: {
      status: {
        error: "text-danger-600 dark:text-danger-400",
        warning: "text-warning-600 dark:text-warning-400",
        success: "text-success-600 dark:text-success-400",
        hint: "text-primary-400 dark:text-primary-500",
      },
    },
    defaultVariants: { status: "hint" },
  },
);
