---
type: data-concept
name: Partner Connector
description: Represents a configured integration between the platform and a specific third-party system, including credentials, field mappings, and sync schedule.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
data_catalog_id: DC-INT-003
classification: business-confidential

owned_by_domain: Integration and Connectivity
composes_data_aggregates:
  - Partner Connector Aggregate
  - Sync Job Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Partner Connector is the data concept grouping everything needed for a third-party integration: OAuth tokens or API key credentials, connector type (e.g., Salesforce), directional field maps, sync interval, and status. Classified as business-confidential due to stored OAuth refresh tokens.
