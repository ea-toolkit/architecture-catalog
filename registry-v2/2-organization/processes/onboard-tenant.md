---
type: business-process
name: Onboard Tenant
owner: Platform Team
status: active
domain: Customer Management
specialization: E2E Process
value_stream: Customer Acquisition
process_modules: []
triggers_events:
  - Tenant Created
---

# Onboard Tenant

End-to-end process for provisioning a new B2B customer on the NovaCRM platform.

## Steps

1. Sales team initiates tenant creation request
2. System validates organization details and domain
3. Tenant account is provisioned with default configuration
4. Admin user seat is created with initial credentials
5. Welcome email sent with onboarding guide
6. Tenant Created event is published

## Process Modules

- Validate Organization
- Provision Tenant
- Create Admin User
- Send Welcome Communication
