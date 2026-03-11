---
type: api_endpoint
name: Config Values Get
description: gRPC and REST endpoint for reading runtime configuration values and subscribing to configuration change streams.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-006
protocol: gRPC
auth_method: OAuth2

parent_software_subsystem: config-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GetConfig RPC accepts a namespace and key, returning the current value and version. WatchConfig initiates a server-streaming RPC that pushes value change events. The REST fallback accepts GET /config/{namespace}/{key} for tooling that does not support gRPC.
