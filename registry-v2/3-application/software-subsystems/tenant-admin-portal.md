---
type: software-subsystem
name: Tenant Admin Portal
description: Web application providing tenant administrators with account management, user provisioning, and configuration tools.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_physical_apis:
  - notification-api

archimate_type: application-component
---

Tenant Admin Portal is the self-service web interface for tenant administrators. It provides dashboards for user management, account settings, usage monitoring, and notification preferences.
