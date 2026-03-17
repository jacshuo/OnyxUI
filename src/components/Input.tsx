import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { inputVariants } from '../styles/theme';

type InputVariants = VariantProps<typeof inputVariants>;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  state?: InputVariants['state'];
  inputSize?: InputVariants['size'];
  /** Icon or label shown at the start of the input with a highlighted background */
  prefix?: React.ReactNode;
  /** Icon shown inside the input at the end (non-interactive decoration) */
  suffix?: React.ReactNode;
  /** Clickable action button rendered at the end of the input */
  action?: {
    icon: React.ReactNode;
    onClick: () => void;
    'aria-label'?: string;
  };
};

const sizeMap = {
  sm: { wrapper: 'h-7 text-xs', prefix: 'px-2 text-xs [&_svg]:h-3 [&_svg]:w-3', input: 'px-2 text-xs', icon: 'px-1.5 [&_svg]:h-3 [&_svg]:w-3' },
  md: { wrapper: 'h-9 text-sm', prefix: 'px-3 text-sm [&_svg]:h-4 [&_svg]:w-4', input: 'px-3 py-2 text-sm', icon: 'px-2 [&_svg]:h-4 [&_svg]:w-4' },
  lg: { wrapper: 'h-11 text-base', prefix: 'px-4 text-base [&_svg]:h-5 [&_svg]:w-5', input: 'px-4 py-2.5 text-base', icon: 'px-2.5 [&_svg]:h-5 [&_svg]:w-5' },
} as const;

const stateMap = {
  default: 'border-secondary-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-secondary-600',
  error: 'border-danger-400 focus-within:border-danger-500 focus-within:ring-2 focus-within:ring-danger-500/20',
} as const;

export function Input({
  state = 'default',
  inputSize = 'md',
  className,
  prefix,
  suffix,
  action,
  ...props
}: InputProps) {
  // Simple path — no prefix/suffix/action, render plain <input>
  if (!prefix && !suffix && !action) {
    return <input className={cn(inputVariants({ state, size: inputSize }), className)} {...props} />;
  }

  const sz = sizeMap[inputSize ?? 'md'];
  const st = stateMap[state ?? 'default'];

  return (
    <div
      className={cn(
        'flex w-full items-center overflow-hidden rounded-md border bg-white transition-colors dark:bg-secondary-900',
        sz.wrapper,
        st,
        className,
      )}
    >
      {prefix && (
        <span
          className={cn(
            'flex shrink-0 items-center gap-1.5 self-stretch border-r border-secondary-300 bg-secondary-50 font-medium text-secondary-600 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-300',
            sz.prefix,
          )}
        >
          {prefix}
        </span>
      )}
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-secondary-900 placeholder:text-secondary-400 focus:outline-none dark:text-secondary-100 dark:placeholder:text-secondary-600',
          sz.input,
          prefix && 'pl-2',
        )}
        {...props}
      />
      {suffix && (
        <span
          className={cn(
            'pointer-events-none flex shrink-0 items-center text-secondary-400 dark:text-secondary-500',
            sz.icon,
          )}
        >
          {suffix}
        </span>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          aria-label={action['aria-label'] ?? 'Action'}
          className={cn(
            'flex shrink-0 items-center text-secondary-500 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400',
            sz.icon,
          )}
        >
          {action.icon}
        </button>
      )}
    </div>
  );
}
