import React, { useState } from 'react';
import { DataTable } from '@manggala31/react-datatable';
import { mockUsersData } from '../mock/demoData';
import type { UserRow } from '../mock/demoData';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { InstallBadge } from '../components/InstallBadge';
import { Table, Search, Clock } from 'lucide-react';

const reactCode = `import { DataTable } from '@manggala31/react-datatable';
import '@manggala31/react-datatable/styles.css';

<DataTable
  data={users}
  columns={[
    { key: 'name',  title: 'Name',  sortable: true },
    { key: 'email', title: 'Email' },
    { key: 'role',  title: 'Role',  sortable: true },
  ]}
  rowKey="id"
  selectable={true}
  pagination={{ total: 100, currentPage: 1, perPage: 10, lastPage: 10 }}
/>`;

const phpCode = `<?php
use Manggala\\DataTable\\DataTable;
use App\\Models\\User;

class UsersTable extends DataTable
{
    public function query() { return User::query()->latest(); }

    public function columns(): array {
        return [
            Column::make('name')->sortable()->searchable(),
            Column::make('email')->searchable(),
            Column::make('role'),
        ];
    }
}`;

const statusStyle = (s: string) => {
  if (s === 'active')    return { background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.25)' };
  if (s === 'pending')   return { background: 'var(--amber-bg)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.25)' };
  return                        { background: 'var(--red-bg)',   color: 'var(--red)',   border: '1px solid rgba(239,68,68,0.25)' };
};

export const DataTableDemoView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);

  const filtered = mockUsersData.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name', title: 'User', sortable: true,
      render: (row: UserRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
            {row.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role', title: 'Role', sortable: true,
      render: (row: UserRow) => (
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {row.role}
        </span>
      ),
    },
    {
      key: 'status', title: 'Status',
      render: (row: UserRow) => (
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700, letterSpacing: '0.04em', ...statusStyle(row.status) }}>
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'lastActive', title: 'Last Active',
      render: (row: UserRow) => (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={11} /> {row.lastActive}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="view-header">
        <div>
          <div className="view-title">
            <Table size={20} style={{ color: 'var(--accent)' }} />
            <h1>Data Table</h1>
            <span className="tag tag-blue">React</span>
          </div>
          <p className="view-subtitle">Keyboard-navigable, server-driven Data Table with sorting, filtering, and pagination.</p>
        </div>
        <div className="install-row">
          <InstallBadge command="npm i @manggala31/react-datatable" type="npm" />
          <InstallBadge command="composer require manggala/laravel-datatable" type="composer" />
        </div>
      </div>

      <CodeSnippetViewer
        title="Interactive Data Table Sandbox"
        reactCode={reactCode}
        laravelCode={phpCode}
        previewContent={
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div className="search-input-wrap" style={{ flex: 1, minWidth: 200 }}>
                <Search size={13} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search name, email, role..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                <strong style={{ color: 'var(--accent)' }}>{selected.length}</strong> selected
              </span>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <DataTable
                data={filtered}
                columns={columns}
                rowKey="id"
                selectable={true}
                onSelectionChange={setSelected}
                pagination={{ total: filtered.length, currentPage: page, perPage: 5, lastPage: Math.max(1, Math.ceil(filtered.length / 5)) }}
                onPageChange={setPage}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
