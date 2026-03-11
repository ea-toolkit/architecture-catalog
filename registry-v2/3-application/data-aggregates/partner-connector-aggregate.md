---
type: data-aggregate
name: Partner Connector Aggregate
description: Consistency boundary for a tenant's partner connector configuration, including credentials, field mappings, and connector status.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
lifecycle_states:
  - configuring
  - active
  - error
  - paused
  - disconnected

parent_data_concept: Partner Connector
owned_by_component: Partner Integration Hub
owned_by_software_subsystem: connector-runtime
composes_data_entities:
  - Connector Credential
  - Field Mapping Rule

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Partner Connector Aggregate owns a single tenant-connector pair. Credentials are stored as encrypted references to the secrets manager. Field mappings are validated against both source and target schemas at configuration time.
