---
type: api_contract
name: Secrets Vault API
description: Logical API contract for secrets retrieval, dynamic credential generation, transit encryption, and certificate issuance.
owner: Security Team
domain: Security and Compliance
status: active
registered: false

realized_by_component: Secrets and Key Management
implemented_by_api_endpoints:
  - vault-secrets-read

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for secrets and key management operations. Covers KV secret CRUD, dynamic database credential generation, transit encrypt/decrypt, and PKI certificate issuance. Designed to follow the HashiCorp Vault API conventions for portability.
