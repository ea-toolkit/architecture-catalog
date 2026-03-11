---
type: software-system
name: API Gateway Platform
description: Managed API gateway handling inbound traffic routing, authentication enforcement, rate limiting, and developer portal for the Enterprise Platform.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: vendor
catalog_id: SYS-INT-001
system_type: gateway
vendor: Kong

composes_software_subsystems:
  - gateway-proxy
  - developer-portal
realizes_component: API Gateway Management

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

API Gateway Platform uses Kong as the underlying gateway, deployed on-cluster. It provides the routing plane, plugin ecosystem (auth, rate limiting, transformations), and a self-service developer portal backed by Kong Manager.
