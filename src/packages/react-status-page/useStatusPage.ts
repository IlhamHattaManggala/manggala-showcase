import { useMemo } from 'react';
import { ServiceHealth, HealthStatus } from './types';

export function useStatusPage(services: ServiceHealth[]) {
  const overallStatus = useMemo<HealthStatus>(() => {
    if (!services || services.length === 0) return 'operational';

    let hasMajorOutage = false;
    let hasPartialOutage = false;
    let hasDegraded = false;
    let hasMaintenance = false;

    services.forEach((s) => {
      if (s.status === 'major_outage') hasMajorOutage = true;
      if (s.status === 'partial_outage') hasPartialOutage = true;
      if (s.status === 'degraded') hasDegraded = true;
      if (s.status === 'maintenance') hasMaintenance = true;
    });

    if (hasMajorOutage) return 'major_outage';
    if (hasPartialOutage) return 'partial_outage';
    if (hasDegraded) return 'degraded';
    if (hasMaintenance) return 'maintenance';
    return 'operational';
  }, [services]);

  const statusLabel = useMemo(() => {
    switch (overallStatus) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'partial_outage':
        return 'Partial System Outage';
      case 'major_outage':
        return 'Major System Outage';
      case 'maintenance':
        return 'Under Scheduled Maintenance';
      default:
        return 'Status Unknown';
    }
  }, [overallStatus]);

  return {
    overallStatus,
    statusLabel,
  };
}
