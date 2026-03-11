---
type: software-subsystem
name: Flag Admin API
description: REST API and management interface for creating, updating, and deleting feature flags, targeting rules, and rollout percentages.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-005
environments:
  - production

parent_software_system: Feature Flag Service
composes_api_endpoints:
  - flag-configure
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Flag Admin API provides CRUD operations for feature flag management. All mutations require IAM authentication and are written to the audit trail. An embedded change review workflow requires a second engineer to approve changes to flags affecting more than 20% of tenants.
