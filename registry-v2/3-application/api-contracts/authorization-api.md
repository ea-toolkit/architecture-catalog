---
type: api_contract
name: Authorization API
description: Logical API contract for evaluating authorization policies, managing role assignments, and querying effective permissions for a given identity.
owner: Security Team
domain: Security and Compliance
status: active
registered: false

realized_by_component: Identity and Access Management
implemented_by_api_endpoints: []

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for authorization operations. Covers permission evaluation (is user X allowed to do Y on resource Z?), role assignment management, and effective permission queries. Implemented via OPA policy evaluation in the Policy Engine subsystem.
