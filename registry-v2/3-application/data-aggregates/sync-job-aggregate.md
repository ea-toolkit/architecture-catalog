---
type: data-aggregate
name: Sync Job Aggregate
description: Consistency boundary for a data sync job execution, tracking schedule, run history, record counts, and error summaries.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
lifecycle_states:
  - scheduled
  - running
  - completed
  - failed
  - cancelled

parent_data_concept: Partner Connector
owned_by_component: Data Sync Engine
owned_by_software_subsystem: sync-scheduler
composes_data_entities:
  - Sync Job Run
  - Sync Error Record

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Sync Job Aggregate tracks the execution lifecycle of a single sync job run. It captures start time, record counts per entity type, transformation errors, and final outcome. Historical runs are retained for 90 days for debugging and audit purposes.
