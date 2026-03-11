---
type: component
name: Identity and Access Management
description: Manages user authentication, SSO federation, MFA, SCIM provisioning, role-based access policies, and API key lifecycle across the Enterprise Platform.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: hybrid

parent_domain: Security and Compliance
composes_components: []
owns_data_aggregates:
  - Identity Record Aggregate
realizes_api_contracts:
  - Authentication API
  - Authorization API
realizes_business_capability: Identity and Access Management
realized_by_software_systems:
  - IAM Platform

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Identity and Access Management is the security perimeter for all authentication and authorization decisions. It federates identity via SAML/OIDC, enforces MFA requirements per tenant policy, and provides a centralized policy engine for fine-grained authorization checks across all platform services.
