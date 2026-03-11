---
type: api_contract
name: Authentication API
description: Logical API contract for user authentication, token issuance, SSO federation, and SCIM-based user provisioning.
owner: Security Team
domain: Security and Compliance
status: active
registered: false

realized_by_component: Identity and Access Management
implemented_by_api_endpoints:
  - auth-token-issue
  - scim-users-provision

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for all authentication-related operations. Covers OIDC token flows (authorization code, client credentials, refresh), SAML assertion processing, MFA challenge-response, and SCIM 2.0 user and group provisioning.
