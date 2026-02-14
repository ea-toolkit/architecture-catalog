---
type: business-process
name: Offboard Tenant
owner: Platform Team
status: active
domain: Customer Management
specialization: E2E Process
value_stream: Customer Lifecycle

process_modules: []
triggers_events:
  - Tenant Deactivated
---

## Overview

Offboard Tenant manages the controlled decommissioning of a tenant workspace when a customer churns or downgrades. It ensures data retention policies are respected, active sessions are terminated, and billing is finalized.

## Steps

1. Receive cancellation request or contract expiry notification
2. Initiate grace period and notify tenant administrators
3. Export tenant data per retention policy
4. Revoke all user access and API keys
5. Archive tenant workspace and emit Tenant Deactivated event
6. Finalize billing and close account
