import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { DataTableProps, Column } from './types';
import './styles.css';

export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
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
  searchable = false,
  searchPlaceholder = 'Search records...',
  onSearch,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  exportable = false,
  onExportCSV,
  resizableColumns = false,
}: DataTableProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string | number>>(
    new Set(selectedRowKeys || [])
  );
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
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

  // Client-side filtering when searchable is true and no external onSearch is provided
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim() || onSearch) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(lower)
      )
    );
  }, [data, searchable, searchQuery, onSearch]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(column.key);
    setSortDirection(newDirection);
    if (onSortChange) {
      onSortChange(column.key, newDirection);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV(filteredData);
      return;
    }

    if (filteredData.length === 0) return;
    const headers = initialColumns.map((c) => `"${c.title.replace(/"/g, '""')}"`).join(',');
    const rows = filteredData.map((row) =>
      initialColumns
        .map((c) => {
          const val = row[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Column Resizing logic
  const handleColumnResize = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const currentWidth = columnWidths[colKey] || 150;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(60, currentWidth + deltaX);
      setColumnWidths((prev) => ({ ...prev, [colKey]: newWidth }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
    const allKeys = filteredData.map(getRowId);
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
    if (filteredData.length === 0) return;

    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'j') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredData.length - 1));
    } else if (e.key === ' ' && selectable && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectRow(filteredData[focusedIndex]);
    } else if (e.key === 'Enter' && focusedIndex >= 0 && onRowClick) {
      e.preventDefault();
      onRowClick(filteredData[focusedIndex]);
    }
  };

  useEffect(() => {
    setFocusedIndex(-1);
  }, [filteredData]);

  const allSelected =
    filteredData.length > 0 && filteredData.every((item) => internalSelectedKeys.has(getRowId(item)));

  return (
    <div
      ref={tableRef}
      className={`datatable-container ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* ── Top Toolbar (Search & Export) ──────── */}
      {(searchable || exportable) && (
        <div className="datatable-toolbar">
          {searchable && (
            <div className="datatable-search-wrap">
              <svg className="datatable-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="datatable-search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}

          {exportable && (
            <button className="datatable-export-btn" type="button" onClick={handleExportCSV}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>
          )}
        </div>
      )}

      {/* ── Main Table ──────── */}
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
              {initialColumns.map((col) => {
                const widthStyle = columnWidths[col.key]
                  ? `${columnWidths[col.key]}px`
                  : col.width;

                return (
                  <th
                    key={col.key}
                    className={`datatable-th ${col.sortable ? 'datatable-th-sortable' : ''}`}
                    style={{ width: widthStyle, textAlign: col.align || 'left', position: 'relative' }}
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
                    {resizableColumns && (
                      <span
                        className="datatable-resize-handle"
                        onMouseDown={(e) => handleColumnResize(e, col.key)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={initialColumns.length + (selectable ? 1 : 0)}
                  className="datatable-empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => {
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
                    {initialColumns.map((col) => (
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

      {/* ── Pagination Footer ──────── */}
      {(pagination || onPageSizeChange) && (
        <div className="datatable-pagination">
          <div className="datatable-pagination-info">
            {pagination ? (
              <>Showing Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)</>
            ) : (
              <>{filteredData.length} records</>
            )}
          </div>

          <div className="datatable-pagination-controls">
            {onPageSizeChange && (
              <div className="datatable-page-size-wrap">
                <span className="datatable-page-size-label">Rows per page:</span>
                <select
                  className="datatable-page-size-select"
                  value={pagination?.perPage || 10}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {pagination && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
