---
type: api_endpoint
name: Metrics Query Endpoint
description: Prometheus HTTP API endpoint for querying time-series metrics data, used by Grafana dashboards and alerting rule evaluation.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-001
protocol: REST
auth_method: OAuth2

parent_software_subsystem: prometheus-metrics
implements_api_contract:
publishes_domain_events:
  - SLO Breach Detected
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GET /api/v1/query and /api/v1/query_range implement the standard Prometheus HTTP API for instant and range queries. Grafana datasources connect via this endpoint. Access is restricted to the operations cluster network by default; external access requires explicit Vault-issued credentials.
