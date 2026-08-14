import React, { useEffect, useState, useMemo } from 'react';
import type { StatusPageProps, HealthStatus, UptimeDay } from './types';
import { useStatusPage } from './useStatusPage';
import './styles.css';

export const StatusPage: React.FC<StatusPageProps> = ({
  systemName = 'System Overview',
  services = [],
  incidents = [],
  showUptimeBars = true,
  autoRefreshIntervalSeconds = 0,
  onRefresh,
  filterServices = true,
  expandableIncidents = true,
  className = '',
}) => {
  const { overallStatus, statusLabel } = useStatusPage(services);
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredBar, setHoveredBar] = useState<{ day: UptimeDay; serviceName: string; x: number; y: number } | null>(null);
  const [expandedIncidents, setExpandedIncidents] = useState<Record<string, boolean>>({});

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

  const filteredServices = useMemo(() => {
    if (!filterServices || !searchFilter.trim()) return services;
    const lower = searchFilter.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.description?.toLowerCase().includes(lower) ||
        s.status.toLowerCase().includes(lower)
    );
  }, [services, filterServices, searchFilter]);

  const toggleIncidentExpand = (id: string) => {
    setExpandedIncidents((prev) => ({ ...prev, [id]: !prev[id] }));
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
        <div className="status-page-section-header">
          <h2 className="status-page-section-title">System Services</h2>
          {filterServices && (
            <input
              type="text"
              className="status-page-search-input"
              placeholder="Filter services..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          )}
        </div>

        <div className="status-page-services-list">
          {filteredServices.map((service) => (
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
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredBar({
                            day,
                            serviceName: service.name,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredBar(null)}
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

      {/* Floating Interactive Tooltip for Uptime Bars */}
      {hoveredBar && (
        <div
          className="status-page-tooltip"
          style={{
            position: 'fixed',
            left: `${hoveredBar.x}px`,
            top: `${hoveredBar.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 10000,
          }}
        >
          <div className="status-page-tooltip-title">{hoveredBar.day.date}</div>
          <div className="status-page-tooltip-detail">
            Status: <strong className="status-page-tooltip-status">{hoveredBar.day.status.replace('_', ' ').toUpperCase()}</strong>
          </div>
          {hoveredBar.day.uptimePercentage !== undefined && (
            <div className="status-page-tooltip-detail">Uptime: {hoveredBar.day.uptimePercentage}%</div>
          )}
          {hoveredBar.day.avgLatencyMs !== undefined && (
            <div className="status-page-tooltip-detail">Avg Latency: {hoveredBar.day.avgLatencyMs} ms</div>
          )}
        </div>
      )}

      <section className="status-page-section">
        <h2 className="status-page-section-title">Active Incidents</h2>
        {activeIncidents.length === 0 ? (
          <div className="status-page-empty-incidents">No active incidents reported.</div>
        ) : (
          <div className="status-page-incidents-list">
            {activeIncidents.map((incident) => {
              const isExpanded = expandedIncidents[incident.id] ?? true;
              return (
                <div key={incident.id} className="status-page-incident-card">
                  <div className="status-page-incident-header">
                    <div className="status-page-incident-title-wrap">
                      <h3 className="status-page-incident-title">{incident.title}</h3>
                      <span className={`status-page-severity-badge severity-${incident.severity}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    {expandableIncidents && (
                      <button
                        type="button"
                        className="status-page-toggle-incident-btn"
                        onClick={() => toggleIncidentExpand(incident.id)}
                      >
                        {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                      </button>
                    )}
                  </div>
                  <div className="status-page-incident-meta">
                    Status: <strong>{incident.status.toUpperCase()}</strong> | Updated:{' '}
                    {incident.updatedAt}
                  </div>
                  {isExpanded && (
                    <div className="status-page-updates-timeline">
                      {incident.updates.map((update, idx) => (
                        <div key={idx} className="status-page-update-item">
                          <span className="status-page-update-time">{update.timestamp}</span>
                          <p className="status-page-update-msg">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
