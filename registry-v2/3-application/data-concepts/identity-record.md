---
type: data-concept
name: Identity Record
description: Represents a platform user or service account, including authentication credentials, role assignments, and linked tenant context.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
data_catalog_id: DC-SEC-001
classification: pii

owned_by_domain: Security and Compliance
composes_data_aggregates:
  - Identity Record Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Identity Record is the authoritative data concept for who can access the platform. It contains user profile data (PII), linked tenant memberships, assigned roles, MFA device registrations, and active session tokens. Classified as PII due to email, name, and authentication credential fields.
