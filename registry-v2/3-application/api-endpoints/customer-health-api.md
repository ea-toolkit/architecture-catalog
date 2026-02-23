---
type: api_endpoint
name: Customer Health API
description: REST API exposing customer health scores, risk indicators, and engagement metrics per tenant.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: customer-health-service
implements_api_contract: ~

archimate_type: application-interface
---

Customer Health API provides real-time access to computed health scores and risk signals for each tenant. It powers dashboards, alerts, and automated workflows that respond to changes in customer health.

## Endpoints

- `GET /api/v1/health/scores` — List health scores for all tenants
- `GET /api/v1/health/scores/{tenant-id}` — Get health score for a specific tenant
- `GET /api/v1/health/risks` — List tenants at risk of churn
- `POST /api/v1/health/recalculate` — Trigger health score recalculation
