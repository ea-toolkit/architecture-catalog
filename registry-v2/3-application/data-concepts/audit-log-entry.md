---
type: data-concept
name: Audit Log Entry
description: Represents a single immutable record of a security-relevant or compliance-relevant event that occurred on the platform.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
data_catalog_id: DC-SEC-002
classification: business-confidential

owned_by_domain: Security and Compliance
composes_data_aggregates:
  - Audit Log Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Audit Log Entry records who did what to which resource, when, and from which IP address. The schema is standardized across all services using the CEF (Common Event Format) fields subset. Each entry includes a platform-level HMAC signature for tamper detection.
