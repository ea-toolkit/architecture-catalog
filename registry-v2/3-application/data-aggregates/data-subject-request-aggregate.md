---
type: data-aggregate
name: Data Subject Request Aggregate
description: Tracks the full lifecycle of a GDPR or CCPA data subject rights request from submission through completion, including downstream task coordination.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
lifecycle_states:
  - submitted
  - validating
  - processing
  - completed
  - rejected
  - overdue

parent_data_concept: Compliance Policy
owned_by_component: Data Privacy Controls
owned_by_software_subsystem: privacy-rights-api
composes_data_entities:
  - Data Subject Request
  - Deletion Task

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Data Subject Request Aggregate enforces SLA compliance (30-day response window for GDPR Article 17). When a request moves to the processing state, deletion tasks are created for each owning system. The aggregate transitions to completed only when all tasks report success.
