import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useDateTimePicker } from "./DateTimePicker.logic";
import { useOutsideClick, useScrollColumn, usePositioning, ITEM_H } from "./DateTimePicker.hooks";
import {
  getCalendarDays,
  getWeekdayNames,
  getMonthNames,
  getDaysInMonth,
  getYearRange,
  isSameDay,
  isToday,
  isBeforeDay,
  isAfterDay,
} from "./DateTimePicker.utils";
import type { DateTimePickerProps, OffsetUnit, OffsetDirection } from "./types";
import "./DateTimePicker.css";

// ─── Internal: Drum-roll scroll column ──────────────────────────────────────

interface ScrollColumnProps {
  items: { label: string; value: number }[];
  selectedValue: number;
  onSelect: (value: number) => void;
  label?: string;
}

function ScrollColumn({ items, selectedValue, onSelect, label }: ScrollColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef(selectedValue);
  const userScrollingRef = useRef(false);

  const { scrollToIndex, handleScroll } = useScrollColumn(containerRef, items.length, (idx) => {
    const item = items[idx];
    if (item) {
      userScrollingRef.current = true;
      onSelect(item.value);
      // Reset after parent re-renders
      setTimeout(() => {
        userScrollingRef.current = false;
      }, 200);
    }
  });

  // Initial scroll on mount (instant, no animation)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = items.findIndex((i) => i.value === selectedValue);
    if (idx >= 0) el.scrollTop = idx * ITEM_H;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll when selectedValue changes externally (parent clamp, etc.)
  useEffect(() => {
    if (prevValueRef.current === selectedValue) return;
    prevValueRef.current = selectedValue;
    if (!userScrollingRef.current) {
      const idx = items.findIndex((i) => i.value === selectedValue);
      if (idx >= 0) scrollToIndex(idx, "smooth");
    }
  }, [selectedValue, items, scrollToIndex]);

  return (
    <div className="dtp-column" role="group" aria-label={label}>
      {/* Centre highlight band */}
      <div className="dtp-column-highlight" aria-hidden="true" />

      <div
        ref={containerRef}
        className="dtp-column-list"
        onScroll={handleScroll}
        role="listbox"
        aria-label={label}
      >
        {items.map((item) => (
          <div
            key={item.value}
            className={cn("dtp-item", item.value === selectedValue && "dtp-item--selected")}
            onClick={() => {
              const idx = items.findIndex((i) => i.value === item.value);
              if (idx >= 0) scrollToIndex(idx, "smooth");
              onSelect(item.value);
            }}
            role="option"
            aria-selected={item.value === selectedValue}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Gradient fades */}
      <div className="dtp-fade-top" aria-hidden="true" />
      <div className="dtp-fade-bottom" aria-hidden="true" />
    </div>
  );
}

// ─── Internal: Calendar month grid ──────────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date;
  today: Date;
  minDate?: Date;
  maxDate?: Date;
  locale: string;
  onSelectDay: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarGrid({
  year,
  month,
  selectedDate,
  today,
  minDate,
  maxDate,
  locale,
  onSelectDay,
  onPrev,
  onNext,
}: CalendarGridProps) {
  const weekdays = getWeekdayNames(locale, "narrow");
  const monthNames = getMonthNames(locale, "long");
  const days = getCalendarDays(year, month);

  return (
    <div className="dtp-calendar">
      {/* Month navigation header */}
      <div className="dtp-cal-nav">
        <button
          type="button"
          className="dtp-cal-nav-btn"
          onClick={onPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="dtp-cal-title">
          {monthNames[month]} {year}
        </span>
        <button type="button" className="dtp-cal-nav-btn" onClick={onNext} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday column headers */}
      <div className="dtp-cal-weekdays" role="row">
        {weekdays.map((wd, i) => (
          <div key={i} className="dtp-cal-weekday" role="columnheader" aria-label={wd}>
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="dtp-cal-days" role="grid">
        {days.map(({ date, thisMonth }, i) => {
          const selected = isSameDay(date, selectedDate);
          const todayDate = isSameDay(date, today);
          const disabled =
            (minDate != null && isBeforeDay(date, minDate)) ||
            (maxDate != null && isAfterDay(date, maxDate));

          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              className={cn(
                "dtp-cal-day",
                !thisMonth && "dtp-cal-day--other",
                selected && "dtp-cal-day--selected",
                todayDate && !selected && "dtp-cal-day--today",
                disabled && "dtp-cal-day--disabled",
              )}
              onClick={() => !disabled && onSelectDay(date)}
              disabled={disabled}
              aria-current={todayDate ? "date" : undefined}
              aria-selected={selected}
              aria-disabled={disabled}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Internal: Quick date offset row ────────────────────────────────────────

interface QuickOffsetProps {
  amount: number;
  unit: OffsetUnit;
  direction: OffsetDirection;
  onAmountChange: (n: number) => void;
  onUnitChange: (u: OffsetUnit) => void;
  onDirectionChange: (d: OffsetDirection) => void;
  onApply: () => void;
  locale: string;
}

function QuickOffsetRow({
  amount,
  unit,
  direction,
  onAmountChange,
  onUnitChange,
  onDirectionChange,
  onApply,
  locale,
}: QuickOffsetProps) {
  const isZh = locale.startsWith("zh");

  const units: { value: OffsetUnit; label: string }[] = [
    { value: "day", label: isZh ? "天" : "Day" },
    { value: "week", label: isZh ? "周" : "Week" },
    { value: "month", label: isZh ? "月" : "Month" },
    { value: "year", label: isZh ? "年" : "Year" },
  ];

  const directions: { value: OffsetDirection; label: string }[] = [
    { value: "future", label: isZh ? "以后" : "from now" },
    { value: "past", label: isZh ? "以前" : "before now" },
  ];

  return (
    <div className="dtp-quick-offset" aria-label={isZh ? "快速偏移" : "Quick offset"}>
      <input
        type="number"
        className="dtp-offset-input"
        value={amount}
        min={1}
        max={9999}
        aria-label={isZh ? "偏移数量" : "Offset amount"}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= 1) onAmountChange(n);
        }}
      />
      <select
        className="dtp-offset-select"
        value={unit}
        aria-label={isZh ? "偏移单位" : "Offset unit"}
        onChange={(e) => onUnitChange(e.target.value as OffsetUnit)}
      >
        {units.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>
      <select
        className="dtp-offset-select"
        value={direction}
        aria-label={isZh ? "偏移方向" : "Offset direction"}
        onChange={(e) => onDirectionChange(e.target.value as OffsetDirection)}
      >
        {directions.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
      <button type="button" className="dtp-offset-apply" onClick={onApply}>
        {isZh ? "应用" : "Apply"}
      </button>
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

export function DateTimePicker({
  className,
  popupClassName,
  triggerClassName,
  disabled = false,
  placeholder,
  ...restProps
}: DateTimePickerProps) {
  const {
    isOpen,
    displayValue,
    workingDate,
    view,
    calYear,
    calMonth,
    offsetAmount,
    offsetUnit,
    offsetDirection,
    mode,
    use24Hour,
    showSeconds,
    locale,
    minDate,
    maxDate,
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
  } = useDateTimePicker({ disabled, placeholder, ...restProps });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // Close on outside click
  useOutsideClick([triggerRef, popupRef], closePicker, isOpen);
  // Anchor-based popup positioning (desktop)
  usePositioning(triggerRef, popupRef, isOpen);

  const isZh = locale.startsWith("zh");
  const labels = {
    cancel: isZh ? "取消" : "Cancel",
    confirm: isZh ? "确定" : "Confirm",
    calendarView: isZh ? "日历" : "Calendar",
    scrollView: isZh ? "滚轮" : "Scroll",
    placeholder: placeholder ?? (isZh ? "选择日期时间" : "Select date / time"),
  };

  const showDate = mode === "date" || mode === "datetime";
  const showTime = mode === "time" || mode === "datetime";

  // ── Build drum-roll column item arrays ────────────────────────────────────
  const years = getYearRange(workingDate.getFullYear(), 200).map((y) => ({
    label: String(y),
    value: y,
  }));

  const months = getMonthNames(locale, "short").map((name, i) => ({
    label: name,
    value: i,
  }));

  const daysInMonth = getDaysInMonth(workingDate.getFullYear(), workingDate.getMonth());
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: i + 1,
  }));

  const hours24 = Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, "0"),
    value: i,
  }));

  const hours12 = Array.from({ length: 12 }, (_, i) => ({
    label: String(i === 0 ? 12 : i).padStart(2, "0"),
    value: i,
  }));

  const meridiems = [
    { label: "AM", value: 0 },
    { label: "PM", value: 1 },
  ];

  const minuteSecondItems = Array.from({ length: 60 }, (_, i) => ({
    label: String(i).padStart(2, "0"),
    value: i,
  }));

  const currentHour = workingDate.getHours();
  const currentHour12 = currentHour % 12;
  const currentMeridiem = currentHour < 12 ? 0 : 1;

  // ── Trigger Icon ──────────────────────────────────────────────────────────
  const TriggerIcon = showTime && !showDate ? Clock : Calendar;

  return (
    <div className={cn("dtp-root", className)}>
      {/* ── Trigger area ────────────────────────────────────────────────── */}
      {/* Wrap in a relative container so the clear <button> can be a
          sibling of the trigger <button> (avoiding interactive-in-interactive). */}
      <div className="dtp-trigger-wrap">
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "dtp-trigger",
            displayValue && "dtp-trigger--has-clear",
            disabled && "dtp-trigger--disabled",
            triggerClassName,
          )}
          onClick={() => !disabled && (isOpen ? closePicker() : openPicker())}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <TriggerIcon className="dtp-trigger-icon" aria-hidden="true" />
          <span className={cn("dtp-trigger-text", !displayValue && "dtp-trigger-placeholder")}>
            {displayValue || labels.placeholder}
          </span>
        </button>

        {/* Clear button — sibling of trigger (not nested inside it) */}
        {displayValue && (
          <button
            type="button"
            className="dtp-trigger-clear"
            aria-label={isZh ? "清除" : "Clear value"}
            onClick={() => !disabled && clear()}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Popup (portal) ──────────────────────────────────────────────── */}
      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            className={cn("dtp-panel", popupClassName)}
            role="dialog"
            aria-modal="true"
            aria-label={isZh ? "日期时间选择器" : "Date time picker"}
          >
            {/* Panel header */}
            <div className="dtp-panel-header">
              <span className="dtp-panel-preview">{displayValue || labels.placeholder}</span>
              <div className="dtp-panel-actions">
                {showDate && (
                  <button
                    type="button"
                    className={cn("dtp-view-btn", view === "calendar" && "dtp-view-btn--active")}
                    aria-pressed={view === "calendar"}
                    title={view === "calendar" ? labels.scrollView : labels.calendarView}
                    onClick={() => {
                      if (view !== "calendar") {
                        setCalYear(workingDate.getFullYear());
                        setCalMonth(workingDate.getMonth());
                      }
                      setView(view === "calendar" ? "drum" : "calendar");
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Panel body */}
            <div className="dtp-panel-body">
              {view === "drum" ? (
                /* ── Drum-roll view ──────────────────────────────────── */
                <div className="dtp-drum">
                  {showDate && (
                    <div className="dtp-drum-date">
                      <ScrollColumn
                        label={isZh ? "年" : "Year"}
                        items={years}
                        selectedValue={workingDate.getFullYear()}
                        onSelect={(v) => updateField("year", v)}
                      />
                      <ScrollColumn
                        label={isZh ? "月" : "Month"}
                        items={months}
                        selectedValue={workingDate.getMonth()}
                        onSelect={(v) => updateField("month", v)}
                      />
                      <ScrollColumn
                        label={isZh ? "日" : "Day"}
                        items={days}
                        selectedValue={workingDate.getDate()}
                        onSelect={(v) => updateField("day", v)}
                      />
                    </div>
                  )}

                  {showDate && showTime && <div className="dtp-drum-sep" aria-hidden="true" />}

                  {showTime && (
                    <div className="dtp-drum-time">
                      {use24Hour ? (
                        <ScrollColumn
                          label={isZh ? "时" : "Hour"}
                          items={hours24}
                          selectedValue={currentHour}
                          onSelect={(v) => updateField("hour", v)}
                        />
                      ) : (
                        <>
                          <ScrollColumn
                            label={isZh ? "时" : "Hour"}
                            items={hours12}
                            selectedValue={currentHour12}
                            onSelect={(v) => {
                              updateField("hour", currentMeridiem === 1 ? v + 12 : v);
                            }}
                          />
                          <ScrollColumn
                            label="AM/PM"
                            items={meridiems}
                            selectedValue={currentMeridiem}
                            onSelect={(v) => {
                              updateField("hour", currentHour12 + (v === 1 ? 12 : 0));
                            }}
                          />
                        </>
                      )}
                      <ScrollColumn
                        label={isZh ? "分" : "Min"}
                        items={minuteSecondItems}
                        selectedValue={workingDate.getMinutes()}
                        onSelect={(v) => updateField("minute", v)}
                      />
                      {showSeconds && (
                        <ScrollColumn
                          label={isZh ? "秒" : "Sec"}
                          items={minuteSecondItems}
                          selectedValue={workingDate.getSeconds()}
                          onSelect={(v) => updateField("second", v)}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ── Calendar grid view ──────────────────────────────── */
                <CalendarGrid
                  year={calYear}
                  month={calMonth}
                  selectedDate={workingDate}
                  today={today}
                  minDate={minDate}
                  maxDate={maxDate}
                  locale={locale}
                  onSelectDay={(date) => {
                    updateField("year", date.getFullYear());
                    updateField("month", date.getMonth());
                    updateField("day", date.getDate());
                    setView("drum");
                  }}
                  onPrev={() => navigateCalendar(-1)}
                  onNext={() => navigateCalendar(1)}
                />
              )}
            </div>

            {/* Quick-offset row (date/datetime modes only) */}
            {showDate && (
              <div className="dtp-panel-offset">
                <QuickOffsetRow
                  amount={offsetAmount}
                  unit={offsetUnit}
                  direction={offsetDirection}
                  onAmountChange={setOffsetAmount}
                  onUnitChange={setOffsetUnit}
                  onDirectionChange={setOffsetDirection}
                  onApply={applyQuickOffset}
                  locale={locale}
                />
              </div>
            )}

            {/* Footer: Cancel / Confirm */}
            <div className="dtp-panel-footer">
              <button type="button" className="dtp-btn-cancel" onClick={closePicker}>
                {labels.cancel}
              </button>
              <button type="button" className="dtp-btn-confirm" onClick={confirm}>
                {labels.confirm}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
