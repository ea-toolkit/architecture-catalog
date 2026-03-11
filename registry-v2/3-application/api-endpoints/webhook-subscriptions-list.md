---
type: api_endpoint
name: Webhook Subscriptions List
description: REST endpoint for listing webhook subscriptions, querying delivery history, and pausing or deleting existing subscriptions.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
api_catalog_id: EP-INT-003
protocol: REST
auth_method: OAuth2

parent_software_subsystem: webhook-subscription-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

GET /webhooks returns a paginated list of all active subscriptions for the authenticated tenant. GET /webhooks/{id}/deliveries returns the last 100 delivery attempts with status codes and response bodies for debugging.
