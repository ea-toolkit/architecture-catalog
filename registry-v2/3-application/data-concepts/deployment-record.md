---
type: data-concept
name: Deployment Record
description: Represents a single deployment event for a platform service, including version, target environment, deploying actor, and outcome.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
data_catalog_id: DC-OPS-002
classification: internal

owned_by_domain: Platform Operations
composes_data_aggregates:
  - Deployment Record Aggregate
realizes_business_information_object:

archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
---

Deployment Record captures the immutable history of all service deployments. Used for change management auditing, DORA metric calculation (deployment frequency, change failure rate, MTTR), and rollback decision support.
