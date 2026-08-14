import React from 'react';

export interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((row: T) => string | number);
  selectable?: boolean;
  selectedRowKeys?: Array<string | number>;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  pagination?: PaginationMeta;
  className?: string;
  emptyMessage?: string;

  /* ── New v1.1.0 Features ──────── */
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  exportable?: boolean;
  onExportCSV?: (data: T[]) => void;
  resizableColumns?: boolean;
}
