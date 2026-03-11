---
type: infra_node
name: Operations Node Pool
description: GKE node pool for Platform Operations workloads, using e2-standard-8 instances optimized for the memory requirements of Prometheus and Loki.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
node_type: container-host
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_cloud_services:
  - Operations GKE Cluster
serves_software_subsystems: []
in_network_zone: Operations Zone

archimate_type: node
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Operations Node Pool uses e2-standard-8 machines (8 vCPU, 32 GB RAM) to accommodate Prometheus's in-memory TSDB and Loki's chunk cache. Autoscaling from 3 to 12 nodes. PodDisruptionBudget ensures minimum availability of 2 nodes during rolling updates.
