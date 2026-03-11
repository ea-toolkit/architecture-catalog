# Billing and Payments Domain

## Vision

Billing and Payments is the revenue backbone of the Enterprise Platform. It manages the full subscription lifecycle — from plan selection and recurring invoicing through payment processing and revenue reconciliation — with a focus on accuracy, auditability, and zero revenue leakage. The domain is designed to support usage-based pricing models alongside fixed-tier subscriptions, enabling Product and Finance to experiment with pricing without engineering changes.

## Team

| Role | Name | Contact |
|------|------|---------|
| Domain Architect | Priya Menon | #arch-billing |
| Tech Lead | Daniel Osei | #team-billing-eng |
| Product Owner | Lena Hartmann | #product-billing |

**Slack Channels:**
- `#arch-billing` — Architecture discussions and ADRs
- `#team-billing-eng` — Engineering team channel
- `#incidents-billing` — Billing failures, payment retries, and reconciliation alerts

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Billing Engine | Stripe Billing (via SDK) | Subscription plan lifecycle, invoice generation |
| Backend | Python + FastAPI | Billing Worker, reconciliation jobs |
| Database | PostgreSQL 15 | Invoice ledger, usage records, credit notes |
| Queue | RabbitMQ | Payment retry queues, webhook fanout |
| Events | Apache Kafka | Domain events (InvoiceIssued, PaymentReceived) |
| Monitoring | Datadog | Revenue dashboards, failed payment alerts |

## Architecture Decisions

- **ADR-001: Stripe as billing primitives layer (Accepted)** — Stripe manages plan objects and raw charge execution. The in-house Billing Engine owns business logic (usage aggregation, credit application, proration) and treats Stripe as a payment rail, avoiding vendor lock-in at the product level.
- **ADR-002: Idempotent invoice generation (Accepted)** — All invoice creation requests carry an idempotency key derived from billing period + tenant ID. This prevents duplicate charges during Kafka consumer retries and payment gateway timeouts.
- **ADR-003: Event-sourced usage ledger (Proposed)** — Usage records will be stored as immutable append-only events rather than mutable counters, enabling point-in-time billing reconstruction for dispute resolution and audit trails.

## Roadmap

| Quarter | Item |
|---------|------|
| Q1 2026 | Usage-based billing GA — threshold alerts, overage invoices, consumption dashboards |
| Q2 2026 | Multi-currency support — invoice in tenant's local currency, FX rate snapshotting |
| Q3 2026 | Self-serve plan upgrades/downgrades — prorated credits applied automatically |
| Q4 2026 | Revenue recognition reporting — ASC 606 compliant export for Finance and ERP integration |

## Key Links

- **Confluence:** Billing Architecture Space
- **Runbook:** Invoice Generation and Payment Retry Runbook
- **API Docs:** Subscription API at `/catalog/api_endpoint--subscription-api`
- **Monitoring Dashboard:** Datadog - Billing Revenue Overview

## SLOs

| Metric | Target | Current |
|--------|--------|---------|
| Invoice generation latency p99 | < 5s | 3.2s |
| Payment processing success rate | > 98.5% | 98.9% |
| Reconciliation job completion | < 30min daily | 22min |
| Uptime | 99.9% | 99.95% |
