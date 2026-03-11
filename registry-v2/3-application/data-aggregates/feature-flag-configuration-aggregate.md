---
type: data-aggregate
name: Feature Flag Configuration Aggregate
description: Consistency boundary for a single feature flag, including its targeting rules, rollout state per environment, and change history.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
lifecycle_states:
  - draft
  - active
  - archived

parent_data_concept: Feature Flag Configuration
owned_by_component: Feature Flag Management
owned_by_software_subsystem: flag-evaluation-api
composes_data_entities:
  - Flag Rule
  - Flag Environment State

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Feature Flag Configuration Aggregate maintains the invariant that a flag's total targeting percentage across all rules cannot exceed 100%. Changes to the active flag rules are version-stamped and stored immutably for rollback and audit purposes.
