---
type: api_endpoint
name: Flag Configure
description: REST endpoint for creating, updating, and archiving feature flags and their targeting rules via the admin interface.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-005
protocol: REST
auth_method: OAuth2

parent_software_subsystem: flag-admin-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

PUT /admin/flags/{key} accepts a full flag definition including rules and rollout percentages. All mutations require the caller to have the flag-admin IAM role. Changes affecting more than 20% of tenants enter a two-stage approval workflow before taking effect.
