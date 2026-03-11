---
type: cloud_service
name: Integration Message Bus
description: Managed Apache Kafka cluster (Confluent Cloud) used as the event backbone for integration events and webhook delivery triggers.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
cloud_provider: GCP

realizes_infrastructure_functions: []
serves_application_infrastructure: []
serves_software_subsystems:
  - webhook-delivery-worker
served_by_infra_nodes: []

archimate_type: system-software
togaf_type: Physical Technology Component
emm_type: Physical TI Component
---

Integration Message Bus is a Confluent Cloud Kafka deployment in GCP us-central1. Hosts topics for platform domain events, dead-letter queues, and integration health telemetry. Retention configured at 7 days for standard topics.
