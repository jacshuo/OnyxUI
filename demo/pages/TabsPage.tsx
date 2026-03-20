import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import {
  LayoutDashboard,
  Sparkles,
  History,
  ListFilter,
  Zap,
  Archive,
  Settings,
  Users,
  Shield,
} from "lucide-react";

const lineCode = `<Tabs defaultValue="tab1">
  <TabList>
    <TabTrigger value="tab1"><LayoutDashboard /> Overview</TabTrigger>
    <TabTrigger value="tab2"><Sparkles /> Features</TabTrigger>
    <TabTrigger value="tab3"><History /> Changelog</TabTrigger>
  </TabList>
  <TabPanels>
    <TabContent value="tab1">Overview content</TabContent>
    <TabContent value="tab2">Features content</TabContent>
    <TabContent value="tab3">Changelog content</TabContent>
  </TabPanels>
</Tabs>`;

const pillsCode = `<Tabs defaultValue="p1" intent="pills">
  <TabList>
    <TabTrigger value="p1"><ListFilter /> All</TabTrigger>
    <TabTrigger value="p2"><Zap /> Active</TabTrigger>
    <TabTrigger value="p3"><Archive /> Archived</TabTrigger>
  </TabList>
  <TabPanels>
    <TabContent value="p1">All items</TabContent>
    <TabContent value="p2">Active items only</TabContent>
    <TabContent value="p3">Archived items</TabContent>
  </TabPanels>
</Tabs>`;

const underlineCode = `<Tabs defaultValue="s1" intent="underline">
  <TabList>
    <TabTrigger value="s1"><Settings /> General</TabTrigger>
    <TabTrigger value="s2"><Users /> Team</TabTrigger>
    <TabTrigger value="s3"><Shield /> Security</TabTrigger>
  </TabList>
  <TabPanels>
    <TabContent value="s1">General settings</TabContent>
    <TabContent value="s2">Team settings</TabContent>
    <TabContent value="s3">Security settings</TabContent>
  </TabPanels>
</Tabs>`;

const standaloneCode = `{/* TabContent works standalone outside TabPanels — instant switch, no animation */}
<Tabs defaultValue="n1">
  <TabList>
    <TabTrigger value="n1">Tab A</TabTrigger>
    <TabTrigger value="n2">Tab B</TabTrigger>
  </TabList>
  <TabContent value="n1">Instant switch — no sliding animation.</TabContent>
  <TabContent value="n2">Content B</TabContent>
</Tabs>`;

const scrollableCode = `<Tabs defaultValue="t1">
  <TabList scrollable>
    <TabTrigger value="t1">Dashboard</TabTrigger>
    <TabTrigger value="t2">Features</TabTrigger>
    {/* ...more tabs */}
  </TabList>
  <TabPanels>
    <TabContent value="t1">Dashboard content</TabContent>
    {/* ...more panels */}
  </TabPanels>
</Tabs>`;

export default function TabsPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Tabs</PageTitle>

      <Section title="Line — sliding panels">
        <Tabs defaultValue="tab1">
          <TabList>
            <TabTrigger value="tab1">
              <LayoutDashboard /> Overview
            </TabTrigger>
            <TabTrigger value="tab2">
              <Sparkles /> Features
            </TabTrigger>
            <TabTrigger value="tab3">
              <History /> Changelog
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="tab1">
              <p className="text-primary-700 dark:text-primary-300">
                Overview content goes here. Click the other tabs to see the smooth sliding
                transition.
              </p>
            </TabContent>
            <TabContent value="tab2">
              <p className="text-primary-700 dark:text-primary-300">
                Feature list and descriptions. Notice how the panel slides left and right.
              </p>
            </TabContent>
            <TabContent value="tab3">
              <p className="text-primary-700 dark:text-primary-300">
                Version history and release notes. The indicator bar follows along smoothly.
              </p>
            </TabContent>
          </TabPanels>
        </Tabs>
        <CodeExample code={lineCode} />
      </Section>

      <Section title="Pills — sliding panels">
        <Tabs defaultValue="p1" intent="pills">
          <TabList>
            <TabTrigger value="p1">
              <ListFilter /> All
            </TabTrigger>
            <TabTrigger value="p2">
              <Zap /> Active
            </TabTrigger>
            <TabTrigger value="p3">
              <Archive /> Archived
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="p1">Showing all items.</TabContent>
            <TabContent value="p2">Showing active items only.</TabContent>
            <TabContent value="p3">Showing archived items.</TabContent>
          </TabPanels>
        </Tabs>
        <CodeExample code={pillsCode} />
      </Section>

      <Section title="Underline — sliding panels">
        <Tabs defaultValue="s1" intent="underline">
          <TabList>
            <TabTrigger value="s1">
              <Settings /> General
            </TabTrigger>
            <TabTrigger value="s2">
              <Users /> Team
            </TabTrigger>
            <TabTrigger value="s3">
              <Shield /> Security
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="s1">General settings and preferences.</TabContent>
            <TabContent value="s2">Team members and roles management.</TabContent>
            <TabContent value="s3">Security configuration and audit logs.</TabContent>
          </TabPanels>
        </Tabs>
        <CodeExample code={underlineCode} />
      </Section>

      <Section title="Without TabPanels (instant switch)">
        <Tabs defaultValue="n1">
          <TabList>
            <TabTrigger value="n1">Tab A</TabTrigger>
            <TabTrigger value="n2">Tab B</TabTrigger>
          </TabList>
          <TabContent value="n1">Instant switch &mdash; no sliding animation.</TabContent>
          <TabContent value="n2">
            TabContent works standalone for backward compatibility.
          </TabContent>
        </Tabs>
        <CodeExample code={standaloneCode} />
      </Section>

      <Section title="Scrollable tabs (overflow-x-auto)">
        <p className="mb-3 text-sm text-primary-500 dark:text-primary-400">
          Narrow the window to see horizontal scrolling on the tab bar.
        </p>
        <Tabs defaultValue="t1">
          <TabList scrollable>
            <TabTrigger value="t1">
              <LayoutDashboard /> Dashboard
            </TabTrigger>
            <TabTrigger value="t2">
              <Sparkles /> Features
            </TabTrigger>
            <TabTrigger value="t3">
              <History /> History
            </TabTrigger>
            <TabTrigger value="t4">
              <ListFilter /> Filters
            </TabTrigger>
            <TabTrigger value="t5">
              <Zap /> Activity
            </TabTrigger>
            <TabTrigger value="t6">
              <Archive /> Archive
            </TabTrigger>
            <TabTrigger value="t7">
              <Settings /> Settings
            </TabTrigger>
            <TabTrigger value="t8">
              <Users /> Team
            </TabTrigger>
            <TabTrigger value="t9">
              <Shield /> Security
            </TabTrigger>
          </TabList>
          <TabPanels>
            <TabContent value="t1">Dashboard content</TabContent>
            <TabContent value="t2">Features content</TabContent>
            <TabContent value="t3">History content</TabContent>
            <TabContent value="t4">Filters content</TabContent>
            <TabContent value="t5">Activity content</TabContent>
            <TabContent value="t6">Archive content</TabContent>
            <TabContent value="t7">Settings content</TabContent>
            <TabContent value="t8">Team content</TabContent>
            <TabContent value="t9">Security content</TabContent>
          </TabPanels>
        </Tabs>
        <CodeExample code={scrollableCode} />
      </Section>
    </div>
  );
}
