---
type: component
name: Data Privacy Controls
description: Implements GDPR and data privacy compliance workflows including data subject rights requests (access, erasure, portability), consent management, and retention policy enforcement.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: in-house

parent_domain: Security and Compliance
composes_components: []
owns_data_aggregates:
  - Data Subject Request Aggregate
realizes_api_contracts:
  - Privacy Rights API
realizes_business_capability: Data Privacy
realized_by_software_systems:
  - Privacy Management System

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Data Privacy Controls orchestrates data subject rights workflows across all platform domains. On receiving an erasure request, it coordinates deletion or anonymization of PII across the customer data platform, billing records, and audit logs (with legally required retention exceptions).
