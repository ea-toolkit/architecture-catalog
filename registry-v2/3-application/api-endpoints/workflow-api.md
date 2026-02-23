---
type: api_endpoint
name: Workflow API
description: REST API for defining, triggering, and monitoring automated workflows and business rules.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: workflow-engine
implements_api_contract: ~

archimate_type: application-interface
---

Workflow API enables tenants to create and manage automated business workflows. Workflows are defined as sequences of conditions and actions, triggered by domain events or scheduled intervals.

## Endpoints

- `GET /api/v1/workflows` — List all workflows
- `POST /api/v1/workflows` — Create a new workflow
- `PUT /api/v1/workflows/{id}` — Update workflow definition
- `POST /api/v1/workflows/{id}/trigger` — Manually trigger a workflow
- `GET /api/v1/workflows/{id}/executions` — List workflow execution history
