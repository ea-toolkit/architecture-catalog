---
type: architecture-area-domain
name: Customer Management
description: B2B SaaS platform for customer relationship management, covering tenant management, account administration, and user access control.
owner: Platform Team
status: active
domain: Customer Management
registered: false

composes_logical_components:
  - tenant-management
  - account-management
  - user-access-control

owns_data_concepts:
  - tenant-account
  - customer-profile

archimate_type: application-function
ddd_type: Domain
togaf_type: ~
---

Customer Management is the enterprise architecture domain covering all CRM and account management capabilities. It encompasses tenant lifecycle management, contact management, user access control, and account administration.
