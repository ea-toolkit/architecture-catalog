---
type: domain-event
name: Contact Updated
description: Emitted when an existing contact's profile data is modified, propagating changes to all dependent systems.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - customer-data-api
consumed_by_api_endpoints:
  - integration-api
  - workflow-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Contact Updated signals that a contact's attributes have changed (email, phone, title, etc.). This propagates the change to external integrations, evaluates workflow triggers, and logs the modification for audit compliance.
