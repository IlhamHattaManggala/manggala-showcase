import React, { useState } from 'react';
import { packagesCatalog } from '../mock/demoData';
import { InstallBadge } from '../components/InstallBadge';
import type { ActiveTab } from '../components/Sidebar';
import { Sparkles, Layers, Box, ArrowRight, Github, Code, Zap } from 'lucide-react';

interface LandingViewProps {
  onSelectTab: (tab: ActiveTab) => void;
}

const tabMap: Record<string, ActiveTab> = {
  'universal-panel': 'universal-panel',
  'react-dashboard-grid': 'dashboard-grid',
  'laravel-dashboard-builder': 'dashboard-grid',
  'react-datatable': 'datatable',
  'laravel-datatable': 'datatable',
  'react-spotlight': 'spotlight',
  'laravel-spotlight': 'spotlight',
  'react-status-page': 'status-page',
  'laravel-status-page': 'status-page',
  'schema-form-react': 'schema-form',
  'laravel-settings': 'schema-form',
  'sentinel': 'sentinel',
  'tenancy': 'tenancy',
};

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab }) => {
  const [filter, setFilter] = useState<'all' | 'react' | 'laravel'>('all');

  const packages = packagesCatalog.filter(p => filter === 'all' || p.category === filter);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <Sparkles size={11} />
          Open Source Ecosystem by <a href="https://ilhamhattamanggala.my.id" target="_blank" rel="noopener noreferrer author" style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Ilham Hatta Manggala</a>
        </div>
        <h1 className="hero-title">
          The Universal<br /><span>Open Source Ecosystem</span>
        </h1>
        <p className="hero-desc">
          High-performance, beautifully architected packages created by <strong>Ilham Hatta Manggala</strong> for Laravel 10–13 and React 18/19. Universal Panel, Sentinel WAF, Tenancy Engine, Cmd+K search, and more.
        </p>

        <div className="hero-installs">
          <InstallBadge command="composer require manggala/universal-panel" type="composer" />
          <InstallBadge command="npm i @manggala31/react-dashboard-grid" type="npm" />
          <InstallBadge command="npm i @manggala31/react-spotlight" type="npm" />
        </div>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => onSelectTab('universal-panel')}>
            Explore Core Panel <ArrowRight size={14} />
          </button>
          <button className="btn-secondary" onClick={() => onSelectTab('dashboard-grid')}>
            <Code size={14} /> Live Playground
          </button>
        </div>
      </section>

      {/* Highlights */}
      <div className="highlight-grid">
        <div className="highlight-card">
          <div className="highlight-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Layers size={18} style={{ color: '#3b82f6' }} />
          </div>
          <h3>Universal Stack Support</h3>
          <p>One PHP codebase powering Blade, Livewire v2/v3, Inertia React, Inertia Vue, and REST API — no lock-in.</p>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Box size={18} style={{ color: '#a855f7' }} />
          </div>
          <h3>WordPress-Inspired Layout</h3>
          <p>160px slim sidebar & 52px icon mode — dedicating 85–90% of screen real estate to your main workspace.</p>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <Zap size={18} style={{ color: '#22c55e' }} />
          </div>
          <h3>Zero Compromise Quality</h3>
          <p>Full TypeScript declarations, Pest PHP suites, no bloat, and Tailwind CSS with semantic dark-mode tokens.</p>
        </div>
      </div>

      {/* Catalog */}
      <div>
        <div className="catalog-header">
          <div className="catalog-header-left">
            <h2>Package Catalog</h2>
            <p>All {packagesCatalog.length} open-source packages in the Manggala Ecosystem</p>
          </div>
          <div className="filter-group">
            {(['all', 'react', 'laravel'] as const).map(f => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? `All (${packagesCatalog.length})`
                  : f === 'react' ? `NPM (${packagesCatalog.filter(p => p.category === 'react').length})`
                  : `Composer (${packagesCatalog.filter(p => p.category === 'laravel').length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="pkg-grid">
          {packages.map(pkg => {
            const isReact = pkg.category === 'react';
            const target = tabMap[pkg.id];
            const cmd = pkg.npmName ? `npm i ${pkg.npmName}` : `composer require ${pkg.composerName}`;
            return (
              <div key={pkg.id} className="pkg-card">
                <div className="pkg-card-top">
                  <span className={`tag ${isReact ? 'tag-blue' : 'tag-red'}`}>
                    {isReact ? 'NPM React' : 'Composer Laravel'}
                  </span>
                  <a href={pkg.githubUrl} target="_blank" rel="noopener noreferrer" className="icon-btn">
                    <Github size={14} />
                  </a>
                </div>

                <div className="pkg-card-body">
                  <div className="pkg-name">{pkg.name}</div>
                  <div className="pkg-desc">{pkg.description}</div>
                  <div className="pkg-badges">
                    {pkg.badges.map((b, i) => <span key={i} className="pkg-badge">{b}</span>)}
                  </div>
                </div>

                <div className="pkg-card-footer">
                  <InstallBadge command={cmd} type={isReact ? 'npm' : 'composer'} />
                  {target && (
                    <button className="demo-btn" onClick={() => onSelectTab(target)}>
                      Try Live Demo <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
