import { useState, useCallback } from 'react';

export function useDataTable(initialSortKey = '', initialDirection: 'asc' | 'desc' = 'asc') {
  const [sortKey, setSortKey] = useState<string>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);
  const [page, setPage] = useState<number>(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());

  const handleSort = useCallback(
    (key: string) => {
      let newDirection: 'asc' | 'desc' = 'asc';
      if (sortKey === key && sortDirection === 'asc') {
        newDirection = 'desc';
      }
      setSortKey(key);
      setSortDirection(newDirection);
    },
    [sortKey, sortDirection]
  );

  const toggleSelectRow = useCallback((id: string | number) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: Array<string | number>) => {
    setSelectedKeys((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) {
        return new Set();
      }
      return new Set(ids);
    });
  }, []);

  return {
    sortKey,
    sortDirection,
    page,
    setPage,
    handleSort,
    selectedKeys,
    setSelectedKeys,
    toggleSelectRow,
    toggleSelectAll,
  };
}
