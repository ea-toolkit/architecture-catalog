---
type: data-concept
name: Integration Configuration
description: Represents the complete configuration for a tenant's integration setup, including API credentials, connector settings, and sync preferences.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
data_catalog_id: DC-INT-001
classification: business-confidential

owned_by_domain: Integration and Connectivity
composes_data_aggregates:
  - API Route Aggregate
  - Partner Connector Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Integration Configuration captures how a tenant has configured the platform's integration capabilities. It scopes API route rules, auth credential references, and connector-specific field mappings. Treated as business-confidential due to API key storage.
