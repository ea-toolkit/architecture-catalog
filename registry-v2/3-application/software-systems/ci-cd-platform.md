---
type: software-system
name: CI CD Platform
description: GitHub Actions for CI combined with ArgoCD for GitOps-based continuous delivery and Flagger for automated canary deployments across all platform services.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
sourcing: hybrid
catalog_id: SYS-OPS-002
system_type: platform
vendor: GitHub + Argo Project

composes_software_subsystems:
  - argocd-controller
realizes_component: Deployment Pipeline

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

CI CD Platform standardizes the delivery process across all engineering teams. GitHub Actions pipelines run on GitHub-hosted runners for CI; ArgoCD ApplicationSets manage multi-cluster GitOps delivery. Flagger performs canary analysis using Prometheus metrics to gate progressive rollouts.
