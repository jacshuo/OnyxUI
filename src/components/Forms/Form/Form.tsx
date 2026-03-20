import React, { createContext, useCallback, useContext, useId, useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { formVariants, formValidationVariants } from "../../../styles/theme/form";

/* ── Types ────────────────────────────────────────────────── */

export type FormLayout = "stacked" | "inline";
export type FormSize = "sm" | "md" | "lg";
export type FormValidationStatus = "error" | "warning" | "success" | "hint";

/** Return value of a FormItem validation callback. */
export type ValidationResult = { result: boolean; reason: string };
/** Callback type for FormItem's `onValidate` prop. */
export type ValidateCallback = (value: unknown) => ValidationResult;

/**
 * Map of field names → ValidationResult returned from the `onValues` callback.
 * Form will automatically display these errors in the matching named FormItems.
 * Fields with `result: true` show a success message; `result: false` shows an error.
 */
export type BulkValidationResult = Record<string, ValidationResult>;

/* ── Context ──────────────────────────────────────────────── */

type FormCtx = {
  layout: FormLayout;
  size: FormSize;
  /** Width (CSS value) of the label column in inline layout. */
  labelWidth: string;
  /** Bulk errors pushed from the form's onValues callback, keyed by FormItem name. */
  bulkErrors: Record<string, FormValidation>;
};

const FormContext = createContext<FormCtx>({
  layout: "stacked",
  size: "md",
  labelWidth: "var(--form-label-w-md, 7rem)",
  bulkErrors: {},
});

const labelWidthMap: Record<FormSize, string> = {
  sm: "var(--form-label-w-sm, 5rem)",
  md: "var(--form-label-w-md, 7rem)",
  lg: "var(--form-label-w-lg, 9rem)",
};

const rowGapClass: Record<FormSize, string> = {
  sm: "gap-(--form-row-gap-sm)",
  md: "gap-(--form-row-gap-md)",
  lg: "gap-(--form-row-gap-lg)",
};

/* ── Form ─────────────────────────────────────────────────── */

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> &
  VariantProps<typeof formVariants> & {
    /**
     * Label + control layout for all FormItems.
     * - "stacked"  — label above control (default; always used on narrow viewports)
     * - "inline"   — label left, control right
     * @default "stacked"
     */
    layout?: FormLayout;
    /** Form heading rendered above all items. */
    title?: React.ReactNode;
    /** Optional descriptive text below the heading. */
    description?: React.ReactNode;
    /**
     * Footer slot — typically holds submit / reset buttons.
     * Rendered below all FormItems, separated by a top border.
     */
    footer?: React.ReactNode;
    /**
     * Called on form submit with a plain-object snapshot of all named
     * FormItem inputs (via the native FormData API).
     * Call `e.preventDefault()` inside this callback to prevent a page reload.
     *
     * May return (or resolve to) a `BulkValidationResult` to display
     * per-field errors/successes — Form automatically routes each entry
     * to the matching `<FormItem name="…">`.
     * Supports async (return a Promise).
     */
    onValues?: (
      values: Record<string, FormDataEntryValue>,
      event: React.FormEvent<HTMLFormElement>,
    ) => BulkValidationResult | void | Promise<BulkValidationResult | void>;
  };

export function Form({
  children,
  className,
  intent,
  size = "md",
  layout = "stacked",
  title,
  description,
  footer,
  onValues,
  onSubmit,
  ...props
}: FormProps) {
  const labelWidth = labelWidthMap[size ?? "md"];
  const [bulkErrors, setBulkErrors] = useState<Record<string, FormValidation>>({});

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // Always prevent native form navigation in an SPA context.
      // Consumers who want native submission should use a plain <form> instead.
      e.preventDefault();
      (onSubmit as React.FormEventHandler<HTMLFormElement> | undefined)?.(e);
      if (onValues) {
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        const maybePromise = onValues(data, e);
        const applyBulk = (result: BulkValidationResult | void) => {
          if (!result) return;
          const next: Record<string, FormValidation> = {};
          for (const [field, { result: ok, reason }] of Object.entries(result)) {
            if (reason) next[field] = { status: ok ? "success" : "error", message: reason };
          }
          setBulkErrors(next);
        };
        if (maybePromise instanceof Promise) {
          maybePromise.then(applyBulk).catch(() => {});
        } else {
          applyBulk(maybePromise);
        }
      }
    },
    [onSubmit, onValues],
  );

  return (
    <FormContext.Provider
      value={{ layout: layout ?? "stacked", size: size ?? "md", labelWidth, bulkErrors }}
    >
      <form
        className={cn(formVariants({ intent, size }), "flex flex-col", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-(--form-header-mb)">
            {title && (
              <h2 className="text-base font-semibold text-primary-900 dark:text-primary-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-primary-500 dark:text-primary-400">{description}</p>
            )}
          </div>
        )}

        {/* Items */}
        <div className={cn("flex flex-col", rowGapClass[size ?? "md"])}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-(--form-footer-pt) flex flex-wrap items-center justify-end gap-(--form-footer-gap) border-t border-primary-200 pt-(--form-footer-pt) dark:border-primary-700">
            {footer}
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
}

/* ── FormItem ─────────────────────────────────────────────── */

export type FormValidation = {
  /** Validation display status. Controls icon colour. */
  status: FormValidationStatus;
  /** Message text shown below the control. */
  message: string;
};

