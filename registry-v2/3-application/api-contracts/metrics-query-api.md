---
type: api_contract
name: Metrics Query API
description: Logical API contract for querying time-series metrics and evaluating alerting rules across all platform services.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false

realized_by_component: Observability Platform
implemented_by_api_endpoints:
  - metrics-query-endpoint

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for metrics querying. Covers Prometheus-compatible instant queries, range queries, series metadata, and alert rule state retrieval. Consumed by Grafana, automated SLO calculators, and the feature flag service's rollout health checks.
