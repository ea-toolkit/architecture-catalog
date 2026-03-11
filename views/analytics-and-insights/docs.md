# Analytics and Insights Domain

## Vision

Analytics and Insights transforms raw platform activity into actionable business intelligence for both internal teams and end customers. By aggregating contact interactions, usage signals, and engagement patterns across all platform domains, this domain provides the reporting layer that helps customers understand their CRM health and helps the business make data-driven decisions on product direction, churn risk, and capacity planning.

## Team

| Role | Name | Contact |
|------|------|---------|
| Domain Architect | Yuki Tanaka | #arch-analytics |
| Tech Lead | Amara Diallo | #team-data-eng |
| Product Owner | Tobias Weber | #product-analytics |

**Slack Channels:**
- `#arch-analytics` — Architecture discussions and ADRs
- `#team-data-eng` — Data engineering team channel
- `#incidents-analytics` — Pipeline failures, stale reports, SLO breaches

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Data Warehouse | Snowflake | Primary analytics store, tenant-partitioned schemas |
| Ingestion Pipeline | Apache Kafka + dbt | Event consumption and transformation layer |
| Query API | Python + FastAPI | Analytics Query Service, tenant-scoped API |
| Orchestration | Apache Airflow | Scheduled aggregation jobs, report generation |
| Visualization | Metabase (embedded) | In-product dashboards, tenant-facing charts |
| Monitoring | Datadog + Monte Carlo | Pipeline health, data quality alerts |

## Architecture Decisions

- **ADR-001: Snowflake as single analytics store (Accepted)** — All domain events are funneled into Snowflake via Kafka consumers. A single warehouse avoids cross-store query federation and simplifies data access control with row-level security scoped by tenant ID.
- **ADR-002: dbt for all transformations (Accepted)** — No ad-hoc SQL transforms in application code. All business logic for aggregations, metrics definitions, and KPI calculations is expressed as dbt models, version-controlled alongside the registry.
- **ADR-003: Read-only analytics API (Accepted)** — The Analytics Query Service exposes only read operations. No analytics endpoint may mutate platform state; writes go through owning domain APIs to preserve event sourcing integrity.

## Roadmap

| Quarter | Item |
|---------|------|
| Q1 2026 | Real-time usage threshold alerts — push notifications when quota thresholds are crossed |
| Q2 2026 | Predictive churn scoring — ML model trained on engagement drop-off patterns |
| Q3 2026 | Tenant-facing analytics dashboard — embedded Metabase reports in the product UI |
| Q4 2026 | Cross-tenant benchmarking — anonymised aggregate comparisons (opt-in) for customer success |

## Key Links

- **Confluence:** Analytics Platform Architecture Space
- **Runbook:** Pipeline Recovery and Data Backfill Runbook
- **API Docs:** Analytics Query Service at `/catalog/software_subsystem--analytics-query-service`
- **Monitoring Dashboard:** Datadog - Analytics Pipeline Health

## SLOs

| Metric | Target | Current |
|--------|--------|---------|
| Report refresh latency | < 15min | 11min |
| Pipeline job success rate | > 99% | 99.3% |
| Query API p95 latency | < 800ms | 610ms |
| Uptime | 99.9% | 99.92% |
