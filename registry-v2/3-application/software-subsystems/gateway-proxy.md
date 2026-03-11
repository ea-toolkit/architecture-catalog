---
type: software-subsystem
name: Gateway Proxy
description: Kong proxy data plane handling request routing, plugin execution (auth, rate limit, logging), and upstream forwarding.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-001
environments:
  - production
  - staging

parent_software_system: API Gateway Platform
composes_api_endpoints:
  - gateway-health-check
composes_software_components: []
owns_data_aggregates: []
served_by_application_infrastructure: []
served_by_cloud_services:
  - Integration GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Gateway Proxy runs as a set of Kong pods in Kubernetes. Each request passes through the plugin chain configured per route: JWT validation, consumer rate limit checks, request logging, and upstream proxying.
