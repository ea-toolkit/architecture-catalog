# Integration and Connectivity Domain

## Vision

Integration and Connectivity is the platform's external-facing nervous system. It provides a reliable, observable connectivity layer that lets customers embed the Enterprise Platform into their existing tool ecosystem — whether through direct API access, event-driven webhooks, or pre-built connectors for common SaaS tools. The domain's goal is to make integration a first-class product capability, not an afterthought, so that customers spend time on their workflows rather than on plumbing.

## Team

| Role | Name | Contact |
|------|------|---------|
| Domain Architect | Carlos Mendez | #arch-integration |
| Tech Lead | Fatima Al-Rashid | #team-integration-eng |
| Product Owner | James Okafor | #product-platform |

**Slack Channels:**
- `#arch-integration` — Architecture discussions and ADRs
- `#team-integration-eng` — Engineering team channel
- `#incidents-webhooks` — Webhook delivery failures, dead-letter queue alerts

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| API Gateway | Kong (self-hosted) | Routing, rate limiting, auth enforcement, plugin ecosystem |
| Webhook Dispatcher | Go + gRPC | High-throughput event fan-out to customer endpoints |
| Integration Middleware | Node.js + TypeScript | Connector orchestration, data sync jobs |
| Queue | Apache Kafka | Reliable delivery backbone, dead-letter handling |
| Database | PostgreSQL 15 | Webhook subscriptions, connector configs, delivery logs |
| Monitoring | Datadog + Jaeger | Distributed tracing across connector pipelines |

## Architecture Decisions

- **ADR-001: Kong as API gateway (Accepted)** — Kong is deployed on-cluster and configured declaratively via deck. All authentication (JWT, API key, OAuth2) is handled at the gateway layer; downstream services trust the gateway-injected identity headers and perform no re-authentication.
- **ADR-002: At-least-once webhook delivery with idempotency guidance (Accepted)** — The Webhook Dispatcher guarantees at-least-once delivery with exponential back-off and a configurable dead-letter queue. Customers are expected to implement idempotency on their receiving endpoints; delivery UUIDs are included in every webhook envelope for deduplication.
- **ADR-003: Connector SDK over custom integrations (Proposed)** — New partner connectors will be built on a shared Connector SDK rather than bespoke implementations. This standardises authentication flows, error handling, and observability hooks, and enables the community connector model planned for Q3 2026.

## Roadmap

| Quarter | Item |
|---------|------|
| Q1 2026 | Webhook observability dashboard — delivery success rates, retry depth, dead-letter inspection UI |
| Q2 2026 | OAuth2 connector framework — standardised OAuth2 flow for all partner connectors |
| Q3 2026 | Community Connector SDK GA — documented SDK + marketplace for third-party connectors |
| Q4 2026 | GraphQL API layer — federated GraphQL gateway alongside REST for query flexibility |

## Key Links

- **Confluence:** Integration Platform Architecture Space
- **Runbook:** Webhook Dead-Letter Recovery Runbook
- **API Docs:** API Gateway Management at `/catalog/component--api-gateway-management`
- **Monitoring Dashboard:** Datadog - Integration Connectivity Overview

## SLOs

| Metric | Target | Current |
|--------|--------|---------|
| API gateway p99 latency | < 100ms overhead | 72ms |
| Webhook delivery success rate (72h window) | > 99% | 99.4% |
| Connector sync lag | < 5min | 3.1min |
| Uptime | 99.95% | 99.97% |
