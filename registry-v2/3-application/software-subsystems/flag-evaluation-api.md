---
type: software-subsystem
name: Flag Evaluation API
description: High-throughput REST and SSE API for evaluating feature flags and streaming real-time flag updates to embedded SDK clients.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-004
environments:
  - production
  - staging

parent_software_system: Feature Flag Service
composes_api_endpoints:
  - flag-evaluate
  - flag-stream
composes_software_components: []
owns_data_aggregates:
  - Feature Flag Configuration Aggregate
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Flag Evaluation API serves flag resolution requests. Evaluation rules are loaded from Redis cache (populated from PostgreSQL) to minimize latency. The /stream SSE endpoint maintains long-lived connections and pushes rule change events when flags are modified in the admin interface.
