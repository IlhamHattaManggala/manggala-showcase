import React, { useState } from 'react';
import { Play, Code2, Copy, Check } from 'lucide-react';

interface CodeSnippetViewerProps {
  previewContent: React.ReactNode;
  reactCode?: string;
  laravelCode?: string;
  title?: string;
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  previewContent,
  reactCode,
  laravelCode,
  title = 'Interactive Sandbox',
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'react' | 'laravel'>('preview');
  const [copied, setCopied] = useState(false);

  const activeCode = activeTab === 'react' ? reactCode : activeTab === 'laravel' ? laravelCode : '';

  const handleCopy = () => {
    if (!activeCode) return;
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="snippet-viewer">
      {/* Tabs */}
      <div className="snippet-tabs">
        <span className="snippet-title">{title}</span>
        <div className="tab-group">
          <button
            className={`tab-btn${activeTab === 'preview' ? ' active-preview' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Play size={11} /> Preview
          </button>
          {reactCode && (
            <button
              className={`tab-btn${activeTab === 'react' ? ' active-react' : ''}`}
              onClick={() => setActiveTab('react')}
            >
              <Code2 size={11} /> React JSX
            </button>
          )}
          {laravelCode && (
            <button
              className={`tab-btn${activeTab === 'laravel' ? ' active-laravel' : ''}`}
              onClick={() => setActiveTab('laravel')}
            >
              <Code2 size={11} /> Laravel PHP
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="snippet-body">
        {activeTab === 'preview' ? (
          <div className="snippet-preview">{previewContent}</div>
        ) : (
          <div className="code-block" style={{ width: '100%' }}>
            <button className="code-copy-btn" onClick={handleCopy}>
              {copied ? <><Check size={12} style={{ color: '#22c55e' }} /> Copied</> : <><Copy size={12} /> Copy Code</>}
            </button>
            <pre><code>{activeCode}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
};
