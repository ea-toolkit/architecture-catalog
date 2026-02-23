---
type: api_endpoint
name: Integration API
description: REST API for managing webhooks, third-party connectors, and external event relay configurations.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: integration-gateway
implements_api_contract: ~

archimate_type: application-interface
---

Integration API provides endpoints for configuring outbound integrations. Tenants can register webhook URLs, configure pre-built connectors, and subscribe to domain events for relay to external systems.

## Endpoints

- `GET /api/v1/integrations/webhooks` — List registered webhooks
- `POST /api/v1/integrations/webhooks` — Register a new webhook
- `DELETE /api/v1/integrations/webhooks/{id}` — Remove a webhook
- `GET /api/v1/integrations/connectors` — List available connectors
- `POST /api/v1/integrations/connectors/{id}/activate` — Activate a connector
