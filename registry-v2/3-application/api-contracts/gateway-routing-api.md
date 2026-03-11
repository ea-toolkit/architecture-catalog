---
type: api_contract
name: Gateway Routing API
description: Logical API contract for API gateway routing management, covering route configuration, rate limit policies, and plugin management.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false

realized_by_component: API Gateway Management
implemented_by_api_endpoints:
  - gateway-health-check

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for API gateway management operations. Covers CRUD operations on routes, consumer configuration, rate limit policy management, and gateway health reporting. Versioned at the route-resource level.
