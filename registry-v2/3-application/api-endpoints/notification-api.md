---
type: api_endpoint
name: Notification API
description: REST API for managing notification preferences, delivery channels, and sending transactional notifications to tenant users.
owner: Platform Team
status: draft
domain: Customer Management
registered: false
protocol: REST/JSON

parent_software_subsystem: tenant-admin-portal
implements_api_contract: ~

archimate_type: application-interface
togaf_type: Information System Service
---

Notification API handles delivery of transactional notifications (email, in-app, webhook) to tenant users. It supports template management, delivery preferences, and notification history.

## Endpoints

- `POST /api/v1/notifications/send` — Send notification
- `GET /api/v1/notifications/preferences` — Get user notification preferences
- `PUT /api/v1/notifications/preferences` — Update notification preferences
- `GET /api/v1/notifications/history` — List notification history
