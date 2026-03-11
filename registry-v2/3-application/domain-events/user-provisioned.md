---
type: domain-event
name: User Provisioned
description: Emitted when a new user account is successfully created via SCIM provisioning or manual admin invite, granting the user access to the platform.
owner: Security Team
status: active
domain: Security and Compliance
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/user-provisioned

published_by_api_endpoints:
  - scim-users-provision
consumed_by_api_endpoints:
  - audit-event-ingest
  - notification-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

User Provisioned triggers the welcome onboarding flow and updates seat utilisation metrics. The audit trail records the provisioning source (SCIM, admin invite, SSO), and analytics updates per-tenant user count figures for billing seat calculations.
