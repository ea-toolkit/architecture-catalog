---
type: business-process
name: Manage Subscription
owner: Billing Team
status: active
domain: NovaCRM Platform
specialization: E2E Process
value_stream: Revenue Management
process_modules: []
triggers_events:
  - Subscription Renewed
  - Usage Threshold Exceeded
---

# Manage Subscription

End-to-end process for managing the subscription lifecycle of a tenant.

## Steps

1. Tenant selects or changes subscription plan
2. System calculates prorated charges
3. Payment method is validated
4. Subscription is activated or updated
5. Recurring billing schedule is configured
6. Usage monitoring is initialized

## Process Modules

- Select Plan
- Calculate Charges
- Process Payment
- Activate Subscription
- Monitor Usage
