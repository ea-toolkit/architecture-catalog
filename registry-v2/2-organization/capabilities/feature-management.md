---
type: business-capability
name: Feature Management
description: The ability to control feature availability at runtime using flag-based configuration, supporting controlled rollouts, A/B testing, and emergency kill switches.
owner: Platform Operations Team
domain: Platform Operations
status: active
maturity: Good
lifecycle: active
sourcing: in-house
size: s
registered: false

composes_process_modules: []
owns_information_objects: []
realized_by_components:
  - Feature Flag Management

archimate_type: business-function
togaf_type: Business Capability
---

Feature Management decouples feature deployment from feature activation. Engineering teams use flags to gradually roll out features to a percentage of tenants, run A/B experiments, and instantly disable problematic features without a deployment.
