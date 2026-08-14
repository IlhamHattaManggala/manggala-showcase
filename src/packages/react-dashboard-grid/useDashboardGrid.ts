import { useState, useCallback } from 'react';
import { WidgetConfig } from './types';

export function useDashboardGrid(initialWidgets: WidgetConfig[]) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets);

  const moveWidget = useCallback((draggedId: string, targetId: string) => {
    setWidgets((prev) => {
      const draggedIndex = prev.findIndex((w) => w.id === draggedId);
      const targetIndex = prev.findIndex((w) => w.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return prev;
      }

      const updated = [...prev];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, movedItem);

      return updated;
    });
  }, []);

  const updateWidgetConfig = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return {
    widgets,
    setWidgets,
    moveWidget,
    updateWidgetConfig,
    removeWidget,
  };
}
