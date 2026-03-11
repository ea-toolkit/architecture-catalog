---
type: software-subsystem
name: IAM API
description: REST and OIDC/SAML endpoints for user authentication, token issuance, SCIM provisioning, and session management.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-001
environments:
  - production
  - staging

parent_software_system: IAM Platform
composes_api_endpoints:
  - auth-token-issue
  - scim-users-provision
composes_software_components: []
owns_data_aggregates:
  - Identity Record Aggregate
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

IAM API exposes Keycloak's admin REST API and OIDC discovery endpoints. Custom endpoints handle SCIM 2.0 for automated user provisioning from enterprise IdPs. All token responses comply with JWT standards with configurable expiry per tenant policy.
