---
type: api_contract
name: Connector Management API
description: Logical API contract for partner connector lifecycle management, including configuration, status querying, and manual sync triggering.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false

realized_by_component: Partner Integration Hub
implemented_by_api_endpoints:
  - connector-status-get

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for managing partner connectors. Covers connector creation from the catalog, OAuth credential configuration, field mapping setup, and status inspection. Designed as a REST resource model at the /connectors path.
