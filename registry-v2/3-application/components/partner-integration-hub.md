---
type: component
name: Partner Integration Hub
description: Hosts pre-built connectors for third-party systems, manages connector lifecycle, and coordinates bi-directional data mapping and sync scheduling.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: hybrid

parent_domain: Integration and Connectivity
composes_components: []
owns_data_aggregates:
  - Partner Connector Aggregate
realizes_api_contracts:
  - Connector Management API
realizes_business_capability: Partner Connectivity
realized_by_software_systems:
  - Integration Middleware

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Partner Integration Hub provides a catalog of certified connectors to systems such as Salesforce, HubSpot, Slack, Jira, and SAP. It manages connector configuration, field mapping, sync direction, and surfacing errors back to customers.
