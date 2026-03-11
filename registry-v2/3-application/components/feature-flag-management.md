---
type: component
name: Feature Flag Management
description: Provides a flag evaluation engine, management UI, and SDK integrations for controlling feature availability by tenant, user cohort, or percentage rollout.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: in-house

parent_domain: Platform Operations
composes_components: []
owns_data_aggregates:
  - Feature Flag Configuration Aggregate
realizes_api_contracts:
  - Feature Flag Evaluation API
realizes_business_capability: Feature Management
realized_by_software_systems:
  - Feature Flag Service

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Feature Flag Management allows product teams to independently control feature rollout without deployments. The evaluation SDK is embedded in all platform services and resolves flags server-side using a cached ruleset streamed from the flag service. Supports targeting by tenant ID, user attribute, and percentage splits.
