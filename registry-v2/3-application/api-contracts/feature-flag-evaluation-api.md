---
type: api_contract
name: Feature Flag Evaluation API
description: Logical API contract for feature flag evaluation and real-time rule change streaming.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false

realized_by_component: Feature Flag Management
implemented_by_api_endpoints:
  - flag-evaluate
  - flag-stream
  - flag-configure

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for feature flag operations. Covers flag evaluation (single and bulk), real-time change streaming (SSE), and flag administration (create, update, archive). SDK clients rely on the evaluation and streaming contracts for embedded flag resolution.
