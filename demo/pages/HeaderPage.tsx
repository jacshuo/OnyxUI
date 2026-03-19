import { useState } from "react";
import { Header, type HeaderNavItem, type HeaderAction } from "../../src";
import { Section, PageTitle } from "./helpers";
import {
  SunDim,
  MoonStar,
  ScanSearch,
  Languages,
  KeyRound,
  Power,
  CircleUser,
  BellDot,
  Github,
  Zap,
  GitBranch,
  Grip,
  Sparkles,
} from "lucide-react";

export default function HeaderPage() {
  const [dark, setDark] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [lang, setLang] = useState("EN");

  /* ── Shared nav items ───────────────────────────────── */
  const navItems: HeaderNavItem[] = [
    {
      label: "Home",
      href: "#",
      active: activeNav === "home",
      onClick: (e) => {
        e.preventDefault();
        setActiveNav("home");
      },
    },
    {
      label: "Docs",
      href: "#",
      active: activeNav === "docs",
      onClick: (e) => {
        e.preventDefault();
        setActiveNav("docs");
      },
    },
    {
      label: "Blog",
      href: "#",
      active: activeNav === "blog",
      onClick: (e) => {
        e.preventDefault();
        setActiveNav("blog");
      },
    },
    {
      label: "Pricing",
      href: "#",
      active: activeNav === "pricing",
      onClick: (e) => {
        e.preventDefault();
        setActiveNav("pricing");
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle>Header</PageTitle>

      <Section title="Basic — brand + nav + actions">
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span>MyApp</span>
              </span>
            }
            navItems={navItems}
            actions={[
              {
                key: "theme",
                icon: dark ? <SunDim /> : <MoonStar />,
                "aria-label": "Toggle theme",
                onClick: () => setDark((d) => !d),
              },
              {
                key: "login",
                icon: <KeyRound />,
                "aria-label": "Login",
                onClick: () => alert("Login clicked"),
              },
            ]}
            mobileMenu
          />
        </div>
      </Section>

      <Section title="With logo element &amp; search bar">
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand={
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>SpaceUI</span>
              </span>
            }
            navItems={[
              { label: "Dashboard", href: "#", active: true },
              { label: "Projects", href: "#" },
              { label: "Team", href: "#" },
            ]}
            actions={[
              {
                key: "search",
                icon: <ScanSearch />,
                "aria-label": "Search",
                onClick: () => alert("Search"),
              },
              { key: "bell", icon: <BellDot />, "aria-label": "Notifications" },
              { key: "user", icon: <CircleUser />, "aria-label": "Profile" },
            ]}
            mobileMenu
          />
        </div>
      </Section>

      <Section title="Full-featured — theme, language, GitHub, login">
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand="@jacshuo/onyx"
            onBrandClick={() => alert("Navigate home")}
            navItems={navItems}
            actions={[
              {
                key: "lang",
                icon: <Languages />,
                "aria-label": `Language: ${lang}`,
                onClick: () => setLang((l) => (l === "EN" ? "中文" : "EN")),
              },
              {
                key: "github",
                icon: <Github />,
                "aria-label": "GitHub",
                href: "https://github.com/jacshuo",
                external: true,
              },
              {
                key: "theme",
                icon: dark ? <SunDim /> : <MoonStar />,
                "aria-label": "Toggle theme",
                onClick: () => setDark((d) => !d),
              },
              {
                key: "login",
                icon: <KeyRound />,
                "aria-label": "Login",
                onClick: () => alert("Login clicked"),
              },
            ]}
            mobileMenu
          />
        </div>
      </Section>

      <Section title="Minimal — brand + single action">
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand="SimpleApp"
            actions={[
              {
                key: "menu",
                icon: <Grip />,
                "aria-label": "Menu",
                onClick: () => alert("Open mobile menu"),
              },
            ]}
          />
        </div>
      </Section>

      <Section title="Authenticated — user actions">
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand={
              <span className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-emerald-500" />
                <span>DevHub</span>
              </span>
            }
            navItems={[
              { label: "Overview", href: "#", active: true },
              { label: "Repositories", href: "#" },
              { label: "Pull Requests", href: "#" },
              { label: "Issues", href: "#" },
            ]}
            actions={[
              { key: "bell", icon: <BellDot />, "aria-label": "Notifications" },
              { key: "user", icon: <CircleUser />, "aria-label": "Profile" },
              {
                key: "logout",
                icon: <Power />,
                "aria-label": "Logout",
                onClick: () => alert("Logged out"),
              },
            ]}
            mobileMenu
          />
        </div>
      </Section>

      <Section title="Mobile menu (mobileMenu prop)">
        <p className="mb-3 text-sm text-primary-500 dark:text-primary-400">
          Below the <code>md</code> breakpoint, nav items collapse into a left{" "}
          <strong>DropdownButton</strong> and actions collapse into a right{" "}
          <strong>DropdownButton</strong> (right-anchored, with icon + label). Both are built on the
          shared DropdownButton component and close independently on outside click or Escape.
        </p>
        <div className="rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            className="rounded-lg"
            brand="MyApp"
            navItems={[
              { label: "Home", href: "#", active: true },
              { label: "Features", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Docs", href: "#" },
            ]}
            actions={[
              { key: "bell", icon: <BellDot />, "aria-label": "Notifications" },
              { key: "user", icon: <CircleUser />, "aria-label": "Profile" },
            ]}
            mobileMenu
          />
        </div>
      </Section>
    </div>
  );
}
