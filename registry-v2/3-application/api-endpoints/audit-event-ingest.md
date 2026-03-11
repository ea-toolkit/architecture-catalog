---
type: api_endpoint
name: Audit Event Ingest
description: High-throughput write endpoint for structured audit events from all platform services.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-003
protocol: REST
auth_method: OAuth2

parent_software_subsystem: audit-ingest-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

POST /audit/events accepts a batch of up to 500 structured audit events per request. Validates each event against the CEF schema, signs the batch with an HMAC key, and streams the records to BigQuery. Returns 202 for successful ingest; validation failures return 422 with per-event error details.
