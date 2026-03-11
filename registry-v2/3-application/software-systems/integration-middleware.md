---
type: software-system
name: Integration Middleware
description: Middleware platform hosting partner connectors, managing data sync job scheduling, field mapping, and transformation pipelines.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: hybrid
catalog_id: SYS-INT-003
system_type: middleware
vendor: Custom (Temporal-based)

composes_software_subsystems:
  - connector-runtime
  - sync-scheduler
realizes_components:
  - Partner Integration Hub
  - Data Sync Engine

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Integration Middleware uses Temporal for durable workflow orchestration, providing the runtime for all connector executions and sync jobs. Partners connectors run as isolated workflow activities, making it straightforward to add new connectors without impacting existing ones.
