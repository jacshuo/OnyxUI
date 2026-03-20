import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header, type HeaderNavItem, type HeaderAction } from "../components/Navigation/Header";

describe("Header", () => {
  it("renders brand text", () => {
    render(<Header brand="MyApp" />);
    expect(screen.getByText("MyApp")).toBeInTheDocument();
  });

  it("renders as header element", () => {
    const { container } = render(<Header brand="App" />);
    expect(container.querySelector("header")).toBeTruthy();
  });

  it("calls onBrandClick when brand is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Header brand="Logo" onBrandClick={onClick} />);
    await user.click(screen.getByText("Logo"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders nav items as links", () => {
    const navItems: HeaderNavItem[] = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ];
    render(<Header navItems={navItems} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders nav items as buttons when no href", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const navItems: HeaderNavItem[] = [{ label: "Dashboard", onClick }];
    render(<Header navItems={navItems} />);
    await user.click(screen.getByText("Dashboard"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders action buttons", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: HeaderAction[] = [
      { icon: <span>🔔</span>, ariaLabel: "Notifications", onClick },
    ];
    render(<Header actions={actions} />);
    const btn = screen.getByRole("button", { name: "Notifications" });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders action links with href", () => {
    const actions: HeaderAction[] = [
      { icon: <span>🔗</span>, ariaLabel: "GitHub", href: "https://github.com", external: true },
    ];
    render(<Header actions={actions} />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders children in center area", () => {
    render(
      <Header>
        <input placeholder="Search" />
      </Header>,
    );
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Header className="my-header" />);
    expect(container.querySelector("header")).toHaveClass("my-header");
  });

  it("applies active styling to nav items", () => {
    const navItems: HeaderNavItem[] = [
      { label: "Active", href: "/", active: true },
      { label: "Inactive", href: "/other" },
    ];
    render(<Header navItems={navItems} />);
    expect(screen.getByText("Active")).toHaveClass("font-medium");
  });
});
