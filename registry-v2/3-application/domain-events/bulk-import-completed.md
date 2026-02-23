---
type: domain-event
name: Bulk Import Completed
description: Emitted when a bulk user or contact import job finishes processing, reporting results to dependent systems.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - user-management-api
consumed_by_api_endpoints:
  - customer-data-api
  - notification-api
  - workflow-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Bulk Import Completed signals that a CSV/API bulk import job has finished. The customer data platform syncs the new records, a summary notification is sent to the requester, post-import workflows are triggered, and the import is logged for audit.
