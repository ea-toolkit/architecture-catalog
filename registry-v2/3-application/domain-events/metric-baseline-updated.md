---
type: domain-event
name: Metric Baseline Updated
description: Emitted when the analytics system recalculates a tenant's baseline metrics after a significant data change, such as a plan change or historical data import.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - subscription-api
  - metrics-query-endpoint

archimate_type: application-event
ddd_type: Domain Event
---

Metric Baseline Updated propagates recalculated baseline figures to downstream consumers. Billing systems may adjust overage thresholds, and the platform monitoring stack refreshes its capacity planning projections based on updated usage patterns.
