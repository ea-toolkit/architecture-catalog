---
type: software-system
name: Feature Flag Service
description: Server-side feature flag evaluation service with a management UI, REST API, and client SDK for controlling feature availability at runtime.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: in-house
catalog_id: SYS-OPS-003
system_type: microservice

composes_software_subsystems:
  - flag-evaluation-api
  - flag-admin-api
realizes_component: Feature Flag Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Feature Flag Service provides a lightweight flag evaluation engine. Flag rules are stored in PostgreSQL, cached in Redis, and streamed as SSE (Server-Sent Events) to embedded SDK clients. Flag changes propagate to all connected SDK clients within 500ms via the streaming endpoint.
