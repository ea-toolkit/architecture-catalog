---
type: software-subsystem
name: Webhook Subscription API
description: REST API allowing customers to create, update, and delete webhook endpoint subscriptions and query delivery history.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-004
environments:
  - production
  - staging

parent_software_system: Webhook Dispatcher
composes_api_endpoints:
  - webhook-subscriptions-create
  - webhook-subscriptions-list
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Integration GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Webhook Subscription API is a REST service that manages the lifecycle of customer webhook subscriptions. Customers register target URLs and select event types; the API validates endpoint reachability and stores subscription configuration.
