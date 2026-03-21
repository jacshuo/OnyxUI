import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateTimePicker } from "../components/Extras/DateTimePicker";
import {
  getDaysInMonth,
  getCalendarDays,
  isSameDay,
  isToday,
  isBeforeDay,
  isAfterDay,
  clampDate,
  applyOffset,
  formatDate,
  getDefaultFormat,
} from "../components/Extras/DateTimePicker/DateTimePicker.utils";

// ─── Pure utility tests ──────────────────────────────────────────────────────

describe("DateTimePicker utils", () => {
  describe("getDaysInMonth", () => {
    it("returns 31 for January", () => expect(getDaysInMonth(2024, 0)).toBe(31));
    it("returns 29 for Feb in leap year 2024", () => expect(getDaysInMonth(2024, 1)).toBe(29));
    it("returns 28 for Feb in non-leap year 2023", () => expect(getDaysInMonth(2023, 1)).toBe(28));
    it("returns 30 for April", () => expect(getDaysInMonth(2024, 3)).toBe(30));
  });

  describe("getCalendarDays", () => {
    it("returns 42 cells for any month", () => {
      const days = getCalendarDays(2024, 0); // January 2024
      expect(days).toHaveLength(42);
    });

    it("marks cells from current month as thisMonth=true", () => {
      const days = getCalendarDays(2024, 0);
      const thisMonth = days.filter((d) => d.thisMonth);
      expect(thisMonth).toHaveLength(31); // Jan has 31 days
    });
  });

  describe("isSameDay", () => {
    it("returns true for same date", () => {
      expect(isSameDay(new Date("2024-06-15"), new Date("2024-06-15T14:00:00"))).toBe(true);
    });
    it("returns false for different date", () => {
      expect(isSameDay(new Date("2024-06-15"), new Date("2024-06-16"))).toBe(false);
    });
  });

  describe("isToday", () => {
    it("returns true for today", () => expect(isToday(new Date())).toBe(true));
    it("returns false for yesterday", () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      expect(isToday(d)).toBe(false);
    });
  });

  describe("isBeforeDay / isAfterDay", () => {
    const a = new Date("2024-01-01");
    const b = new Date("2024-01-15");
    it("isBeforeDay: a is before b", () => expect(isBeforeDay(a, b)).toBe(true));
    it("isBeforeDay: b is not before a", () => expect(isBeforeDay(b, a)).toBe(false));
    it("isAfterDay: b is after a", () => expect(isAfterDay(b, a)).toBe(true));
    it("isAfterDay: same day returns false", () => {
      expect(isAfterDay(new Date("2024-01-01"), new Date("2024-01-01T10:00:00"))).toBe(false);
    });
  });

  describe("clampDate", () => {
    const min = new Date("2024-01-10");
    const max = new Date("2024-01-20");

    it("clamps to min when date is before min", () => {
      const result = clampDate(new Date("2024-01-05"), min, max);
      expect(result.getTime()).toBe(min.getTime());
    });
    it("clamps to max when date is after max", () => {
      const result = clampDate(new Date("2024-01-25"), min, max);
      expect(result.getTime()).toBe(max.getTime());
    });
    it("returns date unchanged when within range", () => {
      const d = new Date("2024-01-15");
      expect(clampDate(d, min, max).getTime()).toBe(d.getTime());
    });
    it("works with no constraints", () => {
      const d = new Date("2024-01-15");
      expect(clampDate(d).getTime()).toBe(d.getTime());
    });
  });

  describe("applyOffset", () => {
    const base = new Date("2024-06-15T12:00:00");

    it("adds days correctly", () => {
      const result = applyOffset(base, 5, "day", "future");
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(5); // still June
    });
    it("subtracts days correctly", () => {
      const result = applyOffset(base, 5, "day", "past");
      expect(result.getDate()).toBe(10);
    });
    it("adds weeks correctly", () => {
      const result = applyOffset(base, 2, "week", "future");
      expect(result.getDate()).toBe(29); // 15 + 14
    });
    it("adds months correctly", () => {
      const result = applyOffset(base, 3, "month", "future");
      expect(result.getMonth()).toBe(8); // Sep
    });
    it("subtracts months correctly", () => {
      const result = applyOffset(base, 1, "month", "past");
      expect(result.getMonth()).toBe(4); // May
    });
    it("adds years correctly", () => {
      const result = applyOffset(base, 2, "year", "future");
      expect(result.getFullYear()).toBe(2026);
    });
    it("subtracts years correctly", () => {
      const result = applyOffset(base, 1, "year", "past");
      expect(result.getFullYear()).toBe(2023);
    });
  });

  describe("getDefaultFormat", () => {
    it("date mode", () => expect(getDefaultFormat("date")).toBe("YYYY-MM-DD"));
    it("time mode 24h with seconds", () =>
      expect(getDefaultFormat("time", true, true)).toBe("HH:mm:ss"));
    it("time mode 24h no seconds", () =>
      expect(getDefaultFormat("time", true, false)).toBe("HH:mm"));
    it("time mode 12h with seconds", () =>
      expect(getDefaultFormat("time", false, true)).toBe("hh:mm:ss A"));
    it("datetime mode 24h", () =>
      expect(getDefaultFormat("datetime", true, true)).toBe("YYYY-MM-DD HH:mm:ss"));
    it("datetime mode 12h no seconds", () =>
      expect(getDefaultFormat("datetime", false, false)).toBe("YYYY-MM-DD hh:mm A"));
  });

  describe("formatDate", () => {
    const d = new Date(2024, 5, 15, 14, 30, 5); // 2024-06-15 14:30:05

    it("formats YYYY-MM-DD HH:mm:ss", () => {
      expect(formatDate(d, "YYYY-MM-DD HH:mm:ss")).toBe("2024-06-15 14:30:05");
    });
    it("formats hh:mm A (12-hour AM/PM)", () => {
      expect(formatDate(d, "hh:mm A")).toBe("02:30 PM");
    });
    it("avoids YYYY vs YY conflict", () => {
      expect(formatDate(d, "YYYY")).toBe("2024");
    });
    it("formats YY correctly", () => {
      expect(formatDate(d, "YY")).toBe("24");
    });
    it("returns am for lowercase a", () => {
      const am = new Date(2024, 5, 15, 9, 0, 0);
      expect(formatDate(am, "a")).toBe("am");
    });
    it("M gives month number without padding", () => {
      expect(formatDate(d, "M")).toBe("6");
    });
  });
});

