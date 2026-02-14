---
type: business-process
name: Generate Analytics Report
owner: Analytics Team
status: active
domain: Analytics and Insights
specialization: E2E Process
value_stream: Customer Insights
process_modules: []
triggers_events:
  - Report Generated
---

## Overview

Generates scheduled or on-demand analytics reports from aggregated usage data, contact engagement metrics, and platform activity logs.

## Steps

1. Receive report request (scheduled trigger or user-initiated)
2. Query analytics warehouse for relevant metrics
3. Apply filters, grouping, and aggregation rules
4. Render report in requested format (PDF, CSV, dashboard)
5. Publish Report Generated event
6. Deliver report to requesting user or distribution list
