---
type: software-system
name: Privacy Management System
description: Orchestrates data subject rights workflows (access, erasure, portability) and enforces data retention policies across all platform data stores.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
sourcing: in-house
catalog_id: SYS-SEC-003
system_type: microservice

composes_software_subsystems:
  - privacy-rights-api
realizes_component: Data Privacy Controls

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Privacy Management System manages the full lifecycle of data subject requests. On receipt of an erasure request, it fans out deletion tasks to each owning service (Customer Data Platform, Billing Engine, Analytics Warehouse) and tracks completion status within the legally required response window.
