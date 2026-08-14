import type { ServiceHealth, IncidentRecord } from '@manggala31/react-status-page';
import type { FormFieldSchema } from '@manggala31/schema-form-react';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
}

export const mockUsersData: UserRow[] = [
  { id: 1, name: 'Alex Johnson', email: 'alex@manggala.dev', role: 'Superadmin', status: 'active', lastActive: '2 mins ago' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'Manager', status: 'active', lastActive: '15 mins ago' },
  { id: 3, name: 'Michael Scott', email: 'michael@dundermifflin.com', role: 'Editor', status: 'active', lastActive: '1 hour ago' },
  { id: 4, name: 'Pam Beesly', email: 'pam@dundermifflin.com', role: 'Designer', status: 'pending', lastActive: '3 hours ago' },
  { id: 5, name: 'Jim Halpert', email: 'jim@dundermifflin.com', role: 'Sales Lead', status: 'active', lastActive: '5 hours ago' },
  { id: 6, name: 'Dwight Schrute', email: 'dwight@beetfarm.com', role: 'Security Admin', status: 'suspended', lastActive: '1 day ago' },
  { id: 7, name: 'Ryan Howard', email: 'ryan@wuphf.com', role: 'Intern', status: 'pending', lastActive: '2 days ago' },
];

export const mockServicesData: ServiceHealth[] = [
  {
    id: 'database',
    name: 'Primary Database Cluster (PostgreSQL)',
    status: 'operational',
    latencyMs: 14,
    description: 'High availability read/write database nodes.',
  },
  {
    id: 'api_gateway',
    name: 'REST API & GraphQL Gateway',
    status: 'operational',
    latencyMs: 22,
    description: 'Edge API endpoints and rate limiters.',
  },
  {
    id: 'cache_redis',
    name: 'Redis Cache Layer',
    status: 'operational',
    latencyMs: 3,
    description: 'Distributed session & query caching.',
  },
  {
    id: 'queue_worker',
    name: 'Background Job Processing',
    status: 'degraded',
    latencyMs: 145,
    description: 'Queue workers processing email & PDF generation tasks.',
  },
  {
    id: 'storage_s3',
    name: 'Object Storage & CDN',
    status: 'operational',
    latencyMs: 45,
    description: 'Asset distribution and media storage.',
  },
];

export const mockIncidentsData: IncidentRecord[] = [
  {
    id: 'inc-102',
    title: 'Elevated Response Latency in Queue Workers',
    status: 'monitoring',
    severity: 'minor',
    createdAt: '2026-08-13 14:00:00',
    updatedAt: '2026-08-13 14:45:00',
    updates: [
      {
        timestamp: '2026-08-13 14:45:00',
        message: 'Fix deployed. Queue processing latency back to normal limits. Monitoring performance.',
      },
      {
        timestamp: '2026-08-13 14:15:00',
        message: 'Identified spike in email dispatch queue. Additional worker instances spawned.',
      },
    ],
  },
];

