---
type: data-concept
name: Feature Flag Configuration
description: Represents a named feature flag with its targeting rules, rollout percentage, environment-specific overrides, and current enabled/disabled state.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
data_catalog_id: DC-OPS-003
classification: internal

owned_by_domain: Platform Operations
composes_data_aggregates:
  - Feature Flag Configuration Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Feature Flag Configuration stores the complete rule definition for a feature flag. Targeting rules support tenant ID lists, user attribute conditions, and percentage-based splits. All rule versions are retained to support audit and rollback.
