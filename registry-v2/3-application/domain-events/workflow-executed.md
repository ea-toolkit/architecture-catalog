---
type: domain-event
name: Workflow Executed
description: Emitted when an automated workflow completes execution, reporting the outcome and any side effects.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - workflow-api
consumed_by_api_endpoints:
  - audit-api
  - notification-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Workflow Executed signals that an automated workflow has completed. The audit service logs the execution details, a notification is sent if configured, and analytics tracks workflow success rates and execution metrics.
