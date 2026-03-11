---
type: domain-event
name: MFA Challenge Failed
description: Emitted when a user fails a multi-factor authentication challenge, incrementing the failed attempt counter and potentially triggering an account lockout.
owner: Security Team
status: active
domain: Security and Compliance
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/mfa-challenge-failed

published_by_api_endpoints:
  - auth-token-issue
consumed_by_api_endpoints:
  - audit-event-ingest
  - access-control-api

archimate_type: application-event
ddd_type: Domain Event
---

MFA Challenge Failed is a security-critical signal. The audit trail records every failed attempt with originating IP and device fingerprint. The access control layer evaluates the failure count against lockout thresholds and can trigger an automatic account lock for brute-force prevention.
