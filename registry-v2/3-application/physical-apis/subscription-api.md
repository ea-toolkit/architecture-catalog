---
type: physical-business-api
name: Subscription API
description: REST API for subscription plan management, billing cycle control, and invoice retrieval.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
protocol: REST/JSON

parent_software_subsystem: billing-worker
implements_logical_api: ~

archimate_type: application-interface
c4_type: ~
togaf_type: Information System Service
---

The Subscription API manages subscription lifecycle including plan selection, upgrades, and billing history.

## Endpoints

- `POST /api/v1/subscriptions` — Create subscription
- `GET /api/v1/subscriptions/{id}` — Get subscription details
- `PUT /api/v1/subscriptions/{id}/plan` — Change plan
- `GET /api/v1/subscriptions/{id}/invoices` — List invoices
