---
type: software-system
name: IAM Platform
description: Identity and access management platform providing SSO federation, SCIM provisioning, MFA enforcement, and RBAC/ABAC policy evaluation.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: hybrid
catalog_id: SYS-SEC-001
system_type: platform
vendor: Keycloak (self-hosted)

composes_software_subsystems:
  - iam-api
  - policy-engine
realizes_component: Identity and Access Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

IAM Platform is a Keycloak-based deployment extended with custom authorization policies. It handles OIDC/SAML federation with enterprise IdPs, SCIM provisioning, and delegates fine-grained authorization decisions to the embedded OPA (Open Policy Agent) policy engine.
