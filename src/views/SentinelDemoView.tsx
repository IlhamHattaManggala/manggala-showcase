import React, { useState } from 'react';
import { InstallBadge } from '../components/InstallBadge';
import {
  ShieldAlert, ShieldCheck, ShieldX, Eye, Lock, Zap,
  AlertTriangle, Ban, Clock, Activity, Terminal, ArrowRight,
  CheckCircle2, ExternalLink,
} from 'lucide-react';

/* ── Mock Security Dashboard Data ──────────────────────────── */
interface ThreatLog {
  id: number;
  ip: string;
  url: string;
  threatType: string;
  score: number;
  status: 'blocked' | 'logged';
  time: string;
}

const mockLogs: ThreatLog[] = [
  { id: 1, ip: '185.220.101.42', url: '/api/users?id=1 UNION SELECT', threatType: 'SQL Injection', score: 5, status: 'blocked', time: '2 s ago' },
  { id: 2, ip: '45.79.83.123',   url: '/search?q=<script>alert(1)</script>', threatType: 'XSS',           score: 4, status: 'blocked', time: '18 s ago' },
  { id: 3, ip: '91.108.4.55',    url: '/file?path=../../../../etc/passwd',   threatType: 'Path Traversal', score: 5, status: 'blocked', time: '1 m ago' },
  { id: 4, ip: '103.155.92.7',   url: '/exec?cmd=system("whoami")',          threatType: 'RCE',            score: 5, status: 'blocked', time: '4 m ago' },
  { id: 5, ip: '178.32.214.88',  url: '/login', threatType: 'Brute Force',    score: 3, status: 'logged',  time: '7 m ago' },
  { id: 6, ip: '5.255.253.6',    url: '/login', threatType: 'Brute Force',    score: 5, status: 'blocked', time: '12 m ago' },
];

const blockedIps = [
  { ip: '185.220.101.42', country: 'RU', reason: 'SQLi + RCE', since: '2026-08-13' },
  { ip: '45.79.83.123',   country: 'DE', reason: 'XSS Spam',   since: '2026-08-12' },
  { ip: '91.108.4.55',    country: 'NL', reason: 'Path Traversal Scan', since: '2026-08-11' },
];

/* ── PHP Code Snippets ─────────────────────────────────────── */
const installCode = `# 1. Install via Composer
composer require manggala/sentinel

# 2. Auto-install: publish config, migrations & dashboard
php artisan sentinel:install

# 3. Run migrations (creates sentinel_logs & sentinel_blocked_ips)
php artisan migrate`;

const middlewareCode = `<?php
// bootstrap/app.php (Laravel 11, 12, 13)
use Manggala\\Sentinel\\Http\\Middleware\\SentinelGuardMiddleware;
use Manggala\\Sentinel\\Http\\Middleware\\SentinelBruteForceMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {

        // Register WAF globally — protects every route
        $middleware->append(SentinelGuardMiddleware::class);

        // Alias brute-force guard for auth endpoints
        $middleware->alias([
            'sentinel.bruteforce' => SentinelBruteForceMiddleware::class,
        ]);
    })
    ->create();

// Apply brute force guard on login route
Route::post('/login', [AuthController::class, 'store'])
    ->middleware('sentinel.bruteforce');`;

const configCode = `<?php
// config/sentinel.php
return [
    // Anomaly score threshold to block (default: 5)
    'threshold' => env('SENTINEL_THRESHOLD', 5),

    // Auto-ban after N blocked attempts from same IP
    'auto_ban_attempts' => env('SENTINEL_AUTO_BAN', 10),

    // Temporary lockout duration in seconds
    'lockout_duration' => env('SENTINEL_LOCKOUT', 60),

    // Dashboard access path
    'dashboard_path' => env('SENTINEL_PATH', 'sentinel'),

    // Allow these IPs to bypass scanning (e.g. internal tools)
    'trusted_ips' => explode(',', env('SENTINEL_TRUSTED_IPS', '127.0.0.1')),

    // Stack adapter: 'blade' | 'livewire' | 'inertia-react' | 'inertia-vue' | 'api'
    'stack' => env('SENTINEL_STACK', 'blade'),
];`;

const apiCode = `GET /api/sentinel/metrics
Authorization: Bearer {token}

{
  "status": "success",
  "data": {
    "total_attacks_prevented": 1420,
    "blocked_ips_count": 18,
    "threat_breakdown": {
      "sqli":  520,   // SQL Injection
      "xss":   410,   // Cross-Site Scripting
      "lfi":   290,   // Path Traversal / LFI
      "rce":   200    // Remote Code Execution
    }
  }
}`;

