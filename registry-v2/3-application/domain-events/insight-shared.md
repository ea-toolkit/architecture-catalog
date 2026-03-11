---
type: domain-event
name: Insight Shared
description: Emitted when a user shares an analytics report or dashboard snapshot with an external recipient or team member.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - notification-api
  - audit-event-ingest

archimate_type: application-event
ddd_type: Domain Event
---

Insight Shared captures the act of distributing analytics artefacts outside the originating user's workspace. The notification service dispatches the share invitation, and the audit trail records the sharing event for access governance.
