---
type: software-system
name: Monitoring Stack
description: Grafana-based observability platform combining Prometheus metrics, Loki logs, and Tempo distributed traces with alerting via PagerDuty integration.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: hybrid
catalog_id: SYS-OPS-001
system_type: platform
vendor: Grafana Labs (OSS)

composes_software_subsystems:
  - prometheus-metrics
  - grafana-dashboards
realizes_component: Observability Platform

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Monitoring Stack is a self-hosted Grafana stack running in the ops cluster. Prometheus scrapes all GKE workloads via the Prometheus Operator. Loki uses a scalable distributed deployment backed by GCS. Grafana OnCall handles alert routing and PagerDuty escalations.
