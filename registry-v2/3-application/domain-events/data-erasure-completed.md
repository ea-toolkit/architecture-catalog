---
type: domain-event
name: Data Erasure Completed
description: Emitted when all deletion tasks for a GDPR right-to-erasure request have completed successfully across all owning services.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/data-erasure-completed

published_by_api_endpoints:
  - privacy-request-submit
consumed_by_api_endpoints:
  - audit-api
  - notification-api
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Raised by the Privacy Management System after all downstream deletion tasks confirm completion. Used to trigger customer notification of successful erasure and to log the completion record in the audit trail with full traceability.
