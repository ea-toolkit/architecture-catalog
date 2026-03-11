---
type: data-concept
name: Webhook Subscription
description: Represents a customer's registration of an endpoint URL to receive events of specific types from the platform.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
data_catalog_id: DC-INT-002
classification: internal

owned_by_domain: Integration and Connectivity
composes_data_aggregates:
  - Webhook Subscription Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Webhook Subscription is the logical data concept for managing customer endpoint registrations. It tracks target URL, event type filters, authentication headers (stored encrypted), and delivery status per subscription.
