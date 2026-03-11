---
type: software-system
name: Secrets Vault
description: HashiCorp Vault deployment managing secrets, API credentials, TLS certificates, and encryption keys for all platform services.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: vendor
catalog_id: SYS-SEC-004
system_type: platform
vendor: HashiCorp Vault

composes_software_subsystems:
  - vault-api
realizes_component: Secrets and Key Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Secrets Vault is a high-availability HashiCorp Vault cluster auto-unsealed via GCP KMS. Provides dynamic secrets for database credentials, PKI for certificate issuance, and transit encryption for application-level data encryption. All services use Kubernetes auth method for zero-trust secret retrieval.
