---
type: domain-event
name: Rollback Triggered
description: Emitted when an automated or manual rollback is initiated for a service deployment due to health check failures or SLO degradation after a release.
owner: Platform Operations Team
status: active
domain: Platform Operations
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/rollback-triggered

published_by_api_endpoints:
  - argocd-app-sync
consumed_by_api_endpoints:
  - metrics-query-endpoint
  - audit-event-ingest

archimate_type: application-event
ddd_type: Domain Event
---

Rollback Triggered is a high-severity operational event. Monitoring systems annotate dashboards with the rollback marker and update SLO burn-rate calculations. The audit trail records the triggering condition (automated health check or manual override) for post-incident review.