export const mockSchemaForm: FormFieldSchema[] = [
  {
    name: 'appName',
    label: 'Application Title',
    type: 'text',
    placeholder: 'e.g. Acme Enterprise Cloud',
    required: true,
    colSpan: 6,
  },
  {
    name: 'adminEmail',
    label: 'System Notification Email',
    type: 'email',
    placeholder: 'admin@company.com',
    required: true,
    colSpan: 6,
  },
  {
    name: 'environment',
    label: 'Environment Mode',
    type: 'select',
    required: true,
    colSpan: 6,
    options: [
      { label: 'Production Mode', value: 'production' },
      { label: 'Staging Environment', value: 'staging' },
      { label: 'Local Development', value: 'development' },
    ],
  },
  {
    name: 'enableSpotlight',
    label: 'Enable Spotlight Quick Search (Cmd+K)',
    type: 'toggle',
    colSpan: 6,
    description: 'Allow users to search resources using keyboard shortcuts.',
  },
  {
    name: 'maintenanceMode',
    label: 'Maintenance Mode Banner',
    type: 'toggle',
    colSpan: 6,
    description: 'Display temporary maintenance notice to non-admin users.',
  },
  {
    name: 'maintenanceReason',
    label: 'Reason for Maintenance (Conditional Field)',
    type: 'text',
    placeholder: 'e.g. Scheduled database migration',
    colSpan: 6,
    condition: (vals: Record<string, any>) => Boolean(vals.maintenanceMode),
  },
  {
    name: 'maxUploadMb',
    label: 'Max File Upload Limit (MB)',
    type: 'number',
    min: 1,
    max: 1000,
    placeholder: '50',
    colSpan: 6,
  },
  {
    name: 'welcomeNotes',
    label: 'Custom Announcement Message',
    type: 'textarea',
    placeholder: 'Welcome to our platform updates...',
    colSpan: 12,
  },
];

export interface PackageMetadata {
  id: string;
  name: string;
  category: 'react' | 'laravel';
  type: 'component' | 'framework' | 'backend' | 'security';
  description: string;
  npmName?: string;
  composerName?: string;
  githubUrl: string;
  badges: string[];
}