export type FormItemProps = {
  /** Label text or element. Pass a string for automatic htmlFor wiring. */
  label?: React.ReactNode;
  /**
   * Override the inherited layout from Form.
   * Useful when a specific item needs to differ from the rest.
   */
  layout?: FormLayout;
  /** Whether the field is required (adds a red asterisk after the label). */
  required?: boolean;
  /** Additional hint text rendered below the control (below validation if both present). */
  hint?: React.ReactNode;
  /** Externally controlled validation result. Takes precedence over `onValidate`. */
  validation?: FormValidation;
  /**
   * Field name used by the native FormData API when the Form's `onValues`
   * callback is used. Injected into the first child element automatically.
   */
  name?: string;
  /**
   * Validation callback. Called with the current value on every change.
   * Return `{ result: true, reason: "" }` for success or
   * `{ result: false, reason: "Error message" }` for error.
   */
  onValidate?: ValidateCallback;
  /** Extra class on the wrapper div. */
  className?: string;
  children: React.ReactNode;
};

const validationIcon: Record<FormValidationStatus, React.ReactNode> = {
  error: <AlertCircle />,
  warning: <AlertTriangle />,
  success: <CheckCircle />,
  hint: <Info />,
};

export function FormItem({
  label,
  layout: itemLayout,
  required,
  hint,
  validation,
  name,
  onValidate,
  className,
  children,
}: FormItemProps) {
  const ctx = useContext(FormContext);
  const id = useId();
  const [internalValidation, setInternalValidation] = useState<FormValidation | undefined>(
    undefined,
  );

  // Priority: external `validation` prop > onValidate result > bulk error from onValues
  const bulkError = name ? ctx.bulkErrors[name] : undefined;
  const effectiveValidation = validation ?? internalValidation ?? bulkError;

  // On mobile always stacked; on md+ use the form-level layout (or item override)
  const layout = itemLayout ?? ctx.layout;
  const isInline = layout === "inline";

  const handleChange = useCallback(
    (e: unknown) => {
      const val =
        e != null && typeof e === "object" && "target" in (e as object)
          ? (e as React.ChangeEvent<HTMLInputElement>).target.value
          : e;
      // Clear any bulk error for this field once the user edits
      if (name && ctx.bulkErrors[name]) {
        ctx.bulkErrors[name] = undefined as unknown as FormValidation;
      }
      if (!onValidate) {
        setInternalValidation(undefined);
        return;
      }
      const { result, reason } = onValidate(val);
      setInternalValidation(
        reason ? { status: result ? "success" : "error", message: reason } : undefined,
      );
    },
    [onValidate, name, ctx.bulkErrors],
  );

  // Clone child to inject id/aria-describedby/name automatically
  const ariaId = effectiveValidation ? `${id}-validation` : hint ? `${id}-hint` : undefined;
  const childWithId = React.Children.map(children, (child, i) => {
    if (i !== 0 || !React.isValidElement(child)) return child;
    const el = child as React.ReactElement<Record<string, unknown>>;
    const injectProps: Record<string, unknown> = {};
    if (!el.props["id"]) injectProps["id"] = id;
    if (ariaId && !el.props["aria-describedby"]) injectProps["aria-describedby"] = ariaId;
    if (effectiveValidation?.status === "error" && !el.props["aria-invalid"])
      injectProps["aria-invalid"] = true;
    if (name && !el.props["name"]) injectProps["name"] = name;
    if (onValidate) {
      const orig = el.props["onChange"] as ((e: unknown) => void) | undefined;
      injectProps["onChange"] = (e: unknown) => {
        orig?.(e);
        handleChange(e);
      };
    }
    return Object.keys(injectProps).length ? React.cloneElement(el, injectProps) : child;
  });

  const labelEl = label != null && (
    <label
      htmlFor={id}
      className={cn(
        "shrink-0 text-sm font-medium",
        "text-primary-700 dark:text-primary-300",
        required && "after:ml-0.5 after:text-danger-500 after:content-['*']",
        isInline && "pt-1.75", // vertically align with h-9 input
      )}
      style={isInline ? { width: ctx.labelWidth, minWidth: ctx.labelWidth } : undefined}
    >
      {label}
    </label>
  );

  const messageId = validation ? `${id}-validation` : hint ? `${id}-hint` : undefined;

  return (
    <div
      className={cn(
        // Base: stacked. On md+ switch to inline when layout === "inline"
        "flex w-full flex-col gap-1.5",
        isInline && "md:flex-row md:items-start md:gap-(--form-item-gap-md)",
        className,
      )}
    >
      {labelEl}

      {/* Control area: grows to fill remaining space */}
      <div className="flex min-w-0 flex-1 flex-col">
        {childWithId}

        {/* Validation message */}
        {effectiveValidation && (
          <p
            id={`${id}-validation`}
            className={cn(formValidationVariants({ status: effectiveValidation.status }))}
            role={effectiveValidation.status === "error" ? "alert" : undefined}
          >
            {validationIcon[effectiveValidation.status]}
            <span>{effectiveValidation.message}</span>
          </p>
        )}

        {/* Hint text (shown even when no validation) */}
        {hint && (
          <p
            id={messageId === `${id}-hint` ? messageId : undefined}
            className="mt-1 text-xs text-primary-400 dark:text-primary-500"
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── FormSection ──────────────────────────────────────────── */

/**
 * Optional grouping element inside a Form.
 * Renders a subtle heading + divider, then its children as a nested column.
 */
export type FormSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function FormSection({ title, description, className, children }: FormSectionProps) {
  const { size } = useContext(FormContext);
  return (
    <fieldset
      className={cn(
        "flex flex-col rounded-(--form-radius) border border-primary-200 p-4 dark:border-primary-700",
        rowGapClass[size],
        className,
      )}
    >
      {(title || description) && (
        <legend className="px-1.5 pb-1">
          {title && (
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {title}
            </span>
          )}
          {description && (
            <span className="ml-2 text-xs text-primary-400 dark:text-primary-500">
              {description}
            </span>
          )}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
