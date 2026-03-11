---
type: domain-event
name: Anomaly Detected
description: Emitted when the analytics engine identifies a statistically significant deviation from expected metric behaviour for a tenant or product feature.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - notification-api
  - workflow-api

archimate_type: application-event
ddd_type: Domain Event
---

Anomaly Detected surfaces unusual patterns — unexpected drop in active users, spike in error rates, or revenue deviation — allowing downstream systems to trigger proactive customer outreach workflows or internal escalation processes.
