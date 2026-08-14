import React, { useState } from 'react';
import { useSpotlight } from '@manggala31/react-spotlight';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { InstallBadge } from '../components/InstallBadge';
import { Search, Command, Sparkles, CheckCircle2 } from 'lucide-react';

const reactCode = `import { SpotlightProvider, Spotlight, useSpotlight } from '@manggala31/react-spotlight';
import '@manggala31/react-spotlight/styles.css';

// Wrap your app once:
<SpotlightProvider actions={actions}>
  <Spotlight placeholder="Search pages, resources, actions..." />
  <YourApp />
</SpotlightProvider>

// Open programmatically from anywhere:
const { openSpotlight } = useSpotlight();
<button onClick={openSpotlight}>Open Search</button>`;

const phpCode = `<?php
use Manggala\\Spotlight\\SpotlightCommand;

class GlobalSearchSpotlight extends Spotlight
{
    public function register(): array
    {
        return [
            SpotlightCommand::make('Create New User')
                ->icon('user-plus')
                ->keywords(['new', 'add', 'create'])
                ->action(fn () => redirect()->route('users.create')),

            SpotlightCommand::make('Export PDF Report')
                ->shortcut('E', 'P')
                ->action(ExportReportJob::class),
        ];
    }
}`;

export const SpotlightDemoView: React.FC = () => {
  const { openSpotlight } = useSpotlight();
  const [fired, setFired] = useState(false);

  const handleOpen = () => {
    setFired(true);
    openSpotlight();
  };

  return (
    <div className="space-y-6">
      <div className="view-header">
        <div>
          <div className="view-title">
            <Search size={20} style={{ color: 'var(--accent)' }} />
            <h1>Spotlight Search</h1>
            <span className="tag tag-blue">React</span>
          </div>
          <p className="view-subtitle">
            Keyboard-driven Command Palette (Cmd+K / Ctrl+K) with fuzzy search, group actions, and shortcuts.
          </p>
        </div>
        <div className="install-row">
          <InstallBadge command="npm i @manggala31/react-spotlight" type="npm" />
          <InstallBadge command="composer require manggala/laravel-spotlight" type="composer" />
        </div>
      </div>

      <CodeSnippetViewer
        title="Command Palette Sandbox (Cmd+K)"
        reactCode={reactCode}
        laravelCode={phpCode}
        previewContent={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-glow)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Command size={26} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ textAlign: 'center', maxWidth: 380 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Try the Command Palette
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Press <kbd style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--bg-muted)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>⌘K</kbd> or <kbd style={{ padding: '2px 7px', borderRadius: 5, background: 'var(--bg-muted)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>Ctrl+K</kbd> to open the search palette, or click the button below.
              </p>
            </div>
            <button
              onClick={handleOpen}
              className="btn-primary"
              style={{ width: '100%', maxWidth: 320, justifyContent: 'center', padding: '10px 20px' }}
            >
              <Sparkles size={14} /> Open Spotlight Search
            </button>
            {fired && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', padding: '6px 14px', background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--radius-sm)' }}>
                <CheckCircle2 size={14} /> Spotlight opened — try typing a package name!
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};
