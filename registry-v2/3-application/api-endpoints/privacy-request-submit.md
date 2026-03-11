---
type: api_endpoint
name: Privacy Request Submit
description: REST endpoint for submitting GDPR and CCPA data subject rights requests (access, erasure, portability) and tracking their status.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-005
protocol: REST
auth_method: OAuth2

parent_software_subsystem: privacy-rights-api
implements_api_contract:
publishes_domain_events:
  - Data Erasure Completed
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

POST /privacy/requests accepts the request type (erasure, access, portability), subject identity, and verification token. The endpoint validates the subject's identity against the IdP before creating a Data Subject Request Aggregate and starting the orchestration workflow.
