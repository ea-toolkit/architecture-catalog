---
type: api_endpoint
name: Audit Events Query
description: REST endpoint for querying, filtering, and exporting audit log records by tenant, actor, resource type, and time range.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-004
protocol: REST
auth_method: OAuth2

parent_software_subsystem: audit-query-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GET /audit/events accepts filter parameters (actor_id, resource_type, from, to) and returns paginated results. GET /audit/events/export streams the full result as NDJSON. All queries require the caller's tenant scope; platform admins can pass an explicit tenant_id override.
