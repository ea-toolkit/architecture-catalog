# Customer Management Domain

## Vision

Customer Management is the foundational domain of the Enterprise Platform. It provides the identity, access, and account management capabilities that all other domains depend on. Our goal is to make tenant onboarding frictionless while maintaining enterprise-grade security and compliance.

## Team

| Role | Name | Contact |
|------|------|---------|
| Domain Architect | Sarah Chen | #arch-customer-mgmt |
| Tech Lead | Marcus Rivera | #team-platform-core |
| Product Owner | Aisha Patel | #product-crm |

**Slack Channels:**
- `#arch-customer-mgmt` — Architecture discussions and ADRs
- `#team-platform-core` — Engineering team channel
- `#incidents-tenant` — Tenant-related incidents and escalations

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| API Gateway | Kong | Rate limiting, auth, routing |
| Backend | Node.js + TypeScript | Tenant Management, User Auth |
| Database | PostgreSQL 15 | Multi-tenant schema isolation |
| Cache | Redis | Session store, rate limit counters |
| Events | Apache Kafka | Domain events (CloudEvents format) |
| Monitoring | Datadog | APM, logs, custom metrics |

## Key Decisions

### ADR-001: Multi-tenant Database Strategy
**Status:** Accepted
**Decision:** Schema-per-tenant isolation using PostgreSQL schemas. Each tenant gets a dedicated schema within a shared database cluster.
**Rationale:** Balances isolation guarantees with operational simplicity. Full database-per-tenant was rejected due to connection pool overhead at scale.

### ADR-002: Event-Driven Integration
**Status:** Accepted
**Decision:** All cross-domain communication uses async domain events via Kafka. No synchronous inter-service calls between domains.
**Rationale:** Decouples domain lifecycles. Billing and Analytics subscribe to tenant events without runtime dependency on Customer Management.

### ADR-003: RBAC Model
**Status:** Proposed
**Decision:** Role-based access control with tenant-scoped roles. Roles are defined per tenant, not globally.

```yaml
roles:
  - name: tenant-admin
    permissions: [manage-users, manage-billing, view-analytics]
  - name: member
    permissions: [view-analytics]
  - name: viewer
    permissions: [view-analytics]
```

## Key Links

- **Confluence:** Platform Architecture Space
- **Runbook:** Tenant Onboarding Runbook
- **API Docs:** Tenant API Reference at `/catalog/api_endpoint--tenant-api`
- **Monitoring Dashboard:** Datadog - Customer Management Overview

## SLOs

| Metric | Target | Current |
|--------|--------|---------|
| Tenant API p99 latency | < 200ms | 145ms |
| Onboarding success rate | > 99.5% | 99.8% |
| Event delivery latency | < 500ms | 320ms |
| Uptime | 99.95% | 99.97% |
