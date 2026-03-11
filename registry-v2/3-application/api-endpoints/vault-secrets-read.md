---
type: api_endpoint
name: Vault Secrets Read
description: HashiCorp Vault API endpoint for retrieving secrets, generating dynamic credentials, and performing transit encryption operations.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-006
protocol: REST
auth_method: mTLS

parent_software_subsystem: vault-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

The Vault API path /v1/secret/data/{path} handles KV-v2 secret reads. Platform services authenticate via the Kubernetes auth method (/v1/auth/kubernetes/login). Dynamic database credentials are issued via /v1/database/creds/{role} with a configurable TTL and automatic revocation on token expiry.
