---
type: api_endpoint
name: SCIM Users Provision
description: SCIM 2.0 endpoint for automated user provisioning and deprovisioning from enterprise identity providers.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
api_catalog_id: EP-SEC-002
protocol: REST
auth_method: API-Key

parent_software_subsystem: iam-api
implements_api_contract:
publishes_domain_events: []
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

Implements SCIM 2.0 /Users and /Groups endpoints. Supports POST (create), PUT (update), PATCH (partial update), and DELETE (deprovision). Deprovisioning triggers a User Access Revoked domain event and cascading session revocation within 60 seconds.
