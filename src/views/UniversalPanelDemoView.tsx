import React from 'react';
import { InstallBadge } from '../components/InstallBadge';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { Layers, Terminal } from 'lucide-react';

const cliCommands = [
  { cmd: 'php artisan universal-panel:install',             desc: '1-Step install & asset publishing' },
  { cmd: 'php artisan make:panel-resource Product --generate', desc: 'Auto Model, Migration & CRUD pages' },
  { cmd: 'php artisan make:role Superadmin Manager Editor', desc: 'Role matrices and permission sets' },
  { cmd: 'php artisan make:permission-panel',               desc: 'GUI permission matrix page' },
  { cmd: 'php artisan universal-panel:doctor',              desc: 'Diagnostics: PHP 8.4+, Vite, PDO health' },
];

const phpCode = `<?php
use Manggala\\UniversalPanel\\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        ->id('superadmin')
        ->path('superadmin')
        ->defaultStack('inertia-react')  // blade|livewire|inertia-react|inertia-vue|api
        ->sidebarWidth('160px')
        ->collapsedWidth('52px')
        ->spotlightSearch(enabled: true)
        ->authSuite(enabled: true)
        ->resources([
            ProductResource::class,
            UserResource::class,
            RoleResource::class,
        ]);
}`;

export const UniversalPanelDemoView: React.FC = () => (
  <div className="space-y-6">
    <div className="view-header">
      <div>
        <div className="view-title">
          <Layers size={20} style={{ color: 'var(--accent)' }} />
          <h1>Universal Panel</h1>
          <span className="tag tag-red">Laravel Core</span>
        </div>
        <p className="view-subtitle">
          Admin panel framework for Laravel 10–13. Blade, Livewire, Inertia React/Vue, REST API — single codebase.
        </p>
      </div>
      <InstallBadge command="composer require manggala/universal-panel" type="composer" />
    </div>

    {/* Stats row */}
    <div className="grid-4">
      {[
        { label: 'Laravel Support', value: '10 · 11 · 12 · 13', sub: 'PHP ^8.2 – 8.4' },
        { label: 'Frontend Adapters', value: '5 Stacks', sub: 'Blade, Livewire, Inertia, API' },
        { label: 'Sidebar Dimensions', value: '160px / 52px', sub: 'Slim + Collapsed icon mode' },
        { label: 'CLI Commands', value: '27 Artisan', sub: 'Generators & management tools' },
      ].map(({ label, value, sub }) => (
        <div key={label} className="stat-card">
          <div className="stat-label">{label}</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{value}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      ))}
    </div>

    {/* Code Showcase */}
    <CodeSnippetViewer
      title="Multi-Panel Builder & Fluent Configuration"
      laravelCode={phpCode}
      previewContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
            <Terminal size={14} style={{ color: 'var(--accent)' }} /> Artisan CLI Commands Suite (27 total)
          </div>
          {cliCommands.map(({ cmd, desc }) => (
            <div key={cmd} className="cli-row">
              <span className="cli-cmd">{cmd}</span>
              <span className="cli-desc">{desc}</span>
            </div>
          ))}
        </div>
      }
    />
  </div>
);