// ─── Component render tests ──────────────────────────────────────────────────

describe("DateTimePicker component", () => {
  it("renders trigger with placeholder when no value", () => {
    render(<DateTimePicker placeholder="Choose a date" />);
    expect(screen.getByText("Choose a date")).toBeInTheDocument();
  });

  it("renders formatted value in trigger when defaultValue is set", () => {
    const date = new Date(2024, 5, 15, 10, 30, 0); // 2024-06-15 10:30:00
    render(<DateTimePicker defaultValue={date} />);
    // Display text should contain the formatted date
    expect(screen.getByText("2024-06-15 10:30:00")).toBeInTheDocument();
  });

  it("opens popup when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="datetime" />);
    // The trigger is a div[role="button"]
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes popup on cancel", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="datetime" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onChange when confirm is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateTimePicker mode="date" onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker disabled />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it('mode="date" shows date columns but not time-only label', async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="date" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    // Year column listbox should be present
    expect(screen.getByRole("listbox", { name: /year/i })).toBeInTheDocument();
    // No hour column
    expect(screen.queryByRole("listbox", { name: /hour/i })).not.toBeInTheDocument();
  });

  it('mode="time" shows time columns but not date columns', async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="time" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    // Hour column should be present
    expect(screen.getByRole("listbox", { name: /hour/i })).toBeInTheDocument();
    // No year column
    expect(screen.queryByRole("listbox", { name: /year/i })).not.toBeInTheDocument();
  });

  it("renders calendar toggle button in date mode", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="date" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: /calendar/i })).toBeInTheDocument();
  });

  it("does not render calendar toggle in time-only mode", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="time" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    // No calendar toggle button
    expect(screen.queryByRole("button", { name: /calendar/i })).not.toBeInTheDocument();
  });

  it("respects minDate — clicking confirm clamps working date", async () => {
    const user = userEvent.setup();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5);
    const onChange = vi.fn();

    render(<DateTimePicker mode="date" minDate={future} onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    // Confirm without selecting (working date is now, before minDate — gets clamped)
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);
    const result: Date = onChange.mock.calls[0][0];
    expect(result.getFullYear()).toBeGreaterThanOrEqual(future.getFullYear());
  });

  it("renders clear button when a value is present and clears on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const initial = new Date(2024, 0, 1);
    render(<DateTimePicker defaultValue={initial} onChange={onChange} />);
    // Clear button should be visible
    const clearBtn = screen.getByRole("button", { name: /clear value/i });
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("shows Apply button in date mode (quick offset row)", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="date" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("does not show quick-offset row in time-only mode", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="time" />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(screen.queryByRole("button", { name: /apply/i })).not.toBeInTheDocument();
  });

  it("renders correctly with zh-CN locale", async () => {
    const user = userEvent.setup();
    render(<DateTimePicker mode="date" locale="zh-CN" />);
    const trigger = screen.getByRole("button", { name: /选择日期/i });
    await user.click(trigger);
    // The confirm button in Chinese
    expect(screen.getByRole("button", { name: "确定" })).toBeInTheDocument();
  });

  it("applies custom triggerClassName", () => {
    render(<DateTimePicker triggerClassName="my-trigger-class" />);
    expect(document.querySelector(".my-trigger-class")).toBeInTheDocument();
  });

  it("calls onOpen and onClose callbacks", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<DateTimePicker mode="date" onOpen={onOpen} onClose={onClose} />);
    const trigger = screen.getByRole("button", { name: /select date/i });
    await user.click(trigger);
    expect(onOpen).toHaveBeenCalledTimes(1);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
