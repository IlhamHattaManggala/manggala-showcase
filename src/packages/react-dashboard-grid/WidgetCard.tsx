import React from 'react';
import type { WidgetConfig } from './types';

export interface WidgetCardProps {
  widget: WidgetConfig;
  isEditable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  isEditable = true,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const colSpanStyle = widget.colSpan ? `span ${Math.min(widget.colSpan, 12)}` : 'span 4';
  const rowSpanStyle = widget.rowSpan ? `span ${widget.rowSpan}` : 'span 2';

  return (
    <div
      className={`widget-card ${widget.className || ''}`}
      style={{
        gridColumnEnd: colSpanStyle,
        gridRowEnd: rowSpanStyle,
      }}
      draggable={isEditable}
      onDragStart={(e) => onDragStart && onDragStart(e, widget.id)}
      onDragOver={(e) => {
        e.preventDefault();
        if (onDragOver) onDragOver(e);
      }}
      onDrop={(e) => onDrop && onDrop(e, widget.id)}
    >
      {(widget.title || widget.headerActions || isEditable) && (
        <div className="widget-card-header">
          <div className="widget-card-title-wrap">
            {isEditable && <span className="widget-card-drag-handle" title="Drag to reorder">⋮⋮</span>}
            {widget.title && <h3 className="widget-card-title">{widget.title}</h3>}
          </div>
          {widget.headerActions && (
            <div className="widget-card-actions">{widget.headerActions}</div>
          )}
        </div>
      )}
      <div className="widget-card-body">{widget.content}</div>
    </div>
  );
};
