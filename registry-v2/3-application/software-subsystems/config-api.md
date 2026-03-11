---
type: software-subsystem
name: Config API
description: gRPC and REST API for reading and subscribing to runtime configuration values, with environment-scoped access control and change streaming.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-006
environments:
  - production
  - staging

parent_software_system: Config Service
composes_api_endpoints:
  - config-values-get
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Config API serves configuration reads and subscriptions. The gRPC streaming endpoint is preferred for internal services; the REST endpoint serves external tooling. Configuration reads are scoped to the caller's environment (production callers cannot read staging config).
