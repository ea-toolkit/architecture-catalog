---
type: domain-event
name: Incident Declared
description: Emitted when a platform incident is formally declared by an on-call engineer or auto-triggered by multiple correlated SLO breach alerts, opening the incident management workflow.
owner: Platform Operations Team
status: active
domain: Platform Operations
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/incident-declared

published_by_api_endpoints:
  - metrics-query-endpoint
consumed_by_api_endpoints:
  - notification-api
  - audit-event-ingest
  - workflow-api

archimate_type: application-event
ddd_type: Domain Event
---

Incident Declared is the central coordination event for the incident lifecycle. The workflow engine creates an incident room and assigns the initial responder. Notifications broadcast to stakeholders via PagerDuty and Slack. The audit trail opens a timestamped incident record for post-mortem analysis.
