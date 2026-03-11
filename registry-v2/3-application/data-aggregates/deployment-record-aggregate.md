---
type: data-aggregate
name: Deployment Record Aggregate
description: Consistency boundary for a service deployment, tracking version, target cluster, deployment steps, health check outcomes, and final result.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
lifecycle_states:
  - pending
  - deploying
  - canary
  - promoted
  - rolled-back
  - failed

parent_data_concept: Deployment Record
owned_by_component: Deployment Pipeline
owned_by_software_subsystem: argocd-controller
composes_data_entities:
  - Deployment Step
  - Canary Analysis

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Deployment Record Aggregate captures the full rollout lifecycle. During the canary phase, Flagger metrics are attached as Canary Analysis entities; if the analysis fails, the aggregate transitions to rolled-back and ArgoCD reverts the deployment automatically.
