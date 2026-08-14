import React, { useState } from 'react';
import { InstallBadge } from '../components/InstallBadge';
import {
  Building2, Server, Database, Globe, Shield, Terminal, ArrowRight,
  CheckCircle2, ExternalLink, HardDrive, Cpu, Layers
} from 'lucide-react';

/* ── Mock Tenant Data for Workspace Switcher Sandbox ──────── */
interface MockTenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  mode: 'single-db' | 'multi-db' | 'hybrid';
  dbName: string;
  storagePath: string;
  cachePrefix: string;
  activeUsers: number;
  ordersCount: number;
  plan: 'Starter' | 'Pro' | 'Enterprise';
}

const mockTenants: MockTenant[] = [
  {
    id: 't-01',
    name: 'Acme Corporation',
    subdomain: 'acme',
    domain: 'portal.acmecorp.com',
    mode: 'single-db',
    dbName: 'central_saas_db (tenant_id: acme)',
    storagePath: 'storage/app/tenants/acme/',
    cachePrefix: 'tenant:acme:',
    activeUsers: 48,
    ordersCount: 1240,
    plan: 'Pro',
  },
  {
    id: 't-02',
    name: 'Globex Industries',
    subdomain: 'globex',
    domain: 'globex.saas.app',
    mode: 'multi-db',
    dbName: 'tenant_globex_production_db',
    storagePath: 'storage/app/tenants/globex/',
    cachePrefix: 'tenant:globex:',
    activeUsers: 312,
    ordersCount: 8920,
    plan: 'Enterprise',
  },
  {
    id: 't-03',
    name: 'Stark Enterprises',
    subdomain: 'stark',
    domain: 'stark.manggala.dev',
    mode: 'hybrid',
    dbName: 'tenant_stark_private_db',
    storagePath: 'storage/app/tenants/stark/',
    cachePrefix: 'tenant:stark:',
    activeUsers: 140,
    ordersCount: 4500,
    plan: 'Enterprise',
  },
];

/* ── PHP Code Snippets ─────────────────────────────────────── */
const installCode = `# 1. Install via Composer
composer require manggala/tenancy

# 2. 1-Step Setup: Publish config & central tenants migration
php artisan tenancy:install

# 3. Run central database migration
php artisan migrate`;

const middlewareCode = `<?php
// bootstrap/app.php (Laravel 11, 12, 13)
use Manggala\\Tenancy\\Http\\Middleware\\IdentifyTenantBySubdomain;
use Manggala\\Tenancy\\Http\\Middleware\\IdentifyTenantByHeader;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {

        // Alias tenant resolvers for web & API route groups
        $middleware->alias([
            'tenant.subdomain' => IdentifyTenantBySubdomain::class,
            'tenant.header'    => IdentifyTenantByHeader::class, // X-Tenant-ID
        ]);
    })
    ->create();

// Apply tenant resolution on web routes
Route::middleware(['web', 'tenant.subdomain'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});`;

const traitCode = `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Manggala\\Tenancy\\Traits\\BelongsToTenant;

class Invoice extends Model
{
    use BelongsToTenant;
    // Otomatis inject WHERE tenant_id = 'xxx' & auto-fill tenant_id on create!
}

// Global scope bypass for Superadmin reporting:
$allInvoices = Invoice::withoutTenant()->get();`;

const contextCode = `<?php
use Manggala\\Tenancy\\Facades\\Tenancy;

// 1. Get currently active tenant instance
$currentTenant = Tenancy::current();

// 2. Safely switch context and run code under target tenant scope
Tenancy::runFor($targetTenant, function ($tenant) {
    // All Eloquent queries, Storage paths & Cache keys inside this closure
    // automatically operate under $targetTenant context
    Invoice::create([
        'title'  => 'Cross-Tenant Invoice',
        'amount' => 500000,
    ]);
});
// After closure exits, state is 100% restored to $currentTenant automatically!`;

