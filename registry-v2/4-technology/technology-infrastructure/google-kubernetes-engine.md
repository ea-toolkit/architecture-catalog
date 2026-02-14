---
type: technology_infrastructure
name: Google Kubernetes Engine
description: Managed Kubernetes service providing container orchestration for NovaCRM
owner: Platform Engineering
domain: Customer Management
status: active
cloud_provider: GCP

# Relationships
serves_software_subsystems:
  - crm-api-gateway
  - billing-worker
  - analytics-pipeline
served_by_hosting_nodes:
  - GCP Production Cluster
---

# Google Kubernetes Engine

Google Kubernetes Engine (GKE) is the managed Kubernetes platform underpinning NovaCRM's container infrastructure. It provides automated cluster provisioning, node auto-repair, and integrated monitoring via Google Cloud Operations.

## Key Capabilities

- **Managed control plane** with automatic upgrades
- **Workload Identity** for secure service-to-service auth
- **Cloud Load Balancing** integration for ingress
- **Container-native logging** via Cloud Logging
