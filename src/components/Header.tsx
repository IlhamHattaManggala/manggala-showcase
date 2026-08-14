import React from 'react';
import { Search, Github, ExternalLink, Sparkles, Globe } from 'lucide-react';
import type { ActiveTab } from './Sidebar';

const titles: Record<ActiveTab, string> = {
  'landing':        'Manggala Open Source Ecosystem',
  'universal-panel':'manggala/universal-panel',
  'dashboard-grid': '@manggala31/react-dashboard-grid',
  'datatable':      '@manggala31/react-datatable',
  'spotlight':      '@manggala31/react-spotlight',
  'status-page':    '@manggala31/react-status-page',
  'schema-form':    '@manggala31/schema-form-react',
  'sentinel':       'manggala/sentinel — WAF & Security Dashboard',
  'tenancy':        'manggala/tenancy — Universal Multi-Tenancy Engine',
};

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenSpotlight: () => void;
  isCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onOpenSpotlight, isCollapsed }) => (
  <header className={`app-header${isCollapsed ? ' collapsed' : ''}`}>
    <div className="header-title">
      <span className="header-badge"><Sparkles size={10} /> Live Demo</span>
      <span className="header-context">{titles[activeTab]}</span>
    </div>

    <div className="header-actions">
      <button className="search-trigger" onClick={onOpenSpotlight}>
        <Search size={13} />
        <span>Search packages...</span>
        <kbd className="kbd">⌘K</kbd>
      </button>
      <a
        href="https://ilhamhattamanggala.my.id"
        target="_blank"
        rel="noopener noreferrer author"
        className="github-btn"
        title="Ilham Hatta Manggala Portfolio Website"
      >
        <Globe size={14} style={{ color: 'var(--accent)' }} />
        <span>ilhamhattamanggala.my.id</span>
        <ExternalLink size={11} />
      </a>
      <a
        href="https://github.com/IlhamHattaManggala"
        target="_blank"
        rel="noopener noreferrer"
        className="github-btn"
      >
        <Github size={14} />
        <span>GitHub</span>
        <ExternalLink size={11} />
      </a>
    </div>
  </header>
);
