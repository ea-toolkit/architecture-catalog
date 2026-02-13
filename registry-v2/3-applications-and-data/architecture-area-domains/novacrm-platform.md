---
type: architecture-area-domain
name: NovaCRM Platform
description: B2B SaaS platform for customer relationship management, covering tenant management, subscription billing, and contact analytics.
owner: Platform Team
status: active
domain: NovaCRM Platform
registered: false

composes_logical_components:
  - tenant-management
  - subscription-billing
  - contact-analytics

owns_data_concepts:
  - tenant-account
  - subscription-plan

archimate_type: application-function
ddd_type: Domain
togaf_type: ~
---

NovaCRM Platform is the enterprise architecture area covering all CRM capabilities. It encompasses tenant lifecycle management, subscription and billing automation, and customer analytics.
