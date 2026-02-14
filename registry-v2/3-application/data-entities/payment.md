---
type: data-entity
name: Payment
description: Records a payment transaction against an invoice, including amount, method, and settlement status.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
entity_type: child

parent_data_aggregate: Billing Aggregate

archimate_type: data-object
ddd_type: Entity
---

Payment captures the details of a single payment transaction including the payment method, amount, currency, processing timestamp, and settlement status. Payments are linked to invoices and may represent partial or full settlement.
