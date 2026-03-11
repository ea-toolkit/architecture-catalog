---
type: data-aggregate
name: Audit Log Aggregate
description: Append-only collection of audit log entries for a given tenant, partitioned by time for efficient querying and retention management.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
lifecycle_states:
  - active
  - archived
  - purged

parent_data_concept: Audit Log Entry
owned_by_component: Audit and Compliance
owned_by_software_subsystem: audit-ingest-api
composes_data_entities:
  - Audit Event

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Audit Log Aggregate is an append-only structure; no update or delete operations are permitted during the retention window. Retention defaults to 2 years; regulatory hold annotations can extend this indefinitely. Archived partitions are moved to cold storage (GCS Nearline) after 90 days.
