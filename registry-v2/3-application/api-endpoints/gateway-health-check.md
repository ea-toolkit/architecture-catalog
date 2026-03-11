---
type: api_endpoint
name: Gateway Health Check
description: Liveness and readiness probe endpoint for the Kong gateway proxy, returning cluster health status.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
api_catalog_id: EP-INT-001
protocol: REST
auth_method: API-Key

parent_software_subsystem: gateway-proxy
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

Returns HTTP 200 when all Kong data plane nodes are healthy. Used by the GKE readiness probe to gate traffic routing. Returns a degraded response code when any configured upstream is unreachable.
