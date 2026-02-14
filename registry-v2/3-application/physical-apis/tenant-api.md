---
type: physical-business-api
name: Tenant API
description: REST API for tenant CRUD operations, onboarding workflows, and configuration management.
owner: Platform Team
status: active
domain: Customer Management
registered: false
protocol: REST/JSON

parent_software_subsystem: crm-api-gateway
implements_logical_api: ~

archimate_type: application-interface
c4_type: ~
togaf_type: Information System Service
---

The Tenant API exposes endpoints for creating, reading, updating, and deactivating tenant accounts.

## Endpoints

- `POST /api/v1/tenants` — Create new tenant
- `GET /api/v1/tenants/{id}` — Get tenant details
- `PUT /api/v1/tenants/{id}` — Update tenant configuration
- `DELETE /api/v1/tenants/{id}` — Deactivate tenant
