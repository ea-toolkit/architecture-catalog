---
type: software-subsystem
name: Audit Ingest API
description: High-throughput write endpoint for structured audit events from all platform services, with event signing and buffered persistence.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-003
environments:
  - production
  - staging

parent_software_system: Audit Trail Service
composes_api_endpoints:
  - audit-event-ingest
composes_software_components: []
owns_data_aggregates:
  - Audit Log Aggregate
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Audit Ingest API is optimized for high write throughput. Events are validated against a JSON schema, signed with the platform's HMAC key, and written to an append-only BigQuery table via streaming inserts. Batching is used to reduce write costs during peak periods.
