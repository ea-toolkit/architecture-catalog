---
type: software-system
name: Audit Trail Service
description: Append-only event store and query service for all security-relevant and compliance-relevant events across the platform.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: in-house
catalog_id: SYS-SEC-002
system_type: microservice

composes_software_subsystems:
  - audit-ingest-api
  - audit-query-api
realizes_component: Audit and Compliance

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Audit Trail Service provides an immutable, append-only event log. Ingest endpoints accept structured audit events from all services; the query API supports filtering by tenant, actor, resource type, and time range. Events are signed with a platform key to detect tampering.
