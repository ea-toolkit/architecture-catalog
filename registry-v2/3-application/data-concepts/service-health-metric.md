---
type: data-concept
name: Service Health Metric
description: Represents a time-series metric measuring the health, performance, or resource utilization of a platform service.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
data_catalog_id: DC-OPS-001
classification: internal

owned_by_domain: Platform Operations
composes_data_aggregates:
  - Service Health Metric Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Service Health Metric is the data concept for all operational telemetry. Encompasses the RED method (Rate, Errors, Duration) metrics per service, infrastructure resource utilization, and SLO error budget consumption. Used to drive alerting rules and SLO compliance dashboards.
