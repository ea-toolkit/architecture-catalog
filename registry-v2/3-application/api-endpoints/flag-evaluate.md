---
type: api_endpoint
name: Flag Evaluate
description: REST endpoint for evaluating a feature flag for a given context (tenant ID, user attributes), returning the flag's current boolean or variant value.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-003
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

POST /flags/evaluate accepts a flag key and evaluation context (tenant_id, user_id, custom attributes) and returns the resolved value. P99 latency target is under 5ms using Redis-backed local evaluation. Bulk evaluation of up to 50 flags per request is supported.
