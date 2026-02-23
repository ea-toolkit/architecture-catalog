---
type: software-subsystem
name: Onboarding Orchestrator
description: Workflow engine that coordinates multi-step tenant onboarding sequences including provisioning, data migration, and welcome flows.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - onboarding-api

archimate_type: application-component
---

Onboarding Orchestrator manages the end-to-end tenant onboarding journey. It coordinates account provisioning, initial data import, SSO configuration, welcome email sequences, and guided product tours. Each step is tracked as a checkpoint, allowing tenants to resume interrupted onboarding.
