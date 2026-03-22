import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd, KbdGroup } from "../components/Primitives/Kbd";

describe("Kbd", () => {
  it("renders children", () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
  });

  it("renders as a kbd element", () => {
    const { container } = render(<Kbd>Enter</Kbd>);
    expect(container.querySelector("kbd")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    const { container } = render(<Kbd>A</Kbd>);
    expect(container.firstChild).toHaveClass("border");
    expect(container.firstChild).toHaveClass("bg-secondary-100");
  });

  it("applies outline variant", () => {
    const { container } = render(<Kbd variant="outline">A</Kbd>);
    expect(container.firstChild).toHaveClass("border-secondary-400");
  });

  it("applies ghost variant", () => {
    const { container } = render(<Kbd variant="ghost">A</Kbd>);
    expect(container.firstChild).not.toHaveClass("bg-secondary-100");
  });

  it("applies xs size classes", () => {
    const { container } = render(<Kbd size="xs">Esc</Kbd>);
    expect(container.firstChild).toHaveClass("h-4");
  });

  it("applies lg size classes", () => {
    const { container } = render(<Kbd size="lg">Space</Kbd>);
    expect(container.firstChild).toHaveClass("h-8");
  });

  it("merges custom className", () => {
    const { container } = render(<Kbd className="my-class">K</Kbd>);
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("passes HTML attributes", () => {
    render(<Kbd data-testid="kbd-test">S</Kbd>);
    expect(screen.getByTestId("kbd-test")).toBeInTheDocument();
  });
});

describe("KbdGroup", () => {
  it("renders all kbd children", () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>,
    );
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("renders default separator between keys", () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>A</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>,
    );
    // Default separator is "+"
    expect(container.textContent).toContain("+");
  });

  it("renders custom separator", () => {
    const { container } = render(
      <KbdGroup separator="then">
        <Kbd>g</Kbd>
        <Kbd>g</Kbd>
      </KbdGroup>,
    );
    expect(container.textContent).toContain("then");
  });

  it("does not add separator after last key", () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>A</Kbd>
        <Kbd>B</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>,
    );
    const separators = container.querySelectorAll("[aria-hidden]");
    // Should have 2 separators for 3 keys
    expect(separators.length).toBe(2);
  });

  it("applies custom className", () => {
    const { container } = render(
      <KbdGroup className="gap-2">
        <Kbd>A</Kbd>
      </KbdGroup>,
    );
    expect(container.firstChild).toHaveClass("gap-2");
  });
});