const cliCommands = [
  { cmd: 'php artisan tenancy:install',                    desc: '1-Step setup: publish config & central tenant migrations' },
  { cmd: 'php artisan tenant:create {name} --domain= --db=', desc: 'Provision a new tenant record & optional database' },
  { cmd: 'php artisan tenant:delete {id} --drop-db --force', desc: 'Safely delete tenant record and optionally drop database' },
  { cmd: 'php artisan tenant:migrate {--tenant=}',          desc: 'Execute migrations across tenant databases' },
  { cmd: 'php artisan tenant:rollback {--step=1}',          desc: 'Rollback migrations across tenant databases' },
  { cmd: 'php artisan tenant:seed {--class=DatabaseSeeder}',desc: 'Execute database seeders across tenant databases' },
  { cmd: 'php artisan tenant:list',                         desc: 'Display formatted ASCII table of all registered tenants' },
  { cmd: 'php artisan tenant:run {id} "{command}"',          desc: 'Execute arbitrary artisan command in tenant context' },
  { cmd: 'php artisan tenant:toggle {id}',                  desc: 'Suspend or reactivate tenant access instantly' },
  { cmd: 'php artisan tenant:doctor',                        desc: 'Diagnostic tool for DB, storage isolation & memory leaks' },
];

export const TenancyDemoView: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<MockTenant>(mockTenants[0]);
  const [activeSnippet, setActiveSnippet] = useState<'install' | 'middleware' | 'trait' | 'context'>('install');

  const snippetMap = {
    install:    installCode,
    middleware: middlewareCode,
    trait:      traitCode,
    context:    contextCode,
  };

  const snippetLabels = {
    install:    '1. Install',
    middleware: '2. Middleware',
    trait:      '3. BelongsToTenant',
    context:    '4. Context Switcher',
  };

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="view-header">
        <div>
          <div className="view-title">
            <Building2 size={20} style={{ color: '#3b82f6' }} />
            <h1>Tenancy Engine</h1>
            <span className="tag tag-red">Composer</span>
          </div>
          <p className="view-subtitle">
            Universal Multi-Tenancy Engine for Laravel 10–13 supporting Single-DB (Row-Level), Multi-DB & Hybrid Modes with 10 CLI Commands.
          </p>
        </div>
        <div className="install-row">
          <InstallBadge command="composer require manggala/tenancy" type="composer" />
          <a
            href="https://github.com/IlhamHattaManggala/tenancy"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
          >
            <ExternalLink size={13} /> View on GitHub
          </a>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      <div className="grid-4">
        {[
          { label: 'Isolation Modes',      value: '3 Modes',      sub: 'Single-DB · Multi-DB · Hybrid', icon: Database, color: '#3b82f6' },
          { label: 'Resolvers',            value: '4 Middlewares',sub: 'Subdomain · Domain · Header · Path', icon: Globe, color: '#a855f7' },
          { label: 'Resource Isolators',   value: '4 Bootstrappers', sub: 'DB · Storage · Cache · Logs', icon: HardDrive, color: '#22c55e' },
          { label: 'Artisan CLI Suite',    value: '10 Commands',  sub: 'Create, Migrate, Run, Doctor', icon: Terminal, color: '#f59e0b' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} style={{ color }} />
              </div>
              <span className="stat-label" style={{ margin: 0 }}>{label}</span>
            </div>
            <div className="stat-value" style={{ fontSize: 15 }}>{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── 3 Architecture Modes Explanation ──────────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={15} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Dual & Hybrid Isolation Architecture</span>
        </div>
        <div className="grid-3" style={{ gap: 12 }}>
          {[
            {
              mode: 'Single-DB Mode',
              tag: 'Shared DB & Schema',
              desc: 'Semua tenant berada di 1 database. Trait BelongsToTenant menyuntikkan query scope WHERE tenant_id = ? secara otomatis.',
              color: '#3b82f6',
              highlight: 'Paling hemat hosting & migrasi 1x',
            },
            {
              mode: 'Multi-DB Mode',
              tag: 'Database-per-Tenant',
              desc: 'Setiap tenant memiliki database terpisah. DatabaseBootstrapper mengubah koneksi PDO & reconnect secara runtime.',
              color: '#a855f7',
              highlight: 'Isolasi fisik 100% untuk Enterprise',
            },
            {
              mode: 'Hybrid Mode',
              tag: 'Tiered Multi-Tenancy',
              desc: 'Single-DB untuk Tier Basic/Pro, otomatis beralih ke Multi-DB jika tenant memiliki atribut db_name terisi.',
              color: '#22c55e',
              highlight: 'Kombinasi hemat & kustomisasi SaaS',
            },
          ].map(({ mode, tag, desc, color, highlight }) => (
            <div key={mode} style={{ background: '#0a0a0f', border: `1px solid ${color}25`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{mode}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${color}18`, color, border: `1px solid ${color}30` }}>{tag}</span>
              </div>
              <p style={{ fontSize: 11, color: '#8b8ba8', lineHeight: 1.6 }}>{desc}</p>
              <div style={{ marginTop: 'auto', fontSize: 10, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> {highlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive Workspace Switcher Sandbox ──────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server size={15} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Interactive Tenancy Sandbox & Telemetry Simulator</span>
          </div>
          <span style={{ fontSize: 10, color: '#52526a' }}>Simulating TenancyManager::setCurrent()</span>
        </div>

        {/* Tenant selector buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {mockTenants.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTenant(t)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${selectedTenant.id === t.id ? '#3b82f6' : '#1e1e2e'}`,
                background: selectedTenant.id === t.id ? 'rgba(59, 130, 246, 0.12)' : '#0a0a0f',
                color: selectedTenant.id === t.id ? '#60a5fa' : '#8b8ba8',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{t.subdomain}.app.com</div>
            </button>
          ))}
        </div>

        {/* Dynamic Telemetry Box */}
        <div style={{ background: '#07070c', border: '1px solid #1e1e2e', borderRadius: 10, padding: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#52526a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 6 }}>Resolved Context State</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f4f4f8', marginBottom: 10 }}>{selectedTenant.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#c4c4d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={13} style={{ color: '#a855f7' }} /> Domain: <code style={{ fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>{selectedTenant.domain}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Database size={13} style={{ color: '#3b82f6' }} /> Database: <code style={{ fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>{selectedTenant.dbName}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <HardDrive size={13} style={{ color: '#22c55e' }} /> Storage: <code style={{ fontFamily: 'var(--font-mono)', color: '#4ade80' }}>{selectedTenant.storagePath}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={13} style={{ color: '#f59e0b' }} /> Cache Prefix: <code style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>{selectedTenant.cachePrefix}</code>
              </div>
            </div>
          </div>

          <div style={{ borderLeft: '1px dashed #1e1e2e', paddingLeft: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#8b8ba8' }}>Tenant Plan</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{selectedTenant.plan} Tier</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#8b8ba8' }}>Active Users</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#f4f4f8' }}>{selectedTenant.activeUsers}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#8b8ba8' }}>Total Orders Scoped</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#22c55e' }}>{selectedTenant.ordersCount.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.08)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} /> Global Scope Active — 0 Cross-tenant Leakage
            </div>
          </div>
        </div>
      </div>

      {/* ── Code Snippets ───────────────────────────────────── */}
      <div className="snippet-viewer">
        <div className="snippet-tabs">
          <span className="snippet-title">Developer Integration Guide</span>
          <div className="tab-group">
            {(Object.keys(snippetLabels) as Array<keyof typeof snippetLabels>).map(key => (
              <button
                key={key}
                className={`tab-btn${activeSnippet === key ? ' active-laravel' : ''}`}
                onClick={() => setActiveSnippet(key)}
              >
                {snippetLabels[key]}
              </button>
            ))}
          </div>
        </div>
        <div className="snippet-body">
          <div style={{ width: '100%' }}>
            <pre><code>{snippetMap[activeSnippet]}</code></pre>
          </div>
        </div>
      </div>

      {/* ── 10 CLI Commands Suite ────────────────────────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={15} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Artisan CLI Commands Suite (10 Total Commands)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cliCommands.map(({ cmd, desc }) => (
            <div key={cmd} className="cli-row">
              <span className="cli-cmd">{cmd}</span>
              <span className="cli-desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <div style={{ padding: 24, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>manggala/tenancy on GitHub</div>
          <div style={{ fontSize: 11, color: '#8b8ba8' }}>Now available on GitHub · v1.0.0 · MIT License</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <InstallBadge command="composer require manggala/tenancy" type="composer" />
          <a href="https://github.com/IlhamHattaManggala/tenancy" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={12} /> GitHub Repo <ArrowRight size={11} />
          </a>
        </div>
      </div>

    </div>
  );
};
