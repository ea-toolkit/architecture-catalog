---
type: physical-business-api
name: User Management API
description: REST API for user lifecycle management including invitations, role assignments, and access revocation.
owner: Platform Team
status: active
domain: Customer Management
registered: false
protocol: REST/JSON

parent_software_subsystem: user-auth-service
implements_logical_api: ~

archimate_type: application-interface
togaf_type: Information System Service
---

User Management API provides endpoints for managing users within a tenant workspace. It supports invitation workflows, role/permission assignment, user suspension, and bulk operations.

## Endpoints

- `POST /api/v1/users/invite` — Send user invitation
- `GET /api/v1/users` — List users in tenant
- `PATCH /api/v1/users/{id}/role` — Update user role
- `DELETE /api/v1/users/{id}` — Revoke user access
- `POST /api/v1/users/bulk-import` — Bulk import users from CSV
