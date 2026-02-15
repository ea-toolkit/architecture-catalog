---
type: domain-event
name: Usage Threshold Exceeded
description: Emitted when a tenant exceeds their plan's usage threshold, triggering overage billing or upgrade prompts.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - subscription-api

archimate_type: application-event
ddd_type: Domain Event
---

The Usage Threshold Exceeded event triggers business logic for overage charges or plan upgrade recommendations.
