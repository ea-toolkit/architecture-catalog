---
type: domain-event
name: Customer Profile Merged
description: Emitted when duplicate customer profiles are merged into a single unified record in the data platform.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - customer-data-api
consumed_by_api_endpoints:
  - integration-api
  - workflow-api
  - analytics-query-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Customer Profile Merged signals that two or more duplicate customer records have been consolidated. External integrations receive the updated canonical ID, workflows re-evaluate against the merged profile, analytics reattributes historical data, and the merge is logged for traceability.
