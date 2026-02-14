---
type: software-system
name: Platform Core
description: Core CRM application handling tenant management, contact records, and platform administration.
owner: Platform Team
status: active
domain: Customer Management
registered: false
sourcing: in-house

composes_software_subsystems:
  - crm-api-gateway
realizes_logical_component: Tenant Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

NovaCRM Core is the primary application providing tenant onboarding, contact management, and administrative capabilities.
