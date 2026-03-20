import { cva } from "class-variance-authority";

export const progressBarVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-primary-200 dark:bg-primary-700",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
      intent: {
        primary: "[&_.progress-fill]:bg-primary-500",
        success: "[&_.progress-fill]:bg-success-500",
        warning: "[&_.progress-fill]:bg-warning-500",
        danger: "[&_.progress-fill]:bg-danger-500",
      },
      edge: {
        none: "rounded-full",
        top: "fixed top-0 left-0 right-0 z-50 rounded-none",
        bottom: "fixed bottom-0 left-0 right-0 z-50 rounded-none",
      },
    },
    defaultVariants: { size: "md", intent: "primary", edge: "none" },
  },
);

export const spinVariants = cva("text-primary-500 dark:text-primary-400", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
});

export const alertVariants = cva(
  "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      intent: {
        success:
          "border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-900/80 dark:text-success-200",
        warning:
          "border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-900/80 dark:text-warning-200",
        error:
          "border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-800 dark:bg-danger-900/80 dark:text-danger-200",
        info: "border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-900/80 dark:text-primary-200",
      },
    },
    defaultVariants: { intent: "info" },
  },
);
