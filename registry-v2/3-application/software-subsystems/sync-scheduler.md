---
type: software-subsystem
name: Sync Scheduler
description: Manages cron-based and event-triggered scheduling of data sync jobs, ensuring jobs run at configured intervals and handling overlap protection.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
catalog_id: SUB-INT-006
environments:
  - production
  - staging

parent_software_system: Integration Middleware
composes_api_endpoints:
  - sync-schedule-configure
composes_software_components: []
owns_data_aggregates:
  - Sync Job Aggregate
served_by_cloud_services:
  - Integration GKE Cluster

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Sync Scheduler maintains a distributed job registry with per-tenant sync schedules. It emits Temporal workflow start signals at the configured interval and enforces a mutex to prevent concurrent jobs for the same tenant-connector pair.
