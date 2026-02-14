---
# ─────────────────────────────────────────────────────────────
# Business Information Object
# Abstract meaning of a term in a specific business context.
# Can be represented by one or many synonymous terms.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: business-information-object
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
synonyms: []  # alternative terms for this concept

# ── Relationships (from EMM arrows) ──────────────────────────
# Assignment: capability that owns this (singular)
owned_by_capability: 

# Access: process tasks that access this (array)
accessed_by_process_tasks: []

# Realization: data concepts that realize this (array)
realized_by_data_concepts: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-object
---

<!-- Extended description, glossary, context disambiguation, etc. -->
