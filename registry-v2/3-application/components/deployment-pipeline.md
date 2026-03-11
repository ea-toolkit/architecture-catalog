---
type: component
name: Deployment Pipeline
description: Manages CI/CD pipelines for all platform services, including build, test, security scan, artifact publishing, and progressive deployment to production.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: hybrid

parent_domain: Platform Operations
composes_components: []
owns_data_aggregates:
  - Deployment Record Aggregate
realizes_api_contracts:
  - Deployment Trigger API
realizes_business_capability: Continuous Delivery
realized_by_software_systems:
  - CI CD Platform

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Deployment Pipeline orchestrates the end-to-end software delivery process. GitHub Actions handles CI (build, unit tests, SAST, container scanning); ArgoCD manages GitOps-based continuous delivery to GKE clusters. Progressive delivery uses Flagger for automated canary analysis.
