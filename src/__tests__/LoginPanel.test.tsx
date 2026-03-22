import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPanel } from "../components/Extras/LoginPanel";

describe("LoginPanel", () => {
  it("renders login mode by default", () => {
    render(<LoginPanel />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("renders register mode", () => {
    render(<LoginPanel mode="register" />);
    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
  });

  it("renders otp mode", () => {
    render(<LoginPanel mode="otp" />);
    expect(screen.getByText("Verify your identity")).toBeInTheDocument();
  });

  it("renders forgot mode", () => {
    render(<LoginPanel mode="forgot" />);
    expect(screen.getByText("Reset password")).toBeInTheDocument();
  });

  it("switches to register on link click", () => {
    render(<LoginPanel />);
    const registerLink = screen.getByText("Register");
    fireEvent.click(registerLink);
    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
  });

  it("switches back to login from register", () => {
    render(<LoginPanel />);
    fireEvent.click(screen.getByText("Register"));
    fireEvent.click(screen.getByText("Sign in"));
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("switches to forgot on link click", () => {
    render(<LoginPanel />);
    const forgotLink = screen.getByText("Forgot password?");
    fireEvent.click(forgotLink);
    expect(screen.getByText("Reset password")).toBeInTheDocument();
  });

  it("calls onModeChange when mode changes", () => {
    const onModeChange = vi.fn();
    render(<LoginPanel onModeChange={onModeChange} />);
    fireEvent.click(screen.getByText("Register"));
    expect(onModeChange).toHaveBeenCalledWith("register");
  });

  it("renders custom title", () => {
    render(<LoginPanel title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders custom subtitle", () => {
    render(<LoginPanel subtitle="Custom subtitle text" />);
    expect(screen.getByText("Custom subtitle text")).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<LoginPanel logo={<span data-testid="logo">Logo</span>} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<LoginPanel error="Invalid credentials" />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("renders social logins", () => {
    render(
      <LoginPanel
        socialLogins={[{ label: "Continue with GitHub", icon: <span>GH</span>, onClick: vi.fn() }]}
      />,
    );
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
  });

  it("disables submit button when isLoading", () => {
    const { container } = render(<LoginPanel isLoading />);
    const submitBtn = container.querySelector("button[type='submit']");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("shows loading spinner when isLoading", () => {
    const { container } = render(<LoginPanel isLoading />);
    // The loading spinner has animate-spin class
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LoginPanel className="custom-panel" />);
    expect(container.firstChild).toHaveClass("custom-panel");
  });

  it("calls onLogin when form is submitted", () => {
    const onLogin = vi.fn();
    render(<LoginPanel onLogin={onLogin} />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    const form = emailInput.closest("form");
    fireEvent.submit(form!);
    expect(onLogin).toHaveBeenCalledWith("test@test.com", "password", false);
  });

  it("shows Back to login in forgot mode", () => {
    render(<LoginPanel mode="forgot" />);
    expect(screen.getByText("← Back to login")).toBeInTheDocument();
  });

  it("navigates back to login from forgot", () => {
    render(<LoginPanel />);
    fireEvent.click(screen.getByText("Forgot password?"));
    fireEvent.click(screen.getByText("← Back to login"));
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });
});
