---
type: api_endpoint
name: ArgoCD App Sync
description: ArgoCD API endpoint for triggering application sync operations, querying sync status, and managing application rollbacks.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
api_catalog_id: EP-OPS-002
protocol: REST
auth_method: OAuth2

parent_software_subsystem: argocd-controller
implements_api_contract:
publishes_domain_events:
  - Deployment Completed
consumes_domain_events: []

archimate_type: application-interface
ddd_type: Application Service
togaf_type: Information System Service
---

POST /api/v1/applications/{name}/sync triggers a manual sync for a named ArgoCD application. GET /api/v1/applications/{name} returns full sync and health status. Used by CI pipelines to verify post-deployment health before marking a deployment as successful.
