---
type: domain-event
name: Tenant Created
description: Emitted when a new tenant account is successfully provisioned and ready for use.
owner: Platform Team
status: active
domain: Customer Management
registered: false
event_format: CloudEvents/JSON

published_by_physical_apis:
  - tenant-api
consumed_by_physical_apis:
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

The Tenant Created event signals that a new B2B customer has completed onboarding. Downstream consumers use this to initialize analytics tracking and send welcome communications.
