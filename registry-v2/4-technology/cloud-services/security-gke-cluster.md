---
type: cloud_service
name: Security GKE Cluster
description: Hardened Google Kubernetes Engine cluster hosting all Security and Compliance workloads, with strict network policies and node isolation.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_software_subsystems:
  - iam-api
  - policy-engine
  - audit-ingest-api
  - audit-query-api
  - privacy-rights-api
  - vault-api
served_by_infra_nodes:
  - Security Node Pool

archimate_type: system-software
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Security GKE Cluster is a hardened GKE cluster with binary authorization, Workload Identity enabled, and strict NetworkPolicy rules permitting only explicitly allowlisted service-to-service communication. Node pools use shielded VMs with Secure Boot and vTPM.
