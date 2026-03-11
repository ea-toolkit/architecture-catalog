---
type: component
name: Audit and Compliance
description: Captures all security-relevant events into a tamper-evident audit trail, and provides querying, export, and compliance reporting capabilities.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: in-house

parent_domain: Security and Compliance
composes_components: []
owns_data_aggregates:
  - Audit Log Aggregate
realizes_api_contracts:
  - Audit Query API
realizes_business_capability: Audit and Compliance
realized_by_software_systems:
  - Audit Trail Service

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Audit and Compliance ingests structured events from all platform services, appends them to an immutable append-only store, and provides a query API for security investigations and compliance evidence exports. All records are signed to detect tampering.
