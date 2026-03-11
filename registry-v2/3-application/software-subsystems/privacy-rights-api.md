---
type: software-subsystem
name: Privacy Rights API
description: REST API for submitting and tracking GDPR data subject requests (access, erasure, portability) and managing consent records.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-005
environments:
  - production
  - staging

parent_software_system: Privacy Management System
composes_api_endpoints:
  - privacy-request-submit
composes_software_components: []
owns_data_aggregates:
  - Data Subject Request Aggregate
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Privacy Rights API accepts data subject requests from customer-facing portals and B2B tenant admin interfaces. Requests are validated, assigned SLA deadlines, and dispatched as workflow tasks to downstream services. Status tracking and notifications are built into the workflow orchestration layer.
