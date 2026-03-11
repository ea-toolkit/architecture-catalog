---
type: api_endpoint
name: Connector Status Get
description: REST endpoint returning the current status, last sync time, record counts, and error summary for a configured partner connector.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
api_catalog_id: EP-INT-004
protocol: REST
auth_method: OAuth2

parent_software_subsystem: connector-runtime
implements_api_contract:
publishes_domain_events:
  - Connector Sync Completed
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GET /connectors/{id}/status returns the live execution state of a connector from the Temporal workflow API. Includes last_sync_at, records_synced_last_run, and current_error (if any) for display in the tenant admin portal.
