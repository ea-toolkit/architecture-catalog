---
type: data-aggregate
name: Encryption Key Aggregate
description: Consistency boundary for a managed encryption key, including key metadata, rotation schedule, and usage policy.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
lifecycle_states:
  - active
  - rotating
  - retired
  - destroyed

parent_data_concept: Compliance Policy
owned_by_component: Secrets and Key Management
owned_by_software_subsystem: vault-api
composes_data_entities:
  - Encryption Key Version

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Encryption Key Aggregate tracks key versions, rotation history, and associated usage policies. Key material is never exposed outside Vault; only ciphertext operations are permitted via the transit API. Automated rotation is triggered 30 days before the configured expiry.
