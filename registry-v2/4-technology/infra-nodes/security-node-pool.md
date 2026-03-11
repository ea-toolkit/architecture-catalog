---
type: infra_node
name: Security Node Pool
description: Hardened GKE node pool for security-critical workloads, using shielded VMs with Secure Boot, vTPM, and node auto-provisioning disabled.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
node_type: container-host
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_cloud_services:
  - Security GKE Cluster
serves_software_subsystems: []
in_network_zone: Security Zone

archimate_type: node
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Security Node Pool uses n2-standard-4 shielded VMs with Secure Boot and vTPM enabled. Node auto-provisioning is disabled; all scaling events require manual approval via change management. Tainted with a dedicated security-workload taint to prevent co-scheduling of untrusted workloads.
