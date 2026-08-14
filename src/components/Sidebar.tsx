import React from 'react';
import { LayoutGrid, Table, Search, Activity, FormInput, Home, Layers, ChevronLeft, ChevronRight, ShieldAlert, Building2 } from 'lucide-react';

export type ActiveTab = 'landing' | 'universal-panel' | 'dashboard-grid' | 'datatable' | 'spotlight' | 'status-page' | 'schema-form' | 'sentinel' | 'tenancy';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: 'landing' as ActiveTab,         label: 'Overview',        icon: Home },
    { id: 'universal-panel' as ActiveTab, label: 'Universal Panel', icon: Layers },
    { id: 'dashboard-grid' as ActiveTab,  label: 'Dashboard Grid',  icon: LayoutGrid },
    { id: 'datatable' as ActiveTab,       label: 'Data Table',      icon: Table },
    { id: 'spotlight' as ActiveTab,       label: 'Spotlight Cmd+K', icon: Search },
    { id: 'status-page' as ActiveTab,     label: 'Status Page',     icon: Activity },
    { id: 'schema-form' as ActiveTab,     label: 'Schema Form',     icon: FormInput },
    { id: 'sentinel' as ActiveTab,        label: 'Sentinel WAF',    icon: ShieldAlert },
    { id: 'tenancy' as ActiveTab,         label: 'Tenancy Engine',  icon: Building2 },
  ];

  return (
    <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      <div>
        <div className="sidebar-brand" onClick={() => onSelectTab('landing')}>
          <div className="sidebar-logo">M</div>
          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">Manggala</div>
              <div className="sidebar-brand-sub">Open Source</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-item${activeTab === id ? ' active' : ''}`}
              onClick={() => onSelectTab(id)}
              title={isCollapsed ? label : undefined}
            >
              <Icon className="item-icon" />
              {!isCollapsed && <span className="item-label">{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <a
            href="https://ilhamhattamanggala.my.id"
            target="_blank"
            rel="noopener noreferrer author"
            style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8, textDecoration: 'none' }}
          >
            By <strong style={{ color: 'var(--accent)' }}>Ilham Hatta Manggala</strong>
          </a>
        )}
        <button className="sidebar-collapse-btn" onClick={onToggleCollapse} title={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
};
