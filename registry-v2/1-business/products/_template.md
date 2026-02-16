---
# ─────────────────────────────────────────────────────────────
# Product
# A physical or digital product that can be acquired by a customer.
# The "end goal" that the customer wants to reach.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: product
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
product_type: physical  # physical | digital | hybrid

# ── Relationships (from EMM arrows) ──────────────────────────
# Serving: segments this product serves (array)
serves_market_segments: []

# Aggregation: business services this product aggregates (array)
aggregates_business_services: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: product
togaf_type: Product
software_boundaries: Digital Product Solution
---

<!-- Extended description, variants, pricing, lifecycle, etc. -->
