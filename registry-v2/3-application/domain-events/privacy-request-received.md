---
type: domain-event
name: Privacy Request Received
description: Emitted when a data subject submits a GDPR or CCPA privacy request (access, portability, or erasure), starting the mandatory fulfilment SLA clock.
owner: Security Team
status: active
domain: Security and Compliance
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/privacy-request-received

published_by_api_endpoints:
  - privacy-request-submit
consumed_by_api_endpoints:
  - audit-event-ingest
  - notification-api
  - workflow-api

archimate_type: application-event
ddd_type: Domain Event
---

Privacy Request Received starts the regulatory clock for GDPR Article 12 (30-day response window). The workflow engine creates a fulfilment task graph, the audit trail opens a compliance record, and the notification service sends an acknowledgement to the data subject.
