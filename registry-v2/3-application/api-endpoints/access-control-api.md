---
type: api_endpoint
name: Access Control API
description: REST API for managing roles, permissions, and authorization policies across tenant resources.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: access-control-service
implements_api_contract: ~

archimate_type: application-interface
---

Access Control API provides endpoints for defining and evaluating authorization policies. It supports role management, permission grants, and real-time policy evaluation for API requests.

## Endpoints

- `GET /api/v1/access/roles` — List roles for a tenant
- `POST /api/v1/access/roles` — Create a custom role
- `PUT /api/v1/access/roles/{id}/permissions` — Update role permissions
- `POST /api/v1/access/evaluate` — Evaluate access for a resource
- `GET /api/v1/access/policies` — List tenant access policies
