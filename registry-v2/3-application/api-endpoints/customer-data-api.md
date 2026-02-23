---
type: api_endpoint
name: Customer Data API
description: REST API for accessing unified customer profiles, segments, and cross-touchpoint activity timelines.
owner: Platform Team
status: active
domain: Customer Management
protocol: REST/JSON

parent_software_subsystem: customer-data-platform
implements_api_contract: ~

archimate_type: application-interface
---

Customer Data API provides a unified view of customer data consolidated from CRM, support, billing, and product usage sources. It powers personalization, segmentation, and 360-degree customer views.

## Endpoints

- `GET /api/v1/customers/{id}/profile` — Get unified customer profile
- `GET /api/v1/customers/{id}/timeline` — Get activity timeline
- `GET /api/v1/customers/segments` — List customer segments
- `POST /api/v1/customers/segments` — Create a new segment
- `GET /api/v1/customers/search` — Search across all customer data
