---
type: software-subsystem
name: Vault API
description: HashiCorp Vault API endpoints for secrets retrieval, dynamic credential generation, PKI certificate issuance, and transit encryption operations.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-006
environments:
  - production
  - staging

parent_software_system: Secrets Vault
composes_api_endpoints:
  - vault-secrets-read
composes_software_components: []
owns_data_aggregates:
  - Encryption Key Aggregate
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Vault API is the standard HashiCorp Vault HTTP API surface. Platform services authenticate using Kubernetes Service Account tokens; Vault validates the token against the Kubernetes API and returns a short-lived Vault token scoped to the service's policy.
