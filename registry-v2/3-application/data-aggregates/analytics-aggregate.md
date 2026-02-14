---
type: data-aggregate
name: Analytics Aggregate
description: Consistency boundary for analytics data including reports, metric definitions, and computed engagement scores.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false
lifecycle_states:
  - collecting
  - processing
  - published
  - archived

parent_data_concept: Usage Metrics
owned_by_logical_component: Contact Analytics
composes_data_entities:
  - Report
  - Metric Definition

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Analytics Aggregate groups all analytics-related data within a single consistency boundary, ensuring that reports and metric computations reference coherent snapshots of underlying usage data.
