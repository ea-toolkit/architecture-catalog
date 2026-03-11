---
type: api_endpoint
name: Sync Schedule Configure
description: REST endpoint for configuring the sync schedule, direction, and field mapping for a partner connector.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
api_catalog_id: EP-INT-005
protocol: REST
auth_method: OAuth2

parent_software_subsystem: sync-scheduler
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

PUT /connectors/{id}/schedule accepts a cron expression, sync direction (inbound/outbound/bidirectional), and conflict resolution strategy. Validates the schedule against platform-wide rate limits before persisting to prevent thundering herd on shared upstream APIs.
