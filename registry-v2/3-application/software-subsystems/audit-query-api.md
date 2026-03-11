---
type: software-subsystem
name: Audit Query API
description: REST API for querying, filtering, and exporting audit log records, used by compliance teams, security operations, and automated reporting.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-004
environments:
  - production
  - staging

parent_software_system: Audit Trail Service
composes_api_endpoints:
  - audit-events-query
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Audit Query API translates REST filter parameters into BigQuery SQL with partition pruning on the event_timestamp column. Export endpoints stream results as NDJSON or CSV for compliance tool ingestion. All queries are scoped to the requesting tenant by default.
