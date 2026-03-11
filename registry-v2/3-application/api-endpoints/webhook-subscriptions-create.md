---
type: api_endpoint
name: Webhook Subscriptions Create
description: REST endpoint for creating and managing webhook endpoint subscriptions, including event type selection and endpoint URL registration.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
api_catalog_id: EP-INT-002
protocol: REST
auth_method: OAuth2

parent_software_subsystem: webhook-subscription-api
implements_api_contract:
publishes_domain_events:
  - Webhook Delivery Failed
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

Accepts POST /webhooks to create a new subscription. Validates the target URL with an HTTP ping before persisting. Returns 201 with the subscription ID and a signing secret for payload verification.
