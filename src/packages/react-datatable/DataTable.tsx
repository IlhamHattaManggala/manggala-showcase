import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { DataTableProps, Column } from './types';

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  onRowClick,
  onPageChange,
  onSortChange,
  pagination,
  className = '',
  emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string | number>>(
    new Set(selectedRowKeys || [])
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const tableRef = useRef<HTMLDivElement>(null);

  const getRowId = useCallback(
    (row: T): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      }
      return row[rowKey];
    },
    [rowKey]
  );

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(column.key);
    setSortDirection(newDirection);
    if (onSortChange) {
      onSortChange(column.key, newDirection);
    }
  };

  const handleSelectRow = (row: T) => {
    const id = getRowId(row);
    const nextKeys = new Set(internalSelectedKeys);
    if (nextKeys.has(id)) {
      nextKeys.delete(id);
    } else {
      nextKeys.add(id);
    }
    setInternalSelectedKeys(nextKeys);
    if (onSelectionChange) {
      const selected = data.filter((item) => nextKeys.has(getRowId(item)));
      onSelectionChange(selected);
    }
  };

  const handleSelectAll = () => {
    const allKeys = data.map(getRowId);
    const isAllSelected = allKeys.every((id) => internalSelectedKeys.has(id));
    let nextKeys: Set<string | number>;
    if (isAllSelected) {
      nextKeys = new Set();
    } else {
      nextKeys = new Set(allKeys);
    }
    setInternalSelectedKeys(nextKeys);
    if (onSelectionChange) {
      const selected = data.filter((item) => nextKeys.has(getRowId(item)));
      onSelectionChange(selected);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (data.length === 0) return;

    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'j') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
    } else if (e.key === ' ' && selectable && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectRow(data[focusedIndex]);
    } else if (e.key === 'Enter' && focusedIndex >= 0 && onRowClick) {
      e.preventDefault();
      onRowClick(data[focusedIndex]);
    }
  };

  useEffect(() => {
    setFocusedIndex(-1);
  }, [data]);

  const allSelected =
    data.length > 0 && data.every((item) => internalSelectedKeys.has(getRowId(item)));

  return (
    <div
      ref={tableRef}
      className={`datatable-container ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="datatable-scroll-wrapper">
        <table className="datatable">
          <thead>
            <tr>
              {selectable && (
                <th className="datatable-th datatable-th-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`datatable-th ${col.sortable ? 'datatable-th-sortable' : ''}`}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  onClick={() => handleSort(col)}
                >
                  <div className="datatable-th-content">
                    <span>{col.title}</span>
                    {col.sortable && (
                      <span className="datatable-sort-indicator">
                        {sortKey === col.key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="datatable-empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = getRowId(row);
                const isSelected = internalSelectedKeys.has(id);
                const isFocused = index === focusedIndex;

                return (
                  <tr
                    key={String(id)}
                    className={`datatable-tr ${isSelected ? 'datatable-tr-selected' : ''} ${
                      isFocused ? 'datatable-tr-focused' : ''
                    }`}
                    onClick={() => {
                      setFocusedIndex(index);
                      if (onRowClick) onRowClick(row);
                    }}
                  >
                    {selectable && (
                      <td
                        className="datatable-td datatable-td-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="datatable-td"
                        style={{ textAlign: col.align || 'left' }}
                      >
                        {col.render ? col.render(row, index) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="datatable-pagination">
          <div className="datatable-pagination-info">
            Showing Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
          </div>
          <div className="datatable-pagination-controls">
            <button
              className="datatable-btn"
              disabled={pagination.currentPage <= 1}
              onClick={() => onPageChange && onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="datatable-btn"
              disabled={pagination.currentPage >= pagination.lastPage}
              onClick={() => onPageChange && onPageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
