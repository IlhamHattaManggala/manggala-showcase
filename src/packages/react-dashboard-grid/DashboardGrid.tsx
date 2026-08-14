import React, { useState, useCallback } from 'react';
import type { DashboardGridProps, WidgetConfig } from './types';
import { WidgetCard } from './WidgetCard';

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets: initialWidgets,
  cols = 12,
  isEditable = true,
  onLayoutChange,
  className = '',
}) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets);
  const [draggedId, setDraggedId] = useState<string | null>(null);

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

      if (onLayoutChange) {
        onLayoutChange(updated);
      }
    },
    [draggedId, widgets, onLayoutChange]
  );

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
        />
      ))}
    </div>
  );
};
