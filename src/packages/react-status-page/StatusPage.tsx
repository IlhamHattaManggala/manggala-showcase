import React, { useEffect } from 'react';
import { StatusPageProps, HealthStatus } from './types';
import { useStatusPage } from './useStatusPage';

export const StatusPage: React.FC<StatusPageProps> = ({
  systemName = 'System Overview',
  services = [],
  incidents = [],
  showUptimeBars = true,
  autoRefreshIntervalSeconds = 0,
  onRefresh,
  className = '',
}) => {
  const { overallStatus, statusLabel } = useStatusPage(services);

  useEffect(() => {
    if (autoRefreshIntervalSeconds <= 0 || !onRefresh) return;
    const interval = setInterval(() => {
      onRefresh();
    }, autoRefreshIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshIntervalSeconds, onRefresh]);

  const getStatusColorClass = (status: HealthStatus) => {
    switch (status) {
      case 'operational':
        return 'status-page-bg-operational';
      case 'degraded':
        return 'status-page-bg-degraded';
      case 'partial_outage':
      case 'major_outage':
        return 'status-page-bg-outage';
      case 'maintenance':
        return 'status-page-bg-maintenance';
      default:
        return 'status-page-bg-muted';
    }
  };

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const pastIncidents = incidents.filter((i) => i.status === 'resolved');

  return (
    <div className={`status-page-container ${className}`}>
      <header className="status-page-header">
        <div className="status-page-title-wrap">
          <h1 className="status-page-title">{systemName}</h1>
          <span className="status-page-subtitle">Realtime System Status & Health Diagnostics</span>
        </div>
        {onRefresh && (
          <button className="status-page-refresh-btn" onClick={onRefresh} type="button">
            Refresh Status
          </button>
        )}
      </header>

      <div className={`status-page-banner ${getStatusColorClass(overallStatus)}`}>
        <span className="status-page-banner-dot" />
        <span className="status-page-banner-text">{statusLabel}</span>
      </div>

      <section className="status-page-section">
        <h2 className="status-page-section-title">System Services</h2>
        <div className="status-page-services-list">
          {services.map((service) => (
            <div key={service.id} className="status-page-service-card">
              <div className="status-page-service-header">
                <div className="status-page-service-info">
                  <span className="status-page-service-name">{service.name}</span>
                  {service.description && (
                    <span className="status-page-service-desc">{service.description}</span>
                  )}
                </div>
                <div className="status-page-service-status">
                  {service.latencyMs !== undefined && (
                    <span className="status-page-latency">{service.latencyMs} ms</span>
                  )}
                  <span className={`status-page-badge ${getStatusColorClass(service.status)}`}>
                    {service.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {showUptimeBars && service.uptimeHistory && service.uptimeHistory.length > 0 && (
                <div className="status-page-uptime-history">
                  <div className="status-page-uptime-bars">
                    {service.uptimeHistory.map((day, idx) => (
                      <div
                        key={day.date || idx}
                        className={`status-page-bar ${getStatusColorClass(day.status)}`}
                        title={`${day.date}: ${day.status.replace('_', ' ')} ${
                          day.uptimePercentage !== undefined ? `(${day.uptimePercentage}%)` : ''
                        }`}
                      />
                    ))}
                  </div>
                  <div className="status-page-uptime-labels">
                    <span>90 days ago</span>
                    <span>100% uptime</span>
                    <span>Today</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="status-page-section">
        <h2 className="status-page-section-title">Active Incidents</h2>
        {activeIncidents.length === 0 ? (
          <div className="status-page-empty-incidents">No active incidents reported.</div>
        ) : (
          <div className="status-page-incidents-list">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="status-page-incident-card">
                <div className="status-page-incident-header">
                  <h3 className="status-page-incident-title">{incident.title}</h3>
                  <span className={`status-page-severity-badge severity-${incident.severity}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                </div>
                <div className="status-page-incident-meta">
                  Status: <strong>{incident.status.toUpperCase()}</strong> | Updated:{' '}
                  {incident.updatedAt}
                </div>
                <div className="status-page-updates-timeline">
                  {incident.updates.map((update, idx) => (
                    <div key={idx} className="status-page-update-item">
                      <span className="status-page-update-time">{update.timestamp}</span>
                      <p className="status-page-update-msg">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {pastIncidents.length > 0 && (
        <section className="status-page-section">
          <h2 className="status-page-section-title">Past Incidents</h2>
          <div className="status-page-incidents-list">
            {pastIncidents.map((incident) => (
              <div key={incident.id} className="status-page-incident-card status-page-resolved">
                <div className="status-page-incident-header">
                  <h3 className="status-page-incident-title">{incident.title}</h3>
                  <span className="status-page-badge status-page-bg-operational">RESOLVED</span>
                </div>
                <div className="status-page-incident-meta">Resolved on: {incident.updatedAt}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
