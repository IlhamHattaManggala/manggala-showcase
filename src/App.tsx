import { useState } from 'react';
import { SpotlightProvider, Spotlight, useSpotlight } from '@manggala31/react-spotlight';

import { Sidebar } from './components/Sidebar';
import type { ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingView } from './views/LandingView';
import { UniversalPanelDemoView } from './views/UniversalPanelDemoView';
import { DashboardGridView } from './views/DashboardGridView';
import { DataTableDemoView } from './views/DataTableDemoView';
import { SpotlightDemoView } from './views/SpotlightDemoView';
import { StatusPageDemoView } from './views/StatusPageDemoView';
import { SchemaFormDemoView } from './views/SchemaFormDemoView';
import { SentinelDemoView } from './views/SentinelDemoView';
import { TenancyDemoView } from './views/TenancyDemoView';

const spotlightActions = [
  {
    group: 'Navigate',
    actions: [
      { id: 'nav-home',      label: 'Overview — Home',            description: 'Manggala ecosystem overview & catalog', keywords: ['home', 'overview'], onSelect: () => {} },
      { id: 'nav-panel',     label: 'Universal Panel (Laravel)',   description: '27 CLI commands · 5 stack adapters',     keywords: ['laravel', 'panel', 'admin'], onSelect: () => {} },
      { id: 'nav-grid',      label: 'Dashboard Grid (React)',      description: 'Drag & drop widget grid',                keywords: ['dashboard', 'widget', 'drag'], onSelect: () => {} },
      { id: 'nav-table',     label: 'Data Table (React)',          description: 'Sortable, filterable server table',      keywords: ['table', 'sort', 'filter'], onSelect: () => {} },
      { id: 'nav-spotlight', label: 'Spotlight (React)',           description: 'Cmd+K command palette',                  keywords: ['search', 'command', 'palette'], onSelect: () => {} },
      { id: 'nav-status',    label: 'Status Page (React)',         description: 'Health & uptime monitoring',             keywords: ['status', 'health', 'uptime'], onSelect: () => {} },
      { id: 'nav-form',      label: 'Schema Form (React)',         description: 'JSON schema driven form builder',        keywords: ['form', 'schema', 'settings'], onSelect: () => {} },
    ],
  },
];

function ShowcaseApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [collapsed, setCollapsed] = useState(false);
  const { openSpotlight } = useSpotlight();

  const views: Record<ActiveTab, React.JSX.Element> = {
    'landing':        <LandingView onSelectTab={setActiveTab} />,
    'universal-panel': <UniversalPanelDemoView />,
    'dashboard-grid':  <DashboardGridView />,
    'datatable':       <DataTableDemoView />,
    'spotlight':       <SpotlightDemoView />,
    'status-page':     <StatusPageDemoView />,
    'schema-form':     <SchemaFormDemoView />,
    'sentinel':        <SentinelDemoView />,
    'tenancy':         <TenancyDemoView />,
  };

  return (
    <div className="app-root">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} isCollapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)} />
      <Header activeTab={activeTab} onOpenSpotlight={openSpotlight} isCollapsed={collapsed} />
      <Spotlight placeholder="Search packages, demos, or type a command..." />
      <main className={`app-main${collapsed ? ' collapsed' : ''}`}>
        <div className="content-wrapper">
          {views[activeTab]}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SpotlightProvider actions={spotlightActions}>
      <ShowcaseApp />
    </SpotlightProvider>
  );
}
