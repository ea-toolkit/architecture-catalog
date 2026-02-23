---
type: software-subsystem
name: Notification Service
description: Centralized notification delivery engine handling email, SMS, push, and in-app messages across all tenant channels.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - notification-api

archimate_type: application-component
---

Notification Service manages the full lifecycle of customer notifications. It supports templated email delivery, SMS via Twilio, push notifications via FCM/APNS, and real-time in-app messages via WebSocket. All notifications are tenant-scoped and respect per-user channel preferences.
