---
type: data-concept
name: Compliance Policy
description: Represents a configured compliance rule set defining data handling requirements, retention periods, and access restrictions for a tenant.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
data_catalog_id: DC-SEC-003
classification: internal

owned_by_domain: Security and Compliance
composes_data_aggregates:
  - Data Subject Request Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Compliance Policy captures the specific regulatory obligations applicable to a tenant (e.g., GDPR Article 17 for erasure, CCPA opt-out). Policies drive automated retention enforcement and data subject request workflows. Tenant admins configure policies via the admin portal; changes trigger a policy version bump.
