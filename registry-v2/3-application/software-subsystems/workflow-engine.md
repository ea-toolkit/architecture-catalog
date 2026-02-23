---
type: software-subsystem
name: Workflow Engine
description: General-purpose automation engine that executes tenant-configured workflows triggered by domain events and schedules.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - workflow-api

archimate_type: application-component
---

Workflow Engine enables tenants to define automated business rules and multi-step processes. Workflows are triggered by domain events (e.g., new contact created, deal stage changed) or scheduled intervals. Actions include sending notifications, updating records, calling webhooks, and creating tasks.
