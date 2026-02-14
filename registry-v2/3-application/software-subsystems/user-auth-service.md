---
type: software-subsystem
name: User Auth Service
description: Microservice responsible for user authentication, token management, SSO integration, and session lifecycle.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_physical_apis:
  - user-management-api

archimate_type: application-component
---

User Auth Service handles all authentication and authorization concerns. It integrates with external identity providers via SAML/OIDC, manages JWT tokens, and enforces tenant-scoped access policies.
