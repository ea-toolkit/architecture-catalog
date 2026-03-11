---
type: software-subsystem
name: Connector Runtime
description: Temporal worker hosting the execution environment for all partner connector workflows and activities.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-005
environments:
  - production
  - staging

parent_software_system: Integration Middleware
composes_api_endpoints:
  - connector-status-get
composes_software_components: []
owns_data_aggregates:
  - Partner Connector Aggregate
served_by_cloud_services:
  - Integration GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Connector Runtime is a Temporal worker fleet executing connector workflows. Each connector (e.g., Salesforce, HubSpot) is implemented as a Temporal workflow with activities for authentication refresh, data fetch, transformation, and upsert. Activity isolation ensures one connector's failure cannot impact others.
