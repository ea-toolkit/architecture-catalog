---
type: cloud_service
name: Operations GKE Cluster
description: Dedicated Google Kubernetes Engine cluster hosting Platform Operations workloads including monitoring stack, ArgoCD, feature flag service, and config service.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_software_subsystems:
  - prometheus-metrics
  - grafana-dashboards
  - argocd-controller
  - flag-evaluation-api
  - flag-admin-api
  - config-api
served_by_infra_nodes:
  - Operations Node Pool

archimate_type: system-software
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Operations GKE Cluster is a regional GKE cluster (us-central1) hosting all operational tooling. Workload Pools are separated between observability (high memory), delivery (moderate), and config/flag services (low). The cluster is excluded from ArgoCD's own management scope to prevent self-referential reconciliation loops.
