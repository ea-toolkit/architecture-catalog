---
type: software-subsystem
name: Policy Engine
description: Open Policy Agent (OPA) sidecar deployment evaluating fine-grained RBAC and ABAC authorization policies for all platform API requests.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
catalog_id: SUB-SEC-002
environments:
  - production
  - staging

parent_software_system: IAM Platform
composes_api_endpoints: []
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Security GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Policy Engine runs OPA as a sidecar or dedicated service. Policies are written in Rego and cover tenant-level role assignments, resource-level permissions, and attribute conditions (e.g., "can only access contacts in own region"). Policy bundles are distributed via a dedicated OPA bundle server.
