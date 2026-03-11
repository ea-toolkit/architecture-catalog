---
type: software-system
name: Config Service
description: Centralized runtime configuration store with versioning, environment promotion, hot-reload subscriptions, and change audit trail.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: in-house
catalog_id: SYS-OPS-004
system_type: microservice

composes_software_subsystems:
  - config-api
realizes_component: Configuration Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Config Service provides a hierarchical key-value store for runtime configuration. Services subscribe via gRPC streaming and receive push notifications when watched keys change. Configuration changes go through a two-stage review (editor → approver) before promotion to production.
