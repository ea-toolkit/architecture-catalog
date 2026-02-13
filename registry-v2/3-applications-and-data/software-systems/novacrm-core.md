---
type: software-system
name: NovaCRM Core
description: Core CRM application handling tenant management, contact records, and platform administration.
owner: Platform Team
status: active
domain: NovaCRM Platform
registered: false
make_or_buy: make

composes_software_subsystems:
  - crm-api-gateway
realizes_logical_component: Tenant Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

NovaCRM Core is the primary application providing tenant onboarding, contact management, and administrative capabilities.
