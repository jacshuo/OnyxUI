export type DateTimeMode = "date" | "time" | "datetime";
export type OffsetUnit = "day" | "week" | "month" | "year";
export type OffsetDirection = "future" | "past";

export interface DateTimePickerProps {
  /** Controlled selected date/time value. */
  value?: Date | null;
  /** Uncontrolled initial value. */
  defaultValue?: Date | null;
  /** Called when the user confirms a new selection. */
  onChange?: (date: Date | null) => void;
  /** Picker mode: date only, time only, or full datetime. Default "datetime". */
  mode?: DateTimeMode;
  /** Minimum selectable date (inclusive). */
  minDate?: Date;
  /** Maximum selectable date (inclusive). */
  maxDate?: Date;
  /** Disable the trigger and prevent all interaction. */
  disabled?: boolean;
  /** Placeholder text in the trigger when no value is selected. */
  placeholder?: string;
  /**
   * Display-format string.
   * Tokens: YYYY YY MMMM MMM MM M DD D HH H hh h mm ss A a
   * @example "YYYY-MM-DD HH:mm:ss"
   */
  format?: string;
  /** Use 24-hour clock. false → 12-hour with AM/PM column. Default true. */
  use24Hour?: boolean;
  /** Show seconds column when mode includes time. Default true. */
  showSeconds?: boolean;
  /** BCP-47 locale tag for month/weekday names. Default "en-US". */
  locale?: string;
  /** Extra class applied to the root wrapper element. */
  className?: string;
  /** Extra class applied to the frosted-glass popup panel. */
  popupClassName?: string;
  /** Extra class applied to the trigger button. */
  triggerClassName?: string;
  /** Called when the picker popup opens. */
  onOpen?: () => void;
  /** Called when the picker popup closes (cancel OR confirm). */
  onClose?: () => void;
}
