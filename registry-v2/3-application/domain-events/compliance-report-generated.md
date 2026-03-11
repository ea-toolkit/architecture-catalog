---
type: domain-event
name: Compliance Report Generated
description: Emitted when a scheduled compliance report (SOC 2, ISO 27001 evidence pack) has been generated and is ready for review or download by the tenant admin.
owner: Security Team
status: active
domain: Security and Compliance
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/compliance-report-generated

published_by_api_endpoints:
  - audit-events-query
consumed_by_api_endpoints:
  - notification-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Compliance Report Generated is the terminal event for automated evidence collection workflows. The notification service sends a download link to the tenant's designated security officer, and the audit trail logs the report generation for chain-of-custody purposes.
