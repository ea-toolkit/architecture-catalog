---
type: software-subsystem
name: Analytics Pipeline
description: ETL pipeline that ingests events and transforms them into analytics-ready datasets.
owner: Analytics Team
status: active
domain: Analytics and Insights
registered: false

parent_software_system: Analytics Warehouse
composes_api_endpoints:
  - analytics-query-api
consumes_apis: []

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Analytics Pipeline ingests domain events from the platform and transforms them into queryable datasets for dashboards and reports.
