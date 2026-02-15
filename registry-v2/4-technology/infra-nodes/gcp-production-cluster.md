---
type: infra_node
name: GCP Production Cluster
description: Google Kubernetes Engine cluster hosting NovaCRM production workloads
owner: Platform Engineering
domain: Customer Management
status: active
node_type: container-host
cloud_provider: GCP

# Relationships
serves_software_subsystems:
  - crm-api-gateway
  - billing-worker
  - analytics-pipeline
---

# GCP Production Cluster

Primary GKE (Google Kubernetes Engine) cluster running all NovaCRM production microservices in `us-central1`. Provides container orchestration, auto-scaling, and service mesh for the CRM API Gateway, Billing Worker, and Analytics Pipeline subsystems.

## Specifications

- **Region:** us-central1
- **Node pool:** 3–12 nodes (auto-scaling)
- **Machine type:** e2-standard-4
- **Kubernetes version:** 1.28+
