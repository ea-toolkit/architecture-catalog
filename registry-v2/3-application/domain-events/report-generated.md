---
type: domain-event
name: Report Generated
description: Emitted when an analytics report has been successfully generated and is available for delivery or download.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints: []

archimate_type: application-event
ddd_type: Domain Event
---

Report Generated signals that a scheduled or on-demand analytics report has completed processing and is available for consumption. Downstream systems use this event to trigger delivery notifications.
