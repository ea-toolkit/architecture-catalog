---
type: software-subsystem
name: Developer Portal
description: Self-service web portal for API consumers to browse documentation, manage API keys, test endpoints, and review usage analytics.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-002
environments:
  - production
  - staging

parent_software_system: API Gateway Platform
composes_api_endpoints: []
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Integration GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Developer Portal is a Kong Developer Portal instance providing interactive API documentation generated from OpenAPI specs, OAuth client credential flows, and a usage dashboard per API key.