export const packagesCatalog: PackageMetadata[] = [
  {
    id: 'universal-panel',
    name: 'universal-panel',
    category: 'laravel',
    type: 'framework',
    description: 'Universal Admin Panel & Resource Builder for Laravel supporting Blade, Livewire, Inertia React, Inertia Vue & REST API with 160px slim sidebar.',
    composerName: 'manggala/universal-panel',
    githubUrl: 'https://github.com/IlhamHattaManggala/universal-panel',
    badges: ['Laravel 10-13', 'PHP 8.2+', '27 CLI Commands', 'Slim 160px Sidebar'],
  },
  {
    id: 'react-dashboard-grid',
    name: 'react-dashboard-grid',
    category: 'react',
    type: 'component',
    description: 'Production-ready, customizable drag-and-drop dashboard grid component for React, Inertia.js, and Next.js applications.',
    npmName: '@manggala31/react-dashboard-grid',
    githubUrl: 'https://github.com/IlhamHattaManggala/react-dashboard-grid',
    badges: ['React 18/19', 'Next.js & Inertia', 'Drag & Drop', 'Grid Layout'],
  },
  {
    id: 'laravel-dashboard-builder',
    name: 'laravel-dashboard-builder',
    category: 'laravel',
    type: 'backend',
    description: 'Laravel backend provider and layout manager for custom widget cards and dashboard grid state persistence.',
    composerName: 'manggala/laravel-dashboard-builder',
    githubUrl: 'https://github.com/IlhamHattaManggala/laravel-dashboard-builder',
    badges: ['Laravel 10-13', 'Widget Providers', 'State Storage'],
  },
  {
    id: 'react-datatable',
    name: 'react-datatable',
    category: 'react',
    type: 'component',
    description: 'Server-driven & client-side Data Table with keyboard navigation, column sorting, pagination, and multi-row selection.',
    npmName: '@manggala31/react-datatable',
    githubUrl: 'https://github.com/IlhamHattaManggala/react-datatable',
    badges: ['React 18/19', 'Keyboard Nav', 'Sort & Filter', 'Export CSV'],
  },
  {
    id: 'laravel-datatable',
    name: 'laravel-datatable',
    category: 'laravel',
    type: 'backend',
    description: 'Fluent Eloquent query builder adapter for server-side pagination, sorting, and filtering for react-datatable.',
    composerName: 'manggala/laravel-datatable',
    githubUrl: 'https://github.com/IlhamHattaManggala/laravel-datatable',
    badges: ['Laravel 10-13', 'Eloquent Adapter', 'Server-side Query'],
  },
  {
    id: 'react-spotlight',
    name: 'react-spotlight',
    category: 'react',
    type: 'component',
    description: 'Keyboard-driven Command Palette (Cmd+K / Ctrl+K) with fuzzy search, grouped action items, and shortcuts.',
    npmName: '@manggala31/react-spotlight',
    githubUrl: 'https://github.com/IlhamHattaManggala/react-spotlight',
    badges: ['Cmd+K Palette', 'React 18/19', 'Fuzzy Search', 'Zero Dependencies'],
  },
  {
    id: 'laravel-spotlight',
    name: 'laravel-spotlight',
    category: 'laravel',
    type: 'backend',
    description: 'Automatic resource & action discoverer for Laravel routes, CRUD models, and system shortcuts fed to react-spotlight.',
    composerName: 'manggala/laravel-spotlight',
    githubUrl: 'https://github.com/IlhamHattaManggala/laravel-spotlight',
    badges: ['Auto Discovery', 'Laravel 10-13', 'Route Actions'],
  },
  {
    id: 'react-status-page',
    name: 'react-status-page',
    category: 'react',
    type: 'component',
    description: 'Self-hosted application health diagnostics and status page dashboard component for React & Inertia.',
    npmName: '@manggala31/react-status-page',
    githubUrl: 'https://github.com/IlhamHattaManggala/react-status-page',
    badges: ['React 18/19', 'Uptime Bars', 'Incident Logs', 'Latency Charts'],
  },
  {
    id: 'laravel-status-page',
    name: 'laravel-status-page',
    category: 'laravel',
    type: 'backend',
    description: 'Automated health-check pingers for Redis, DB, Storage, and HTTP endpoints feeding status telemetry to react-status-page.',
    composerName: 'manggala/laravel-status-page',
    githubUrl: 'https://github.com/IlhamHattaManggala/laravel-status-page',
    badges: ['Health Pingers', 'DB/Redis/Storage Checks', 'Laravel 10-13'],
  },
  {
    id: 'schema-form-react',
    name: 'schema-form-react',
    category: 'react',
    type: 'component',
    description: 'JSON Schema-driven dynamic form generator component for React with validation feedback and custom controls.',
    npmName: '@manggala31/schema-form-react',
    githubUrl: 'https://github.com/IlhamHattaManggala/schema-form-react',
    badges: ['React 18/19', 'JSON Schema', 'Validation', 'Dynamic Inputs'],
  },
  {
    id: 'laravel-settings',
    name: 'laravel-settings',
    category: 'laravel',
    type: 'backend',
    description: 'Database-backed system settings repository & schema builder for storing and serving dynamic application configs.',
    composerName: 'manggala/laravel-settings',
    githubUrl: 'https://github.com/IlhamHattaManggala/laravel-settings',
    badges: ['Database Configs', 'Laravel 10-13', 'Type Casting'],
  },
  {
    id: 'sentinel',
    name: 'sentinel',
    category: 'laravel',
    type: 'security',
    description: 'Universal Web Application Firewall (WAF), OWASP Threat Scanners, Smart Lockout Shield & Security Dashboard for Laravel.',
    composerName: 'manggala/sentinel',
    githubUrl: 'https://github.com/IlhamHattaManggala/sentinel',
    badges: ['WAF Guard', 'OWASP Top 10', 'Brute Force Shield', 'Security Dashboard'],
  },
  {
    id: 'tenancy',
    name: 'tenancy',
    category: 'laravel',
    type: 'backend',
    description: 'Universal Multi-Tenancy Engine for Laravel supporting Single-DB (Row-Level Security), Multi-DB & Hybrid Modes with 10 CLI Commands.',
    composerName: 'manggala/tenancy',
    githubUrl: 'https://github.com/IlhamHattaManggala/tenancy',
    badges: ['Single-DB & Multi-DB', '4 Resolvers', '10 CLI Commands', 'Resource Isolators'],
  },
];

