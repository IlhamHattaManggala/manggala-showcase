import React, { useState, useCallback } from 'react';
import type { DashboardGridProps, WidgetConfig } from './types';
import { WidgetCard } from './WidgetCard';
import './styles.css';

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets: initialWidgets,
  cols = 12,
  isEditable = true,
  onLayoutChange,
  onWidgetResize,
  storageKey,
  className = '',
}) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return initialWidgets.map((w) => {
            const match = parsed.find((p: any) => p.id === w.id);
            return match ? { ...w, colSpan: match.colSpan, rowSpan: match.rowSpan } : w;
          });
        }
      } catch (err) {
        console.warn('Failed to load dashboard grid state from localStorage', err);
      }
    }
    return initialWidgets;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Sync to localStorage if storageKey is passed
  const saveState = useCallback((updated: WidgetConfig[]) => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      const stateToSave = updated.map((w) => ({ id: w.id, colSpan: w.colSpan, rowSpan: w.rowSpan }));
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (err) {
      console.warn('Failed to save dashboard grid state', err);
    }
  }, [storageKey]);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedId || draggedId === targetId) return;

      const draggedIndex = widgets.findIndex((w) => w.id === draggedId);
      const targetIndex = widgets.findIndex((w) => w.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const updated = [...widgets];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, movedItem);

      setWidgets(updated);
      setDraggedId(null);
      saveState(updated);

      if (onLayoutChange) {
        onLayoutChange(updated);
      }
    },
    [draggedId, widgets, onLayoutChange, saveState]
  );

  const handleResize = useCallback((id: string, deltaCols: number, _deltaRows: number) => {
    setWidgets((prev) => {
      const updated = prev.map((w) => {
        if (w.id !== id) return w;
        const currentCol = w.colSpan || 4;
        const newCol = Math.max(2, Math.min(cols, currentCol + deltaCols));
        if (onWidgetResize) {
          onWidgetResize(id, newCol, w.rowSpan || 2);
        }
        return { ...w, colSpan: newCol };
      });

      saveState(updated);
      if (onLayoutChange) {
        onLayoutChange(updated);
      }
      return updated;
    });
  }, [cols, onWidgetResize, saveState, onLayoutChange]);

  return (
    <div
      className={`dashboard-grid-container ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 'var(--dashboard-grid-gap, 16px)',
      }}
    >
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          isEditable={isEditable}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onResize={handleResize}
        />
      ))}
    </div>
  );
};
