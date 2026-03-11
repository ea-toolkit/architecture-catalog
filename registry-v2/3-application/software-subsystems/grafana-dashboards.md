---
type: software-subsystem
name: Grafana Dashboards
description: Grafana instance providing unified dashboards for metrics, logs, and traces, with SLO views, service maps, and on-call alert management.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-002
environments:
  - production

parent_software_system: Monitoring Stack
composes_api_endpoints: []
composes_software_components: []
owns_data_aggregates: []
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Grafana Dashboards is a multi-organization Grafana instance. Engineering team dashboards use Prometheus and Loki data sources; Grafana OnCall provides the alert routing and escalation management interface. Dashboards are managed as code via Grafana Operator and stored in Git.
