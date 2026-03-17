import { useState } from 'react';
import { Header, type HeaderNavItem, type HeaderAction } from '../../src';
import { Section, PageTitle } from './helpers';
import {
  Sun, Moon, Search, Globe, LogIn, LogOut, User, Bell, Github,
  Rocket, Menu,
} from 'lucide-react';

export default function HeaderPage() {
  const [dark, setDark] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [lang, setLang] = useState('EN');

  /* ── Shared nav items ───────────────────────────────── */
  const navItems: HeaderNavItem[] = [
    { label: 'Home', href: '#', active: activeNav === 'home', onClick: (e) => { e.preventDefault(); setActiveNav('home'); } },
    { label: 'Docs', href: '#', active: activeNav === 'docs', onClick: (e) => { e.preventDefault(); setActiveNav('docs'); } },
    { label: 'Blog', href: '#', active: activeNav === 'blog', onClick: (e) => { e.preventDefault(); setActiveNav('blog'); } },
    { label: 'Pricing', href: '#', active: activeNav === 'pricing', onClick: (e) => { e.preventDefault(); setActiveNav('pricing'); } },
  ];

  return (
    <div className="space-y-8">
      <PageTitle>Header</PageTitle>

      <Section title="Basic — brand + nav + actions">
        <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            brand="MyApp"
            navItems={navItems}
            actions={[
              {
                key: 'theme',
                icon: dark ? <Sun /> : <Moon />,
                'aria-label': 'Toggle theme',
                onClick: () => setDark((d) => !d),
              },
              {
                key: 'login',
                icon: <LogIn />,
                'aria-label': 'Login',
                onClick: () => alert('Login clicked'),
              },
            ]}
          />
        </div>
      </Section>

      <Section title="With logo element & search bar">
        <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            brand={
              <span className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500" />
                <span>SpaceUI</span>
              </span>
            }
            navItems={[
              { label: 'Dashboard', href: '#', active: true },
              { label: 'Projects', href: '#' },
              { label: 'Team', href: '#' },
            ]}
            actions={[
              { key: 'search', icon: <Search />, 'aria-label': 'Search', onClick: () => alert('Search') },
              { key: 'bell', icon: <Bell />, 'aria-label': 'Notifications' },
              { key: 'user', icon: <User />, 'aria-label': 'Profile' },
            ]}
          />
        </div>
      </Section>

      <Section title="Full-featured — theme, language, GitHub, login">
        <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            brand="@jacshuo/onyx"
            onBrandClick={() => alert('Navigate home')}
            navItems={navItems}
            actions={[
              {
                key: 'lang',
                icon: <Globe />,
                'aria-label': `Language: ${lang}`,
                onClick: () => setLang((l) => (l === 'EN' ? '中文' : 'EN')),
              },
              {
                key: 'github',
                icon: <Github />,
                'aria-label': 'GitHub',
                href: 'https://github.com/jacshuo',
                external: true,
              },
              {
                key: 'theme',
                icon: dark ? <Sun /> : <Moon />,
                'aria-label': 'Toggle theme',
                onClick: () => setDark((d) => !d),
              },
              {
                key: 'login',
                icon: <LogIn />,
                'aria-label': 'Login',
                onClick: () => alert('Login clicked'),
              },
            ]}
          />
        </div>
      </Section>

      <Section title="Minimal — brand + single action">
        <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            brand="SimpleApp"
            actions={[
              {
                key: 'menu',
                icon: <Menu />,
                'aria-label': 'Menu',
                onClick: () => alert('Open mobile menu'),
              },
            ]}
          />
        </div>
      </Section>

      <Section title="Authenticated — user actions">
        <div className="overflow-hidden rounded-lg border border-primary-200 dark:border-primary-700">
          <Header
            brand={
              <span className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-green-500" />
                <span>DevHub</span>
              </span>
            }
            navItems={[
              { label: 'Overview', href: '#', active: true },
              { label: 'Repositories', href: '#' },
              { label: 'Pull Requests', href: '#' },
              { label: 'Issues', href: '#' },
            ]}
            actions={[
              { key: 'bell', icon: <Bell />, 'aria-label': 'Notifications' },
              { key: 'user', icon: <User />, 'aria-label': 'Profile' },
              {
                key: 'logout',
                icon: <LogOut />,
                'aria-label': 'Logout',
                onClick: () => alert('Logged out'),
              },
            ]}
          />
        </div>
      </Section>
    </div>
  );
}
