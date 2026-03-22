import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rating } from "../components/Primitives/Rating";

describe("Rating", () => {
  it("renders the correct number of stars", () => {
    render(<Rating max={5} label="Test rating" />);
    const radiogroup = screen.getByRole("radiogroup", { name: "Test rating" });
    expect(radiogroup).toBeInTheDocument();
    expect(radiogroup.querySelectorAll('[role="radio"]')).toHaveLength(5);
  });

  it("renders custom max", () => {
    render(<Rating max={10} label="10 star" />);
    expect(screen.getByRole("radiogroup").querySelectorAll('[role="radio"]')).toHaveLength(10);
  });

  it("uses defaultValue for initial display", () => {
    const { container } = render(<Rating defaultValue={3} label="rating" />);
    // The 3rd button (slot 3) should have aria-checked=true based on math.round
    const buttons = container.querySelectorAll('[role="radio"]');
    expect(buttons[2]).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when a star is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating onChange={onChange} label="rating" />);
    const buttons = screen.getAllByRole("radio");
    await user.click(buttons[2]); // 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange when readOnly", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating readOnly onChange={onChange} defaultValue={2} label="rating" />);
    // readOnly renders spans not buttons
    const spans = screen.getAllByRole("radio");
    if (spans.length > 0) {
      fireEvent.click(spans[0]);
    }
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating disabled onChange={onChange} defaultValue={2} label="rating" />);
    const spans = screen.getAllByRole("radio");
    if (spans.length > 0) {
      fireEvent.click(spans[0]);
    }
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies controlled value", () => {
    const { container } = render(<Rating value={4} label="rating" />);
    const buttons = container.querySelectorAll('[role="radio"]');
    expect(buttons[3]).toHaveAttribute("aria-checked", "true");
  });

  it("supports keyboard navigation with ArrowRight", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rating defaultValue={2} onChange={onChange} label="rating" />);
    // Focus the radiogroup
    const group = screen.getByRole("radiogroup");
    group.focus();
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("supports keyboard navigation with ArrowLeft", () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} label="rating" />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("Home key sets value to 0", () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} label="rating" />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "Home" });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("End key sets value to max", () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={1} max={5} onChange={onChange} label="rating" />);
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "End" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("renders with half-star precision", () => {
    const { container } = render(<Rating precision={0.5} defaultValue={2.5} label="half rating" />);
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeInTheDocument();
  });

  it("applies className", () => {
    const { container } = render(<Rating className="test-class" label="rating" />);
    expect(container.firstChild).toHaveClass("test-class");
  });

  it("renders custom icon", () => {
    render(<Rating icon={<span data-testid="custom-icon">★</span>} label="rating" />);
    // Custom icons are in the DOM (possibly hidden since no fill)
    // Just ensure no crash
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("applies disabled opacity class", () => {
    const { container } = render(<Rating disabled label="disabled rating" />);
    expect(container.firstChild).toHaveClass("opacity-50");
  });
});
