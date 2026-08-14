import React, { useState } from 'react';
import { DashboardGrid } from '@manggala31/react-dashboard-grid';
import type { WidgetConfig } from '@manggala31/react-dashboard-grid';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { InstallBadge } from '../components/InstallBadge';
import { LayoutGrid, TrendingUp, Users, ShoppingBag, Shield, RefreshCw } from 'lucide-react';

const makeWidgets = (): WidgetConfig[] => [
  {
    id: 'revenue', title: 'Monthly Revenue', colSpan: 4, rowSpan: 1,
    content: (
      <div>
        <div style={{ fontSize: 11, color: '#8b8ba8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Total Sales</span>
          <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <TrendingUp size={11} /> +18.4%
          </span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f4f4f8', marginBottom: 12, letterSpacing: '-0.5px' }}>$48,290</div>
        <div style={{ height: 3, background: '#1e1e2e', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a78bfa)', borderRadius: 99 }} />
        </div>
      </div>
    ),
  },
  {
    id: 'users', title: 'Active Subscribers', colSpan: 4, rowSpan: 1,
    content: (
      <div>
        <div style={{ fontSize: 11, color: '#8b8ba8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Total Active</span>
          <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: 11 }}>+1,240 this month</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f4f4f8', marginBottom: 8, letterSpacing: '-0.5px' }}>14,890</div>
        <div style={{ fontSize: 11, color: '#8b8ba8', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Users size={12} style={{ color: '#a855f7' }} /> 89% Retention Rate
        </div>
      </div>
    ),
  },
  {
    id: 'orders', title: 'Pending Fulfillment', colSpan: 4, rowSpan: 1,
    content: (
      <div>
        <div style={{ fontSize: 11, color: '#8b8ba8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Orders Queue</span>
          <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: 11 }}>12 Urgent</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#f4f4f8', marginBottom: 8, letterSpacing: '-0.5px' }}>184</div>
        <div style={{ fontSize: 11, color: '#8b8ba8', display: 'flex', alignItems: 'center', gap: 5 }}>
          <ShoppingBag size={12} style={{ color: '#f59e0b' }} /> Avg: 1.4 hrs processing
        </div>
      </div>
    ),
  },
  {
    id: 'perf', title: 'System Performance', colSpan: 8, rowSpan: 1,
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {([['CPU Usage', '28.4%', '#3b82f6'], ['Memory', '4.2 / 16 GB', '#a855f7'], ['Throughput', '420 req/s', '#22c55e']] as const).map(([label, val, color]) => (
          <div key={label} style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#52526a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: '-0.3px' }}>{val}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'security', title: 'Sentinel WAF', colSpan: 4, rowSpan: 1,
    content: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
          <Shield size={15} /> Active Defense Mode
        </div>
        <div style={{ fontSize: 11, color: '#8b8ba8', lineHeight: 1.6 }}>0 critical threats detected in last 24 hours. All WAF rules active.</div>
      </div>
    ),
  },
];

const reactCode = `import { DashboardGrid } from '@manggala31/react-dashboard-grid';
import '@manggala31/react-dashboard-grid/styles.css';

const widgets = [
  { id: 'revenue', title: 'Revenue', colSpan: 4, content: <RevenueCard /> },
  { id: 'users',   title: 'Users',   colSpan: 8, content: <UsersChart /> },
];

<DashboardGrid
  widgets={widgets}
  cols={12}
  isEditable={true}
  onLayoutChange={(layout) => persist(layout)}
/>`;

const phpCode = `<?php
use Manggala\\DashboardBuilder\\Dashboard;
use Manggala\\DashboardBuilder\\Widgets\\StatWidget;

class AnalyticsDashboard extends Dashboard
{
    public function widgets(): array
    {
        return [
            StatWidget::make('Monthly Revenue')
                ->value('$48,290')->colSpan(4)->growth('+18.4%'),
            StatWidget::make('Active Subscribers')
                ->value('14,890 Users')->colSpan(8),
        ];
    }
}`;

export const DashboardGridView: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(makeWidgets);

  return (
    <div className="space-y-6">
      <div className="view-header">
        <div>
          <div className="view-title">
            <LayoutGrid size={20} style={{ color: 'var(--accent)' }} />
            <h1>Dashboard Grid</h1>
            <span className="tag tag-blue">React</span>
          </div>
          <p className="view-subtitle">Drag-and-drop, resize-able widget grid for React, Inertia.js, and Next.js.</p>
        </div>
        <div className="install-row">
          <InstallBadge command="npm i @manggala31/react-dashboard-grid" type="npm" />
          <InstallBadge command="composer require manggala/laravel-dashboard-builder" type="composer" />
        </div>
      </div>

      <CodeSnippetViewer
        title="Drag & Drop Dashboard Grid Playground"
        reactCode={reactCode}
        laravelCode={phpCode}
        previewContent={
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>12-Column Responsive Grid · Drag to reorder · Drag edge to resize</span>
              <button
                onClick={() => setWidgets(makeWidgets())}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>
            <DashboardGrid widgets={widgets} cols={12} isEditable={true} onLayoutChange={setWidgets} />
          </div>
        }
      />
    </div>
  );
};
