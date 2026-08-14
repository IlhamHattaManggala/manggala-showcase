import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSpotlight } from './useSpotlight';
import type { SpotlightAction } from './types';

export interface SpotlightProps {
  placeholder?: string;
  emptyMessage?: string;
  maxResults?: number;
  className?: string;
  onClose?: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  maxResults = 10,
  className = '',
  onClose,
}) => {
  const { isOpen, closeSpotlight, actions } = useSpotlight();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery('');
    setSelectedIndex(0);
    closeSpotlight();
    if (onClose) onClose();
  }, [closeSpotlight, onClose]);

  const filteredActions = useMemo(() => {
    const flatActions: SpotlightAction[] = [];
    actions.forEach((group) => {
      group.actions.forEach((action) => {
        flatActions.push(action);
      });
    });

    if (!query.trim()) {
      return flatActions.slice(0, maxResults);
    }

    const lowerQuery = query.toLowerCase();
    return flatActions
      .filter((action) => {
        const matchLabel = action.label.toLowerCase().includes(lowerQuery);
        const matchDesc = action.description?.toLowerCase().includes(lowerQuery);
        const matchKeywords = action.keywords?.some((k) => k.toLowerCase().includes(lowerQuery));
        return matchLabel || matchDesc || matchKeywords;
      })
      .slice(0, maxResults);
  }, [actions, query, maxResults]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const executeAction = useCallback(
    (action: SpotlightAction) => {
      handleClose();
      action.onSelect(action);
    },
    [handleClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredActions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredActions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        executeAction(filteredActions[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="spotlight-overlay" onClick={handleClose}>
      <div
        className={`spotlight-container ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="spotlight-header">
          <svg className="spotlight-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="spotlight-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="spotlight-esc-badge" onClick={handleClose}>
            ESC
          </kbd>
        </div>

        <div className="spotlight-body">
          {filteredActions.length === 0 ? (
            <div className="spotlight-empty">{emptyMessage}</div>
          ) : (
            <ul className="spotlight-list">
              {filteredActions.map((action, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={action.id}
                    className={`spotlight-item ${isSelected ? 'spotlight-item-selected' : ''}`}
                    onClick={() => executeAction(action)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {action.icon && <span className="spotlight-item-icon">{action.icon}</span>}
                    <div className="spotlight-item-content">
                      <div className="spotlight-item-label">{action.label}</div>
                      {action.description && (
                        <div className="spotlight-item-desc">{action.description}</div>
                      )}
                    </div>
                    {action.shortcut && (
                      <div className="spotlight-item-shortcuts">
                        {action.shortcut.map((key) => (
                          <kbd key={key} className="spotlight-shortcut-badge">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