/* ── Threat type badge helper ──────────────────────────────── */
const threatBadge = (type: string) => {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    'SQL Injection': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)' },
    'XSS':           { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)' },
    'Path Traversal':{ color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)' },
    'RCE':           { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)' },
    'Brute Force':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  };
  const s = map[type] ?? { color: '#8b8ba8', bg: 'rgba(139,139,168,0.1)', border: 'rgba(139,139,168,0.2)' };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
      {type}
    </span>
  );
};

const cliCommands = [
  { cmd: 'php artisan sentinel:install',       desc: 'Publish config, migrations & dashboard assets' },
  { cmd: 'php artisan sentinel:ban {ip}',      desc: 'Permanently ban an IP address' },
  { cmd: 'php artisan sentinel:unban {ip}',    desc: 'Remove IP from permanent ban list' },
  { cmd: 'php artisan sentinel:logs',          desc: 'Display recent threat log entries in terminal' },
  { cmd: 'php artisan sentinel:stats',         desc: 'Print threat statistics summary' },
  { cmd: 'php artisan sentinel:purge-logs',    desc: 'Purge sentinel_logs table (with confirmation)' },
];

export const SentinelDemoView: React.FC = () => {
  const [activeSnippet, setActiveSnippet] = useState<'install' | 'middleware' | 'config' | 'api'>('install');

  const snippetMap = {
    install:    installCode,
    middleware: middlewareCode,
    config:     configCode,
    api:        apiCode,
  };

  const snippetLabels = {
    install:    '1. Install',
    middleware: '2. Middleware',
    config:     '3. Config',
    api:        '4. REST API',
  };

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="view-header">
        <div>
          <div className="view-title">
            <ShieldAlert size={20} style={{ color: '#ef4444' }} />
            <h1>Sentinel WAF</h1>
            <span className="tag tag-red">Composer</span>
          </div>
          <p className="view-subtitle">
            Universal Web Application Firewall, OWASP Threat Scanner, Smart Lockout Shield & Security Monitoring Dashboard for Laravel 10–13.
          </p>
        </div>
        <div className="install-row">
          <InstallBadge command="composer require manggala/sentinel" type="composer" />
          <a
            href="https://github.com/IlhamHattaManggala/sentinel"
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
          { label: 'OWASP Threats Covered', value: '4 Scanners', sub: 'SQLi · XSS · LFI · RCE', icon: ShieldCheck, color: '#22c55e' },
          { label: 'Laravel Support',        value: '10 · 11 · 12 · 13', sub: 'PHP ^8.2 – 8.4', icon: Zap, color: '#3b82f6' },
          { label: 'Frontend Adapters',      value: '5 Stacks', sub: 'Blade, Livewire, Inertia, API', icon: Eye, color: '#a855f7' },
          { label: 'Smart Lockout System',   value: '3-Tier',  sub: 'Captcha → Temp → Perm Ban', icon: Lock, color: '#f59e0b' },
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

      {/* ── OWASP Scanners ──────────────────────────────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={15} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Threat Inspection Engine — Anomaly Scoring Model</span>
        </div>
        <div className="grid-4" style={{ gap: 10 }}>
          {[
            { name: 'SQL Injection', desc: 'UNION SELECT, OR 1=1, DROP TABLE, SLEEP(), BENCHMARK()', score: '+5 pts', color: '#ef4444', sample: "?id=1 UNION SELECT * FROM users" },
            { name: 'XSS Scanner', desc: '<script>, javascript:, onload=, onerror=, alert()', score: '+4 pts', color: '#f97316', sample: "?q=<script>alert(document.cookie)</script>" },
            { name: 'Path Traversal', desc: '../../../../etc/passwd, ..\\windows\\system32', score: '+5 pts', color: '#a855f7', sample: "?file=../../../../etc/passwd" },
            { name: 'Command Injection', desc: 'system(), passthru(), exec(), shell_exec(), eval()', score: '+5 pts', color: '#f59e0b', sample: "?cmd=system('whoami')" },
          ].map(({ name, desc, score, color, sample }) => (
            <div key={name} style={{ background: '#0a0a0f', border: `1px solid ${color}25`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{name}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '2px 6px', borderRadius: 99 }}>{score}</span>
              </div>
              <p style={{ fontSize: 10, color: '#52526a', lineHeight: 1.6, marginBottom: 8 }}>{desc}</p>
              <code style={{ fontSize: 10, color: color, fontFamily: 'var(--font-mono)', wordBreak: 'break-all', lineHeight: 1.5 }}>{sample}</code>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 11, color: '#fca5a5', lineHeight: 1.6 }}>
          <strong>Threshold:</strong> Requests with <strong>Anomaly Score ≥ 5</strong> (configurable via <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(239,68,68,0.1)', padding: '0 4px', borderRadius: 3 }}>SENTINEL_THRESHOLD</code>) are automatically blocked with HTTP <strong>403 Forbidden</strong> and logged to <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(239,68,68,0.1)', padding: '0 4px', borderRadius: 3 }}>sentinel_logs</code>.
        </div>
      </div>

      {/* ── Brute Force Protection ──────────────────────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={15} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Smart Lockout System — 3-Tier Brute Force Protection</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { tier: 'Tier 1', label: '1–2 Failed Attempts', action: 'Pass Through', desc: 'Normal flow, no friction for genuine users.', color: '#22c55e', icon: CheckCircle2 },
            { tier: 'Tier 2', label: '3 Failed Attempts', action: 'Captcha Challenge', desc: 'Triggers reCAPTCHA / Cloudflare Turnstile.', color: '#f59e0b', icon: AlertTriangle },
            { tier: 'Tier 3', label: '5+ / Bot Flood', action: 'Temp / Perm Ban', desc: '60s temporary lockout → permanent IP ban for bots.', color: '#ef4444', icon: Ban },
          ].map(({ tier, label, action, desc, color, icon: Icon }) => (
            <div key={tier} style={{ background: '#0a0a0f', border: `1px solid ${color}25`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14} style={{ color }} />
                <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tier}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{label}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: 99, alignSelf: 'flex-start' }}>{action}</div>
              <p style={{ fontSize: 10, color: '#52526a', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mock Security Dashboard ─────────────────────────── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Dashboard header */}
        <div style={{ padding: '12px 16px', background: '#0d0d14', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={13} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>Security Monitoring Dashboard</span>
            <span style={{ fontSize: 10, color: '#52526a' }}>— Mock Preview (accessible at /sentinel)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>WAF Active</span>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #1e1e2e' }}>
          {[
            { label: 'Total Blocked', value: '1,420', icon: ShieldX, color: '#ef4444' },
            { label: 'Blocked IPs',   value: '18',    icon: Ban, color: '#f97316' },
            { label: 'Last 24h Attacks', value: '127', icon: AlertTriangle, color: '#f59e0b' },
            { label: 'Avg Response',  value: '0.8 ms', icon: Clock, color: '#3b82f6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ padding: '14px 16px', borderRight: '1px solid #1e1e2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Icon size={12} style={{ color }} />
                <span style={{ fontSize: 10, color: '#52526a', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f4f4f8', letterSpacing: '-0.3px' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Threat log table */}
        <div style={{ padding: '12px 16px 4px', borderBottom: '1px solid #161620', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba8' }}>Recent Threat Log</span>
          <span style={{ fontSize: 10, color: '#52526a' }}>Auto-refreshes every 30s</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#0d0d14' }}>
              {['IP Address', 'Endpoint', 'Threat Type', 'Score', 'Status', 'Time'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: '#52526a', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #1e1e2e' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #161620' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#16161f')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontSize: 11 }}>{log.ip}</td>
                <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: '#52526a', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.url}</td>
                <td style={{ padding: '9px 14px' }}>{threatBadge(log.threatType)}</td>
                <td style={{ padding: '9px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: log.score >= 5 ? '#ef4444' : '#f59e0b' }}>{log.score}</span>
                  <span style={{ fontSize: 10, color: '#52526a' }}>/5</span>
                </td>
                <td style={{ padding: '9px 14px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.03em',
                    background: log.status === 'blocked' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                    color:      log.status === 'blocked' ? '#ef4444' : '#f59e0b',
                    border:     `1px solid ${log.status === 'blocked' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  }}>
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '9px 14px', color: '#52526a', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {log.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Blocked IPs section */}
        <div style={{ padding: '12px 16px 4px', borderTop: '1px solid #161620', borderBottom: '1px solid #161620', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ban size={12} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba8' }}>Permanently Banned IPs ({blockedIps.length})</span>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {blockedIps.map(({ ip, country, reason, since }) => (
            <div key={ip} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', background: '#1e1e2e', borderRadius: 4, color: '#8b8ba8', fontFamily: 'var(--font-mono)' }}>{country}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fca5a5' }}>{ip}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 10, color: '#52526a' }}>{reason}</span>
                <span style={{ fontSize: 10, color: '#52526a', fontFamily: 'var(--font-mono)' }}>since {since}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Code Snippets ───────────────────────────────────── */}
      <div className="snippet-viewer">
        <div className="snippet-tabs">
          <span className="snippet-title">Setup & Configuration Guide</span>
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

      {/* ── CLI Commands ────────────────────────────────────── */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={15} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Artisan CLI Commands</span>
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
      <div style={{ padding: 24, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>manggala/sentinel on Packagist</div>
          <div style={{ fontSize: 11, color: '#8b8ba8' }}>Now available on Packagist · v1.0.0 · MIT License</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <InstallBadge command="composer require manggala/sentinel" type="composer" />
          <a href="https://packagist.org/packages/manggala/sentinel" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={12} /> Packagist <ArrowRight size={11} />
          </a>
        </div>
      </div>

    </div>
  );
};
