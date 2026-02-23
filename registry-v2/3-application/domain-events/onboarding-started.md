---
type: domain-event
name: Onboarding Started
description: Emitted when a new tenant begins the onboarding journey, triggering provisioning workflows and welcome sequences.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - onboarding-api
consumed_by_api_endpoints:
  - notification-api
  - customer-health-api
  - workflow-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Onboarding Started signals the beginning of a tenant onboarding flow. Downstream consumers use it to send welcome emails, initialize health tracking baselines, trigger automated onboarding workflows, and log the provisioning event.
