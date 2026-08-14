import React, { useState } from 'react';
import { StatusPage } from '@manggala31/react-status-page';
import { mockServicesData, mockIncidentsData } from '../mock/demoData';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { InstallBadge } from '../components/InstallBadge';
import { Activity, RefreshCw } from 'lucide-react';

const reactCode = `import { StatusPage } from '@manggala31/react-status-page';
import '@manggala31/react-status-page/styles.css';

<StatusPage
  systemName="Production Infrastructure"
  services={services}
  incidents={incidents}
  showUptimeBars={true}
  autoRefreshIntervalSeconds={30}
  onRefresh={() => refetch()}
/>`;

const phpCode = `<?php
use Manggala\\StatusPage\\StatusPage;
use Manggala\\StatusPage\\Checks\\DatabaseCheck;
use Manggala\\StatusPage\\Checks\\RedisCheck;

class SystemHealthDiagnostic extends StatusPage
{
    public function checks(): array
    {
        return [
            DatabaseCheck::make('Primary Database')->timeoutMs(50),
            RedisCheck::make('Redis Cache Layer')->timeoutMs(20),
            HttpCheck::make('External Payment API')->url(config('services.stripe.url')),
        ];
    }
}`;

export const StatusPageDemoView: React.FC = () => {
  const [services, setServices] = useState(mockServicesData);

  const handleRefresh = () => {
    setServices(services.map(s => ({ ...s, latencyMs: Math.floor(Math.random() * 40) + 8 })));
  };

  return (
    <div className="space-y-6">
      <div className="view-header">
        <div>
          <div className="view-title">
            <Activity size={20} style={{ color: 'var(--accent)' }} />
            <h1>Status Page</h1>
            <span className="tag tag-blue">React</span>
          </div>
          <p className="view-subtitle">Self-hosted application health diagnostics, uptime history, and incident status page.</p>
        </div>
        <div className="install-row">
          <InstallBadge command="npm i @manggala31/react-status-page" type="npm" />
          <InstallBadge command="composer require manggala/laravel-status-page" type="composer" />
        </div>
      </div>

      <CodeSnippetViewer
        title="Service Health Dashboard Sandbox"
        reactCode={reactCode}
        laravelCode={phpCode}
        previewContent={
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Live Telemetry Simulation</span>
              <button
                onClick={handleRefresh}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RefreshCw size={12} /> Re-ping Nodes
              </button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <StatusPage
                systemName="Manggala Infrastructure"
                services={services}
                incidents={mockIncidentsData}
                showUptimeBars={true}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
