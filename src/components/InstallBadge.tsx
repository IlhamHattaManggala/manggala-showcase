import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface InstallBadgeProps {
  command: string;
  type?: 'npm' | 'composer';
}

export const InstallBadge: React.FC<InstallBadgeProps> = ({ command, type = 'npm' }) => {
  const [copied, setCopied] = useState(false);
  const isComposer = type === 'composer';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="install-badge" onClick={handleCopy} title="Click to copy">
      <Terminal
        size={12}
        className="install-badge-icon"
        style={{ color: isComposer ? '#ef4444' : '#3b82f6' }}
      />
      <span className="install-badge-cmd">{command}</span>
      <span className="install-badge-copy">
        {copied ? <Check size={12} style={{ color: '#22c55e' }} /> : <Copy size={12} />}
      </span>
      {copied && <span className="install-badge-feedback">Copied!</span>}
    </button>
  );
};
