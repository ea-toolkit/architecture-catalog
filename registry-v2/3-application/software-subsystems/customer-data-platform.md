---
type: software-subsystem
name: Customer Data Platform
description: Unified customer profile store that consolidates data from all touchpoints into a single 360-degree view per tenant.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - customer-data-api

archimate_type: application-component
---

Customer Data Platform (CDP) consolidates customer information from CRM interactions, support tickets, billing events, and product usage into a unified profile per contact. It powers segmentation, personalization, and reporting across the platform.
