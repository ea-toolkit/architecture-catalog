---
type: data-aggregate
name: Service Health Metric Aggregate
description: Consistency boundary for the collected time-series metrics for a given service, including SLO thresholds, alerting rule bindings, and current error budget state.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
lifecycle_states:
  - healthy
  - degraded
  - critical
  - unknown

parent_data_concept: Service Health Metric
owned_by_component: Observability Platform
owned_by_software_subsystem: prometheus-metrics
composes_data_entities:
  - SLO Definition
  - Alert Rule

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Service Health Metric Aggregate groups the SLO definition, active alerting rules, and real-time error budget consumption for a single service. State transitions (healthy → degraded → critical) trigger automated incident creation in PagerDuty.
