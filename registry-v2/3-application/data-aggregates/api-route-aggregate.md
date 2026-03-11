---
type: data-aggregate
name: API Route Aggregate
description: Consistency boundary for API route configuration including upstream URL, rate limit policies, authentication requirements, and plugin settings.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
lifecycle_states:
  - draft
  - active
  - deprecated

parent_data_concept: Integration Configuration
owned_by_component: API Gateway Management
owned_by_software_subsystem: gateway-proxy
composes_data_entities:
  - API Route
  - Rate Limit Policy

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

API Route Aggregate owns the configuration for a single API route. Invariant: a route must have at least one upstream target and one authentication plugin before becoming active.
