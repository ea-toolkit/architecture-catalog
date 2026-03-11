---
type: component
name: Secrets and Key Management
description: Provides centralized management of encryption keys, TLS certificates, secrets, and service credentials used across all platform services.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: vendor

parent_domain: Security and Compliance
composes_components: []
owns_data_aggregates:
  - Encryption Key Aggregate
realizes_api_contracts:
  - Secrets Vault API
realizes_business_capability: Identity and Access Management
realized_by_software_systems:
  - Secrets Vault

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Secrets and Key Management is the platform's single point of authority for cryptographic material. All services retrieve secrets at startup via Vault agent injection rather than environment variables. Key rotation is automated via GCP KMS-backed Vault unsealing.
