---
type: data-aggregate
name: Webhook Subscription Aggregate
description: Consistency boundary for a customer webhook subscription, tracking endpoint URL, event filters, secret, and delivery attempt history.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
lifecycle_states:
  - active
  - paused
  - disabled

parent_data_concept: Webhook Subscription
owned_by_component: Webhook Delivery
owned_by_software_subsystem: webhook-delivery-worker
composes_data_entities:
  - Webhook Endpoint
  - Delivery Attempt

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Webhook Subscription Aggregate enforces the invariant that a subscription's endpoint must pass an initial reachability test before activation. Delivery attempt history is retained for 30 days.
