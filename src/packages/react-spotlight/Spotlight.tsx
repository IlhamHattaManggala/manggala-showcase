import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSpotlight } from './useSpotlight';
import type { SpotlightAction } from './types';
import './styles.css';

export interface SpotlightProps {
  placeholder?: string;
  emptyMessage?: string;
  maxResults?: number;
  className?: string;
  onClose?: () => void;
  onSearchAsync?: (query: string) => Promise<SpotlightAction[]>;
}

// Fuzzy matching score calculator
function fuzzyScore(target: string, query: string): number {
  const targetLower = target.toLowerCase();
  const queryLower = query.toLowerCase();

  if (targetLower.includes(queryLower)) return 100;

  let score = 0;
  let tIdx = 0;
  for (let qIdx = 0; qIdx < queryLower.length; qIdx++) {
    const char = queryLower[qIdx];
    const foundIdx = targetLower.indexOf(char, tIdx);
    if (foundIdx === -1) return 0;
    score += (foundIdx === tIdx ? 10 : 5);
    tIdx = foundIdx + 1;
  }
  return score;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  maxResults = 10,
  className = '',
  onClose,
  onSearchAsync,
}) => {
  const { isOpen, closeSpotlight, actions } = useSpotlight();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [asyncResults, setAsyncResults] = useState<SpotlightAction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery('');
    setSelectedIndex(0);
    setAsyncResults([]);
    closeSpotlight();
    if (onClose) onClose();
  }, [closeSpotlight, onClose]);

  // Handle Async Search with Debounce
  useEffect(() => {
    if (!onSearchAsync || !query.trim()) {
      setAsyncResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await onSearchAsync(query);
        setAsyncResults(res);
      } catch (err) {
        console.error('Spotlight async search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearchAsync]);

  // Grouped and Fuzzy Filtered Actions
  const groupedResults = useMemo(() => {
    if (asyncResults.length > 0) {
      return [{ group: 'Async Results', actions: asyncResults }];
    }

    const groupsMap: Record<string, SpotlightAction[]> = {};

    actions.forEach((group) => {
      const matched = group.actions
        .map((action) => {
          if (!query.trim()) return { action, score: 1 };

          const scoreLabel = fuzzyScore(action.label, query);
          const scoreDesc = action.description ? fuzzyScore(action.description, query) * 0.7 : 0;
          const maxScore = Math.max(scoreLabel, scoreDesc);
          return { action, score: maxScore };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.action);

      if (matched.length > 0) {
        groupsMap[group.group] = matched;
      }
    });

    let totalCount = 0;
    const finalGroups: Array<{ group: string; actions: SpotlightAction[] }> = [];

    Object.entries(groupsMap).forEach(([groupName, items]) => {
      if (totalCount >= maxResults) return;
      const sliceCount = maxResults - totalCount;
      const slicedItems = items.slice(0, sliceCount);
      totalCount += slicedItems.length;
      finalGroups.push({ group: groupName, actions: slicedItems });
    });

    return finalGroups;
  }, [actions, query, maxResults, asyncResults]);

  const flatActionsList = useMemo(() => {
    const list: SpotlightAction[] = [];
    groupedResults.forEach((g) => {
      g.actions.forEach((a) => list.push(a));
    });
    return list;
  }, [groupedResults]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatActionsList.length]);

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
      setSelectedIndex((prev) => (prev < flatActionsList.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatActionsList.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatActionsList[selectedIndex]) {
        executeAction(flatActionsList[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  let currentFlatIndex = 0;

  return (
    <div className="spotlight-overlay" onClick={handleClose}>
      <div
        className={`spotlight-container ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="spotlight-header">
          {isLoading ? (
            <span className="spotlight-spinner">⌛</span>
          ) : (
            <svg className="spotlight-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
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
          {flatActionsList.length === 0 ? (
            <div className="spotlight-empty">{emptyMessage}</div>
          ) : (
            <div className="spotlight-groups-wrap">
              {groupedResults.map((group) => (
                <div key={group.group} className="spotlight-group-section">
                  <div className="spotlight-group-header">{group.group.toUpperCase()}</div>
                  <ul className="spotlight-list">
                    {group.actions.map((action) => {
                      const itemIndex = currentFlatIndex++;
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <li
                          key={action.id}
                          className={`spotlight-item ${isSelected ? 'spotlight-item-selected' : ''}`}
                          onClick={() => executeAction(action)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
