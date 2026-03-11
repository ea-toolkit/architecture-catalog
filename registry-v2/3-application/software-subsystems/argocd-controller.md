---
type: software-subsystem
name: ArgoCD Controller
description: ArgoCD application controller managing GitOps-based continuous delivery of all platform services to production and staging GKE clusters.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-003
environments:
  - production
  - staging

parent_software_system: CI CD Platform
composes_api_endpoints:
  - argocd-app-sync
composes_software_components: []
owns_data_aggregates:
  - Deployment Record Aggregate
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

ArgoCD Controller runs in the ops cluster and manages ApplicationSet resources that span all product GKE clusters. It continuously reconciles the desired state from Git with the actual cluster state. Drift is auto-remediated for production; staging drifts generate an alert but are not auto-remediated to allow testing.
