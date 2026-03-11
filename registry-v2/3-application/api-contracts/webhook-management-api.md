---
type: api_contract
name: Webhook Management API
description: Logical API contract for webhook subscription lifecycle management and delivery history querying.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false

realized_by_component: Webhook Delivery
implemented_by_api_endpoints:
  - webhook-subscriptions-create
  - webhook-subscriptions-list

archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
---

Defines the logical contract for webhook subscription management. Covers subscription creation, update, pause, delete, and delivery attempt history retrieval. All operations are scoped to the authenticated tenant.
