---
type: software-subsystem
name: Integration Gateway
description: Managed integration layer providing webhooks, third-party connectors, and event relay for external system connectivity.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - integration-api

archimate_type: application-component
---

Integration Gateway provides the outbound connectivity layer for the platform. It manages webhook delivery with retry logic, provides pre-built connectors for popular CRMs (Salesforce, HubSpot), and relays domain events to external systems via configurable event subscriptions.
