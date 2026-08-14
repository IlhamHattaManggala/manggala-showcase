import React from 'react';

export interface WidgetConfig {
  id: string;
  title?: string;
  colSpan?: number; // 1 to 12
  rowSpan?: number; // 1 to 6
  content: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export interface DashboardGridProps {
  widgets: WidgetConfig[];
  cols?: number;
  isEditable?: boolean;
  onLayoutChange?: (widgets: WidgetConfig[]) => void;
  className?: string;
}
