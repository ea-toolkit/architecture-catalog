---
type: business-process
name: Manage User Access
owner: Platform Team
status: active
domain: Customer Management
specialization: E2E Process
value_stream: Customer Lifecycle

process_modules: []
triggers_events:
  - User Invited
  - User Role Changed
---

## Overview

Manage User Access handles the full lifecycle of user accounts within a tenant: invitation, role assignment, permission changes, and deactivation. It ensures that access control policies are enforced consistently.

## Steps

1. Tenant admin initiates user invitation
2. System sends invitation email with secure link
3. User accepts invitation and completes profile setup
4. Assign role and permissions based on admin selection
5. Emit User Invited event for downstream processing
6. Handle ongoing role changes, suspensions, and removals
