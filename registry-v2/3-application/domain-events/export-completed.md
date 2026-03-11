---
type: domain-event
name: Export Completed
description: Emitted when a large-scale data export job finishes and the output file is available for download or delivery to an external destination.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - analytics-query-api
consumed_by_api_endpoints:
  - notification-api
  - integration-api

archimate_type: application-event
ddd_type: Domain Event
---

Export Completed signals that an asynchronous export job has written its output to the designated storage location. The notification service informs the requesting user with a secure download link, while integration connectors may use this event to route the file to a customer's external data warehouse.
