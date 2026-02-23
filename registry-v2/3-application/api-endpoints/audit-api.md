---
type: api_endpoint
name: Audit API
description: REST API for querying audit logs, compliance reports, and security event history.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: audit-trail-service
implements_api_contract: ~

archimate_type: application-interface
---

Audit API provides read access to the immutable audit log. It supports filtered queries by actor, resource, time range, and event type. Designed for compliance reporting and security investigations.

## Endpoints

- `GET /api/v1/audit/events` — Query audit events with filters
- `GET /api/v1/audit/events/{id}` — Get audit event detail
- `GET /api/v1/audit/reports/compliance` — Generate compliance summary
- `GET /api/v1/audit/exports` — Export audit data as CSV/JSON
