# Security and Compliance Domain

## Vision

Security and Compliance is the trust layer of the Enterprise Platform. It provides the identity foundation, access governance, audit trail, and data privacy controls that allow customers in regulated industries to adopt the platform with confidence. The domain operates as a shared service across all other domains — every API call passes through IAM, every privileged action lands in the audit log — making security a structural property of the platform rather than a bolt-on.

## Team

| Role | Name | Contact |
|------|------|---------|
| Domain Architect | Sophie Laurent | #arch-security |
| Tech Lead | Raj Krishnamurthy | #team-security-eng |
| Product Owner | Nina Johansson | #product-compliance |

**Slack Channels:**
- `#arch-security` — Architecture discussions, threat modelling, ADRs
- `#team-security-eng` — Engineering team channel
- `#incidents-security` — Security incidents, IAM failures, certificate alerts

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| IAM Platform | Keycloak (self-hosted) | OIDC/SAML federation, SCIM provisioning, MFA enforcement |
| Policy Engine | Open Policy Agent (OPA) | RBAC + ABAC policy evaluation, embedded in service mesh |
| Secrets Management | HashiCorp Vault | Encryption keys, service credentials, certificate lifecycle |
| Audit Trail | Elasticsearch + Kafka | Immutable event stream, tamper-evident log storage |
| Privacy Management | Python + FastAPI | GDPR subject rights API, data erasure workflows |
| Monitoring | Datadog + Falco | Runtime security alerts, anomaly detection |

## Architecture Decisions

- **ADR-001: OPA for fine-grained authorization (Accepted)** — Authorization decisions are delegated to OPA running as a sidecar. Policies are authored in Rego, version-controlled alongside the registry, and evaluated in-process without network round-trips. This separates policy from application code and enables policy-as-code reviews in pull requests.
- **ADR-002: Kafka as the audit log backbone (Accepted)** — All audit events are published to a dedicated Kafka topic before any application response is returned. Downstream consumers index into Elasticsearch for search and archive to S3 (with object lock) for tamper-evident long-term retention. No audit record is ever mutated or deleted.
- **ADR-003: Vault for all secrets and certificates (Accepted)** — No service may read secrets from environment variables or config files in production. All credentials are fetched at runtime via Vault's Kubernetes auth method, with automatic rotation enforced by TTL policies. Certificate lifecycle is managed via Vault PKI to eliminate manual renewal toil.

## Roadmap

| Quarter | Item |
|---------|------|
| Q1 2026 | SOC 2 Type II evidence automation — continuous evidence collection mapped to controls |
| Q2 2026 | GDPR erasure SLA enforcement — automated right-to-erasure workflow with < 30-day SLA |
| Q3 2026 | Zero-trust service mesh — mTLS enforced between all internal services via Istio + OPA |
| Q4 2026 | ISO 27001 gap assessment and remediation — readiness for formal certification audit |

## Key Links

- **Confluence:** Security Architecture Space
- **Runbook:** IAM Incident Response and Certificate Rotation Runbook
- **API Docs:** IAM Platform at `/catalog/software_system--iam-platform`
- **Monitoring Dashboard:** Datadog - Security and Compliance Overview

## SLOs

| Metric | Target | Current |
|--------|--------|---------|
| IAM token validation p99 latency | < 50ms | 38ms |
| Audit event delivery lag | < 10s | 6.4s |
| Secrets rotation success rate | > 99.9% | 100% |
| Uptime | 99.99% | 99.99% |
