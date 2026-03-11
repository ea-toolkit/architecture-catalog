---
type: infra_node
name: Integration Node Pool
description: GKE node pool dedicated to integration workloads, using e2-standard-4 instances with node auto-provisioning and horizontal pod autoscaling.
owner: Platform Operations Team
domain: Integration and Connectivity
status: active
registered: false
node_type: container-host
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_cloud_services:
  - Integration GKE Cluster
serves_software_subsystems: []
in_network_zone: Integration Zone

archimate_type: node
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Integration Node Pool hosts the compute capacity for the Integration GKE Cluster. e2-standard-4 machines (4 vCPU, 16 GB RAM) with autoscaling from 2 to 20 nodes. Tainted to prevent non-integration workloads from scheduling onto this pool.
