---
type: api_endpoint
name: Auth Token Issue
description: OIDC token endpoint issuing JWT access and refresh tokens after verifying user credentials, SSO assertion, or client credentials.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-001
protocol: REST
auth_method: OAuth2

parent_software_subsystem: iam-api
implements_api_contract:
publishes_domain_events:
  - User Access Revoked
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

POST /oauth/token handles the OIDC authorization code, client credentials, and refresh token grant types. Returns a signed JWT with tenant-scoped claims. MFA challenge step-up is triggered when the tenant policy requires it and the user has not recently authenticated with a second factor.
