import { useState, useCallback } from "react";
import type { DateTimePickerProps, OffsetUnit, OffsetDirection } from "./types";
import {
  formatDate,
  getDefaultFormat,
  clampDate,
  applyOffset,
  getDaysInMonth,
} from "./DateTimePicker.utils";

export function useDateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    mode = "datetime",
    minDate,
    maxDate,
    use24Hour = true,
    showSeconds = true,
    locale = "en-US",
    format,
    onOpen,
    onClose,
  } = props;

  // ── Controlled vs. uncontrolled ──────────────────────────────────────────
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  // ── Popup state ───────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);

  // Working date (in-popup draft before confirming)
  const [workingDate, setWorkingDate] = useState<Date>(() => currentValue ?? new Date());

  // View: drum-roll columns vs. month calendar grid
  const [view, setView] = useState<"drum" | "calendar">("drum");

  // Calendar navigation state (independent from workingDate so we can browse months)
  const [calYear, setCalYear] = useState<number>(() => (currentValue ?? new Date()).getFullYear());
  const [calMonth, setCalMonth] = useState<number>(() => (currentValue ?? new Date()).getMonth());

  // Quick-offset controls
  const [offsetAmount, setOffsetAmount] = useState(1);
  const [offsetUnit, setOffsetUnit] = useState<OffsetUnit>("day");
  const [offsetDirection, setOffsetDirection] = useState<OffsetDirection>("future");

  // ── Derived display value ────────────────────────────────────────────────
  const displayFormat = format ?? getDefaultFormat(mode, use24Hour, showSeconds);
  const displayValue = currentValue ? formatDate(currentValue, displayFormat, locale) : "";

  // ── Open / close ──────────────────────────────────────────────────────────
  const openPicker = useCallback(() => {
    const base = currentValue ?? new Date();
    setWorkingDate(new Date(base));
    setCalYear(base.getFullYear());
    setCalMonth(base.getMonth());
    setView("drum");
    setIsOpen(true);
    onOpen?.();
  }, [currentValue, onOpen]);

  const closePicker = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  // ── Confirm / clear ──────────────────────────────────────────────────────
  const confirm = useCallback(() => {
    const clamped = clampDate(workingDate, minDate, maxDate);
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
    closePicker();
  }, [workingDate, minDate, maxDate, isControlled, onChange, closePicker]);

  const clear = useCallback(() => {
    if (!isControlled) setInternalValue(null);
    onChange?.(null);
    closePicker();
  }, [isControlled, onChange, closePicker]);

  // ── Update individual date/time fields ───────────────────────────────────
  const updateField = useCallback(
    (field: "year" | "month" | "day" | "hour" | "minute" | "second", val: number) => {
      setWorkingDate((prev) => {
        const next = new Date(prev);
        switch (field) {
          case "year":
            next.setFullYear(val);
            break;
          case "month": {
            next.setMonth(val);
            // Clamp day if required (e.g. Jan 31 → Feb → max 28/29)
            const maxDay = getDaysInMonth(next.getFullYear(), val);
            if (next.getDate() > maxDay) next.setDate(maxDay);
            break;
          }
          case "day":
            next.setDate(val);
            break;
          case "hour":
            next.setHours(val);
            break;
          case "minute":
            next.setMinutes(val);
            break;
          case "second":
            next.setSeconds(val);
            break;
        }
        return clampDate(next, minDate, maxDate);
      });
    },
    [minDate, maxDate],
  );

  // ── Quick offset ──────────────────────────────────────────────────────────
  const applyQuickOffset = useCallback(() => {
    const result = clampDate(
      applyOffset(new Date(), offsetAmount, offsetUnit, offsetDirection),
      minDate,
      maxDate,
    );
    setWorkingDate(result);
    setCalYear(result.getFullYear());
    setCalMonth(result.getMonth());
  }, [offsetAmount, offsetUnit, offsetDirection, minDate, maxDate]);

  // ── Calendar navigation ───────────────────────────────────────────────────
  const navigateCalendar = useCallback(
    (dir: -1 | 1) => {
      let m = calMonth + dir;
      let y = calYear;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (m > 11) {
        m = 0;
        y++;
      }
      setCalMonth(m);
      setCalYear(y);
    },
    [calMonth, calYear],
  );

  return {
    // State
    isOpen,
    displayValue,
    workingDate,
    view,
    calYear,
    calMonth,
    offsetAmount,
    offsetUnit,
    offsetDirection,
    // Derived
    mode,
    use24Hour,
    showSeconds,
    locale,
    minDate,
    maxDate,
    // Handlers
    openPicker,
    closePicker,
    confirm,
    clear,
    updateField,
    setView,
    setCalYear,
    setCalMonth,
    setOffsetAmount,
    setOffsetUnit,
    setOffsetDirection,
    applyQuickOffset,
    navigateCalendar,
  };
}
