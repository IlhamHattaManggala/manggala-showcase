export type HealthStatus =
  | 'operational'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage'
  | 'maintenance';

export interface UptimeDay {
  date: string;
  status: HealthStatus;
  uptimePercentage?: number;
  avgLatencyMs?: number;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: HealthStatus;
  latencyMs?: number;
  description?: string;
  uptimeHistory?: UptimeDay[];
}

export interface IncidentUpdate {
  timestamp: string;
  message: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  updatedAt: string;
  updates: IncidentUpdate[];
}

export interface StatusPageProps {
  systemName?: string;
  services: ServiceHealth[];
  incidents?: IncidentRecord[];
  showUptimeBars?: boolean;
  autoRefreshIntervalSeconds?: number;
  onRefresh?: () => void;
  filterServices?: boolean;
  expandableIncidents?: boolean;
  className?: string;
}
