---
type: software-subsystem
name: Webhook Delivery Worker
description: Background worker consuming domain events from the message bus, resolving subscriptions, and dispatching HTTP callbacks with retry logic.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-003
environments:
  - production
  - staging

parent_software_system: Webhook Dispatcher
composes_api_endpoints: []
composes_software_components: []
owns_data_aggregates:
  - Webhook Subscription Aggregate
served_by_cloud_services:
  - Integration GKE Cluster
  - Integration Message Bus

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Webhook Delivery Worker is a Go-based consumer group subscribed to the platform's Kafka topics. On each event it resolves matching webhook subscriptions from the database and enqueues HTTP delivery tasks to a dedicated worker pool with exponential backoff.
