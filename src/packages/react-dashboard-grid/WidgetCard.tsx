import React from 'react';
import type { WidgetConfig } from './types';

export interface WidgetCardProps {
  widget: WidgetConfig;
  isEditable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
  onResize?: (id: string, deltaCols: number, deltaRows: number) => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  isEditable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onResize,
}) => {
  const colSpanStyle = widget.colSpan ? `span ${Math.min(widget.colSpan, 12)}` : 'span 4';
  const rowSpanStyle = widget.rowSpan ? `span ${widget.rowSpan}` : 'span 2';

  const handleResizeClick = (e: React.MouseEvent, direction: 'expand' | 'shrink') => {
    e.stopPropagation();
    if (!onResize) return;
    const delta = direction === 'expand' ? 2 : -2;
    onResize(widget.id, delta, 0);
  };

  return (
    <div
      className={`widget-card ${widget.className || ''}`}
      style={{
        gridColumnEnd: colSpanStyle,
        gridRowEnd: rowSpanStyle,
        position: 'relative',
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
          <div className="widget-card-actions">
            {widget.headerActions}
            {isEditable && onResize && (
              <div className="widget-card-resize-controls">
                <button
                  type="button"
                  className="widget-card-resize-btn"
                  title="Shrink Columns"
                  onClick={(e) => handleResizeClick(e, 'shrink')}
                >
                  -
                </button>
                <span className="widget-card-col-badge">{widget.colSpan || 4}c</span>
                <button
                  type="button"
                  className="widget-card-resize-btn"
                  title="Expand Columns"
                  onClick={(e) => handleResizeClick(e, 'expand')}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="widget-card-body">{widget.content}</div>
      {isEditable && <span className="widget-card-corner-resize-handle" title="Visual Resize Handle" />}
    </div>
  );
};
