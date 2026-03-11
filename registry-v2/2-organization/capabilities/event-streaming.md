---
type: business-capability
name: Event Streaming
description: The ability to publish and consume domain events reliably across internal and external boundaries using asynchronous messaging patterns.
owner: Integration Team
domain: Integration and Connectivity
status: active
maturity: Good
lifecycle: active
sourcing: in-house
size: m
registered: false

composes_process_modules: []
owns_information_objects: []
realized_by_components:
  - Webhook Delivery

archimate_type: business-function
togaf_type: Business Capability
---

Event Streaming enables the platform to communicate state changes through events rather than polling. Covers webhook subscriptions, delivery guarantees, retry policies, and event schema governance.
