---
type: software-subsystem
name: Access Control Service
description: Fine-grained authorization service enforcing role-based and attribute-based access policies across all platform resources.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - access-control-api

archimate_type: application-component
---

Access Control Service evaluates authorization decisions for every API request. It supports RBAC (role-based), ABAC (attribute-based), and tenant-scoped resource policies. Policy changes are applied in real-time without requiring session invalidation.
