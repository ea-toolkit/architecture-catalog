---
type: api_endpoint
name: Flag Stream
description: Server-Sent Events endpoint for streaming real-time feature flag rule changes to embedded SDK clients.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-004
protocol: REST
auth_method: API-Key

parent_software_subsystem: flag-evaluation-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GET /flags/stream opens a long-lived SSE connection. The server pushes a full ruleset snapshot on connect, then incremental rule change events as flags are modified. SDK clients update their local evaluation cache from these events, achieving sub-500ms propagation of flag changes.
