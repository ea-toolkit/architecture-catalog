---
type: business-process
name: Handle Support Ticket
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

Handle Support Ticket covers the intake, triage, resolution, and closure of customer support requests. It integrates with tenant context to provide agents with account-specific information during resolution.

## Steps

1. Customer submits support ticket via portal or email
2. System classifies ticket priority and routes to appropriate queue
3. Support agent reviews tenant context and issue details
4. Agent investigates, resolves, or escalates the issue
5. Resolution is communicated to the customer
6. Ticket is closed and satisfaction survey is triggered
