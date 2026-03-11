---
type: domain-event
name: Data Pipeline Failed
description: Emitted when an analytics data ingestion pipeline encounters a terminal error and halts processing, leaving data in an incomplete state.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - metrics-query-endpoint
  - notification-api

archimate_type: application-event
ddd_type: Domain Event
---

Data Pipeline Failed triggers an operational alert for the analytics engineering team and marks affected report runs as stale. Platform Operations monitoring consumes this event to annotate the infrastructure dashboard with a pipeline health indicator.
