---
type: domain-event
name: Deployment Completed
description: Emitted when a service deployment reaches a terminal state (promoted to production or rolled back), carrying service name, version, and outcome.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/deployment-completed

published_by_api_endpoints:
  - argocd-app-sync
consumed_by_api_endpoints:
  - metrics-query-endpoint
  - audit-event-ingest
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Published by ArgoCD Controller when a deployment workflow reaches a terminal state. Downstream consumers (Monitoring Stack, Audit Trail) use this event to annotate dashboards with deployment markers and record change events for compliance purposes.
