---
type: cloud_service
name: Integration GKE Cluster
description: Dedicated Google Kubernetes Engine cluster hosting all Integration and Connectivity workloads, isolated from the core platform cluster.
owner: Platform Operations Team
domain: Integration and Connectivity
status: active
registered: false
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_software_subsystems:
  - gateway-proxy
  - developer-portal
  - webhook-delivery-worker
  - webhook-subscription-api
  - connector-runtime
  - sync-scheduler
served_by_infra_nodes:
  - Integration Node Pool

archimate_type: system-software
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Integration GKE Cluster is a separate GKE cluster providing workload isolation for integration services. Runs e2-standard-4 node pools with autoscaling enabled. Separated from the core cluster to limit blast radius of third-party connectivity failures.
