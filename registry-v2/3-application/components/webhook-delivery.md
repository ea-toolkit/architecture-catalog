---
type: component
name: Webhook Delivery
description: Manages customer webhook subscriptions, reliable event delivery with retries, dead-letter queuing, and delivery status tracking.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: in-house

parent_domain: Integration and Connectivity
composes_components: []
owns_data_aggregates:
  - Webhook Subscription Aggregate
realizes_api_contracts:
  - Webhook Management API
realizes_business_capability: Event Streaming
realized_by_software_systems:
  - Webhook Dispatcher

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Webhook Delivery allows customers to subscribe to platform events and receive real-time HTTP callbacks. The component guarantees at-least-once delivery with exponential backoff retries, configurable endpoints per event type, and a dead-letter queue for failed deliveries.
