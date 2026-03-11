---
type: api_contract
name: Audit Query API
description: Logical API contract for querying, filtering, and exporting audit log records.
owner: Security Team
domain: Security and Compliance
status: active
registered: false

realized_by_component: Audit and Compliance
implemented_by_api_endpoints:
  - audit-event-ingest
  - audit-events-query

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for audit trail operations. Covers audit event submission, query with filter parameters, and export operations. All operations are scoped to the caller's tenant; platform admin role is required to query cross-tenant.
