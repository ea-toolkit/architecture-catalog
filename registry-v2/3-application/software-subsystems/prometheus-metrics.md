---
type: software-subsystem
name: Prometheus Metrics
description: Prometheus and Alertmanager deployment scraping all platform services, evaluating alerting rules, and routing alerts to PagerDuty and Slack.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
catalog_id: SUB-OPS-001
environments:
  - production
  - staging

parent_software_system: Monitoring Stack
composes_api_endpoints:
  - metrics-query-endpoint
composes_software_components: []
owns_data_aggregates:
  - Service Health Metric Aggregate
served_by_cloud_services:
  - Operations GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Prometheus Metrics runs two Prometheus replicas (HA pair) with the Prometheus Operator managing ServiceMonitors. Alertmanager deduplicates and groups alerts before routing to PagerDuty (critical) and Slack (warning). Metrics retention is 15 days in-cluster; longer retention is handled by Thanos sidecar to GCS.
