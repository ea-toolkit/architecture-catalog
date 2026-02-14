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

The Tenant API exposes endpoints for creating, reading, updating, and deactivating tenant accounts. It is the primary integration point for onboarding new organizations into the platform.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/tenants` | Create new tenant |
| `GET` | `/api/v1/tenants/{id}` | Get tenant details |
| `PUT` | `/api/v1/tenants/{id}` | Update tenant configuration |
| `DELETE` | `/api/v1/tenants/{id}` | Deactivate tenant |
| `GET` | `/api/v1/tenants/{id}/usage` | Get usage metrics |

## Authentication

All requests require a valid Bearer token in the `Authorization` header. Tokens are issued by the User Auth Service and scoped to a specific tenant.

```
Authorization: Bearer <token>
X-Tenant-Id: <tenant-uuid>
```

## Create Tenant Request

```json
{
  "name": "Acme Corp",
  "plan": "professional",
  "admin_email": "admin@acme.com",
  "settings": {
    "timezone": "America/New_York",
    "locale": "en-US",
    "max_seats": 50
  }
}
```

## Create Tenant Response

```json
{
  "id": "tn_3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Corp",
  "status": "provisioning",
  "created_at": "2025-01-15T09:30:00Z",
  "subscription": {
    "plan": "professional",
    "trial_ends_at": "2025-01-29T09:30:00Z"
  }
}
```

## OpenAPI Spec (excerpt)

```yaml
openapi: 3.0.3
info:
  title: Tenant API
  version: 1.0.0
paths:
  /api/v1/tenants:
    post:
      summary: Create a new tenant
      operationId: createTenant
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTenantRequest'
      responses:
        '201':
          description: Tenant created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Tenant'
        '409':
          description: Tenant with this domain already exists
components:
  schemas:
    CreateTenantRequest:
      type: object
      required: [name, plan, admin_email]
      properties:
        name:
          type: string
        plan:
          type: string
          enum: [starter, professional, enterprise]
        admin_email:
          type: string
          format: email
```

## Rate Limits

- **Standard tier**: 100 requests/minute per tenant
- **Enterprise tier**: 1000 requests/minute per tenant
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Error Codes

| Code | Meaning |
|------|---------|
| `TENANT_NOT_FOUND` | Tenant ID does not exist |
| `TENANT_SUSPENDED` | Tenant account is suspended |
| `PLAN_LIMIT_EXCEEDED` | Seat or storage limit reached |
| `DUPLICATE_DOMAIN` | Domain name already registered |
