import { cva } from 'class-variance-authority';

// ─── Button
export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      intent: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
        warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700',
        ghost:
          'bg-transparent text-primary-700 hover:bg-primary-100 active:bg-primary-200 dark:text-primary-300 dark:hover:bg-primary-800',
        outline:
          'border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-800',
      },
      size: {
        sm: 'h-7 px-3 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5',
        md: 'h-9 px-4 text-sm [&_svg]:h-4 [&_svg]:w-4',
        lg: 'h-11 px-6 text-base [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  },
);

// ─── Badge
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-xs font-semibold [&_svg]:h-3 [&_svg]:w-3 [&_svg]:shrink-0',
  {
    variants: {
      intent: {
        success:
          'border-success-200 bg-success-100 text-success-800 dark:border-success-800 dark:bg-success-900/30 dark:text-success-400',
        warning:
          'border-warning-200 bg-warning-100 text-warning-800 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
        error:
          'border-danger-200 bg-danger-100 text-danger-800 dark:border-danger-800 dark:bg-danger-900/30 dark:text-danger-400',
        info: 'border-primary-200 bg-primary-100 text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
        primary:
          'border-secondary-200 bg-secondary-100 text-secondary-700 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
      },
    },
    defaultVariants: { intent: 'primary' },
  },
);

// ─── Input
export const inputVariants = cva(
  'w-full rounded-md border bg-white text-secondary-900 transition-colors placeholder:text-secondary-400 focus:outline-none focus:ring-2 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder:text-secondary-600',
  {
    variants: {
      state: {
        default:
          'border-secondary-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-secondary-600',
        error: 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20',
      },
      size: {
        sm: 'h-7 px-2 text-xs',
        md: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
      },
    },
    defaultVariants: { state: 'default', size: 'md' },
  },
);

// ─── Label
export const labelVariants = cva('inline-flex items-center gap-1 font-medium [&_svg]:shrink-0', {
  variants: {
    size: {
      sm: 'text-xs [&_svg]:h-3 [&_svg]:w-3',
      md: 'text-sm [&_svg]:h-3.5 [&_svg]:w-3.5',
      lg: 'text-base [&_svg]:h-4 [&_svg]:w-4',
    },
    intent: {
      default: 'text-primary-700 dark:text-primary-300',
      muted: 'text-primary-400 dark:text-primary-500',
      required:
        "text-primary-700 dark:text-primary-300 after:ml-0.5 after:text-danger-500 after:content-['*']",
    },
  },
  defaultVariants: { size: 'md', intent: 'default' },
});

// ─── Card
export const cardVariants = cva('rounded-lg transition-shadow', {
  variants: {
    intent: {
      default: 'border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900',
      elevated: 'bg-white shadow-md hover:shadow-lg dark:bg-primary-900',
      outlined: 'border-2 border-primary-300 bg-transparent dark:border-primary-600',
      ghost: 'bg-primary-50 dark:bg-primary-800/50',
    },
    size: {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    },
  },
  defaultVariants: { intent: 'default', size: 'md' },
});

// ─── Panel
export const panelVariants = cva('rounded-md', {
  variants: {
    intent: {
      default: 'border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900',
      inset: 'bg-primary-50 dark:bg-primary-800/50',
      elevated: 'bg-white shadow-lg dark:bg-primary-900',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: { intent: 'default', size: 'md' },
});

// ─── Table
export const tableVariants = cva('w-full text-left text-sm', {
  variants: {
    intent: {
      default: '',
      striped:
        '[&_tbody_tr:nth-child(even)]:bg-primary-50 dark:[&_tbody_tr:nth-child(even)]:bg-primary-800/30',
      bordered:
        '[&_th]:border [&_td]:border [&_th]:border-primary-200 [&_td]:border-primary-200 dark:[&_th]:border-primary-700 dark:[&_td]:border-primary-700',
    },
  },
  defaultVariants: { intent: 'default' },
});

// ─── List
export const listVariants = cva('text-sm text-primary-700 dark:text-primary-300', {
  variants: {
    intent: {
      default: 'space-y-1',
      bordered:
        'divide-y divide-primary-200 rounded-lg border border-primary-200 dark:divide-primary-700 dark:border-primary-700 [&>li]:px-4 [&>li]:py-2',
      hover:
        '[&>li]:rounded-md [&>li]:px-3 [&>li]:py-2 [&>li]:transition-colors [&>li:hover]:bg-primary-50 dark:[&>li:hover]:bg-primary-800/50',
    },
  },
  defaultVariants: { intent: 'default' },
});

// ─── Accordion
export const accordionVariants = cva('divide-y', {
  variants: {
    intent: {
      default: 'divide-primary-300 dark:divide-primary-700',
      bordered:
        'divide-primary-300 rounded-lg border border-primary-300 bg-white px-3 shadow-sm dark:divide-primary-700 dark:border-primary-700 dark:bg-primary-800/50',
      ghost: 'divide-transparent',
    },
  },
  defaultVariants: { intent: 'default' },
});

// ─── Tabs
export const tabListVariants = cva('flex', {
  variants: {
    intent: {
      line: 'border-b border-primary-200 dark:border-primary-700',
      pills: 'gap-1 rounded-lg bg-primary-100 p-1 dark:bg-primary-800',
      underline: 'gap-4',
    },
  },
  defaultVariants: { intent: 'line' },
});

export const tabTriggerVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
  {
    variants: {
      intent: {
        line: 'text-primary-500 hover:text-primary-700 data-[active=true]:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 dark:data-[active=true]:text-primary-100',
        pills:
          'rounded-md text-primary-600 hover:text-primary-900 data-[active=true]:bg-white data-[active=true]:text-primary-900 data-[active=true]:shadow-sm dark:text-primary-400 dark:hover:text-primary-100 dark:data-[active=true]:bg-primary-700 dark:data-[active=true]:text-primary-100',
        underline:
          'text-primary-500 hover:text-primary-700 data-[active=true]:text-primary-900 dark:text-primary-400 dark:data-[active=true]:text-primary-100',
      },
    },
    defaultVariants: { intent: 'line' },
  },
);

// ─── Dialog
export const dialogContentVariants = cva('rounded-lg bg-white p-6 shadow-xl dark:bg-primary-900', {
  variants: {
    size: {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-lg',
      lg: 'w-full max-w-2xl',
      xl: 'w-full max-w-4xl',
      full: 'h-[calc(100vh-4rem)] w-[calc(100vw-4rem)]',
    },
  },
  defaultVariants: { size: 'md' },
});

// ─── Tooltip
export const tooltipVariants = cva(
  'absolute z-50 rounded px-2 py-1 text-xs shadow-md animate-fade-in',
  {
    variants: {
      intent: {
        default: 'bg-primary-900 text-white dark:bg-primary-100 dark:text-primary-900',
        light:
          'border border-primary-200 bg-white text-primary-700 dark:border-primary-600 dark:bg-primary-800 dark:text-primary-200',
      },
    },
    defaultVariants: { intent: 'default' },
  },
);

// ─── Alert
export const alertVariants = cva(
  'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      intent: {
        success:
          'border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-900/80 dark:text-success-200',
        warning:
          'border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-900/80 dark:text-warning-200',
        error:
          'border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-800 dark:bg-danger-900/80 dark:text-danger-200',
        info: 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-900/80 dark:text-primary-200',
      },
    },
    defaultVariants: { intent: 'info' },
  },
);
