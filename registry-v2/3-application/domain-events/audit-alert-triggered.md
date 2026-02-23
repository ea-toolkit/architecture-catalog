---
type: domain-event
name: Audit Alert Triggered
description: Emitted when the audit system detects a suspicious pattern or compliance violation requiring immediate attention.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - audit-api
consumed_by_api_endpoints:
  - notification-api
  - access-control-api
  - workflow-api
  - integration-api

archimate_type: application-event
ddd_type: Domain Event
---

Audit Alert Triggered signals that an anomalous pattern has been detected (e.g., excessive failed logins, bulk data export, privilege escalation). The notification service alerts security admins, access control may enforce temporary restrictions, automated remediation workflows are triggered, and external SIEM integrations receive the alert.
