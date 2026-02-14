---
type: software-subsystem
name: CRM API Gateway
description: API gateway and routing layer for the NovaCRM Core system.
owner: Platform Team
status: active
domain: Customer Management
registered: false

parent_software_system: Platform Core
composes_physical_apis:
  - tenant-api
consumes_apis: []

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

CRM API Gateway handles authentication, rate limiting, and request routing for all NovaCRM Core API endpoints.
