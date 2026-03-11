---
type: software-system
name: Webhook Dispatcher
description: Event-driven microservice responsible for receiving domain events, matching subscriptions, and reliably delivering HTTP callbacks to customer endpoints.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: in-house
catalog_id: SYS-INT-002
system_type: microservice

composes_software_subsystems:
  - webhook-delivery-worker
  - webhook-subscription-api
realizes_component: Webhook Delivery

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Webhook Dispatcher consumes events from the internal event bus, resolves matching customer subscriptions, and dispatches HTTP POST callbacks. It persists delivery attempts, applies exponential backoff retries, and routes permanently failed deliveries to a dead-letter topic.
