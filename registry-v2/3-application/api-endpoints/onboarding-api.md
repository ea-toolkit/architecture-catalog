---
type: api_endpoint
name: Onboarding API
description: REST API for managing tenant onboarding workflows, checkpoints, and progress tracking.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: onboarding-orchestrator
implements_api_contract: ~

archimate_type: application-interface
---

Onboarding API provides endpoints for initiating, tracking, and completing tenant onboarding flows. Each onboarding journey consists of configurable steps with checkpoint tracking.

## Endpoints

- `POST /api/v1/onboarding/start` — Initiate onboarding for a new tenant
- `GET /api/v1/onboarding/{tenant-id}/status` — Get onboarding progress
- `POST /api/v1/onboarding/{tenant-id}/checkpoint` — Mark a step complete
- `POST /api/v1/onboarding/{tenant-id}/skip` — Skip optional step
- `GET /api/v1/onboarding/templates` — List available onboarding templates
