import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPInput } from "../components/Forms/OTPInput";

describe("OTPInput", () => {
  it("renders correct number of inputs", () => {
    render(<OTPInput length={6} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("renders 4 inputs for length=4", () => {
    render(<OTPInput length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("renders password inputs when mask=true", () => {
    const { container } = render(<OTPInput length={4} mask />);
    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs).toHaveLength(4);
  });

  it("renders with defaultValue", () => {
    render(<OTPInput length={6} defaultValue="123456" />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs[0].value).toBe("1");
    expect(inputs[5].value).toBe("6");
  });

  it("renders with controlled value", () => {
    render(<OTPInput length={4} value="1234" />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputs[0].value).toBe("1");
    expect(inputs[3].value).toBe("4");
  });

  it("renders disabled inputs", () => {
    render(<OTPInput length={4} disabled />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    inputs.forEach((input) => expect(input).toBeDisabled());
  });

  it("renders readOnly inputs", () => {
    render(<OTPInput length={4} readOnly />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    inputs.forEach((input) => expect(input).toHaveAttribute("readonly"));
  });

  it("applies invalid class when invalid=true", () => {
    const { container } = render(<OTPInput length={4} invalid />);
    const firstInput = container.querySelector("input");
    expect(firstInput?.className).toMatch(/danger/);
  });

  it("calls onChange when a digit is entered", async () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith("3");
  });

  it("calls onComplete when all digits entered", () => {
    const onComplete = vi.fn();
    render(<OTPInput length={4} onComplete={onComplete} defaultValue="123" />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[3], { target: { value: "4" } });
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("handles backspace to clear current slot", () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} defaultValue="1234" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("1 34".replace(" ", ""));
  });

  it("handles paste", () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "1234" },
    });
    expect(onChange).toHaveBeenCalledWith("1234");
  });

  it("has group role with aria-label", () => {
    render(<OTPInput length={4} />);
    expect(screen.getByRole("group", { name: "OTP Input" })).toBeInTheDocument();
  });

  it("each input has aria-label", () => {
    render(<OTPInput length={3} />);
    expect(screen.getByRole("textbox", { name: "Digit 1 of 3" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Digit 3 of 3" })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<OTPInput length={4} className="my-otp" />);
    expect(container.firstChild).toHaveClass("my-otp");
  });

  it("ignores non-numeric chars in default mode", () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows letters in alphanumeric mode", () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} alphanumeric onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
