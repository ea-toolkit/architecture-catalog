# Enterprise Meta-Model Relationships Reference

> Reference document for element relationships used in the architecture catalog.

This document shows all element types and their relationships from the enterprise meta-model.
Format: **SOURCE** —[RELATIONSHIP TYPE]→ **TARGET**

---

## Layer 1: Products & Services

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Product | aggregates | Business Service | Composition (empty diamond) |
| Product | serving | Customer / Market Segment | Open arrow |

---

## Layer 2: Process & Organization

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Value Stream | aggregates | End to End Process | Composition (empty diamond) |
| End to End Process | aggregates | Business Process Module | Composition (empty diamond) |
| End to End Process | realizes | Business Service | Realization (dashed, hollow arrow) |
| Business Process Module | composed-of | Process Task | Composition (filled diamond) |
| Business Process Module | composed-of | Business Process Module | Composition (self-reference) |
| Business Capability | composed-of | Business Process Module | Composition (filled diamond) |
| Business Capability | owns | Business Information Object | Assignment (openAsync arrow) |
| Process Task | triggers | Business Event | Flow (solid arrow) |
| Business Event | triggers | Process Task | Flow (solid arrow) |
| Process Task | access | Business Information Object | Access (dashed, open arrow) |
| Organization Unit | owns | Value Stream | Assignment (openAsync arrow) |
| Organization Unit | owns | End to End Process | Assignment (openAsync arrow) |
| Organization Unit | composed-of | Actor | Composition (filled diamond) |
| Actor | acts-in-role-of | Business Role | Assignment (filled dot → arrow) |
| Business Role | performs | Process Task | Assignment (filled dot → arrow) |

---

## Layer 3: Application & Data

### Domain Structure

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Architecture Area/Domain | composed-of | Logical Component | Composition (filled diamond) |
| Architecture Area/Domain | owns | Data Concept | Assignment (openAsync arrow) |
| Logical Component | composed-of | Logical Component | Composition (self-reference) |

### Logical to Physical Realization

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Logical Component | realizes | Business Capability | Realization (dashed, hollow arrow) |
| Logical Component | realizes | Logical Business API | Realization (dashed, hollow arrow) |
| Logical Component | owns | Data Aggregate | Assignment (openAsync arrow) |
| Software System | realizes | Logical Component | Realization (dashed, hollow arrow) |
| Software Subsystem | owns | Data Aggregate | Assignment (openAsync arrow) |
| Physical Business API | realizes | Logical Business API | Assignment (filled dot → arrow) |
| Domain Event | realizes | Business Event | Realization (dashed, hollow arrow) |

### Data Hierarchy

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Data Concept | composed-of | Data Aggregate | Composition (filled diamond) |
| Data Aggregate | composed-of | Data Entity | Composition (filled diamond) |
| Data Concept | realizes | Business Information Object | Realization (dashed, hollow arrow) |

### Software Hierarchy

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Software System | composed-of | Software Subsystem | Composition (filled diamond) |
| Software Subsystem | composed-of | Software Component | Composition (filled diamond) |
| Software Subsystem | composed-of | Physical Business API | Composition (filled diamond) |
| Software Component | composed-of | Software Code | Composition (filled diamond) |

### Event Flow

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Physical Business API | publishes | Domain Event | Flow (solid arrow) |
| Physical Business API | consumes | Domain Event | Flow (solid arrow) |

---

## Layer 4: Infrastructure & Hosting

| Source | Relationship | Target | ArchiMate Symbol |
|--------|--------------|--------|------------------|
| Software Subsystem | served-by | Application Infrastructure | Serving (solid arrow) |
| Software Subsystem | served-by | Technology Infrastructure | Serving (solid arrow) |
| Software Subsystem | served-by | Infrastructure API | Serving (solid arrow) |
| Software Subsystem | served-by | Hosting Node | Serving (solid arrow) |
| Technology Infrastructure | served-by | Application Infrastructure | Serving (solid arrow) |
| Hosting Node | served-by | Technology Infrastructure | Serving (solid arrow) |
| Hosting Node | served-by | Application Infrastructure | Serving (solid arrow) |
| Application Infrastructure | realizes | Infrastructure Function | Realization (dashed, hollow arrow) |
| Technology Infrastructure | realizes | Infrastructure Function | Realization (dashed, hollow arrow) |
| Hosting Node | realizes | Infrastructure Function | Realization (dashed, hollow arrow) |
| Infrastructure Function | realizes | Infrastructure API | Realization (dashed, hollow arrow) |
| Networking Equipment | realizes | Infrastructure Function | Realization (dashed, hollow arrow) |
| Network Zone | aggregates | Networking Equipment | Aggregation (empty diamond) |
| Hosting Node | associated-with | Network Zone | Association (line) |

---

## Summary: Key Relationships for Domain Context Map

For the catalog-ui Domain Context Map, these are the relevant relationships:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│  Architecture Area/Domain                                                               │
│         │                                                                               │
│         ├──[composed-of]──► Logical Component ◄──[realizes]── Software System          │
│         │                         │                                │                    │
│         │                         ├──[realizes]──► Business Capability                  │
│         │                         │                       │                             │
│         │                         │               [composed-of]                         │
│         │                         │                       ▼                             │
│         │                         │               Business Process                      │
│         │                         │                                                     │
│         │                         ├──[realizes]──► Logical Business API                 │
│         │                         │                       ▲                             │
│         │                         │               [realizes]                            │
│         │                         │                       │                             │
│         │                         │               Physical Business API                 │
│         │                         │                       │                             │
│         │                         │               [publishes/consumes]                  │
│         │                         │                       ▼                             │
│         │                         │               Domain Event ──[realizes]──►          │
│         │                         │                              Business Event         │
│         │                         │                                                     │
│         │                         └──[owns]──► Data Aggregate                           │
│         │                                             ▲                                 │
│         │                                     [composed-of]                             │
│         │                                             │                                 │
│         └──[owns]──► Data Concept ──[composed-of]─────┘                                 │
│                            │                                                            │
│                    [realizes]                                                           │
│                            ▼                                                            │
│                 Business Information Object                                             │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Element Types (for Mock Data)

### Business Layer (Yellow)
- Customer / Market Segment
- Product
- Business Service
- Value Stream
- End to End Process
- Business Process Module
- Process Task
- Business Event
- Organization Unit
- Business Role
- Business Capability
- Business Information Object
- Actor

### Application & Data Layer (Cyan)
- Architecture Area/Domain (Gray - boundary)
- Logical Component
- Logical Business API
- Physical Business API
- Software System
- Software Subsystem
- Software Component
- Software Code
- Data Concept (Gray - boundary)
- Data Aggregate
- Data Entity
- Domain Event

### Infrastructure Layer (Green)
- Application Infrastructure
- Technology Infrastructure
- Hosting Node
- Infrastructure API
- Infrastructure Function
- Networking Equipment
- Network Zone

---

## Notes

1. **Composition (filled diamond)** = Parent contains children; children cannot exist without parent
2. **Aggregation (empty diamond)** = Parent groups children; children can exist independently  
3. **Realization (dashed arrow, hollow head)** = Concrete implements abstract
4. **Assignment (filled dot → arrow)** = Actor/Role assigned to behavior
5. **Access (dashed arrow, open head)** = Behavior reads/writes passive element
6. **Serving (solid arrow, open head)** = Element provides functionality to another
7. **Flow (solid arrow)** = Information/control flow between behaviors
8. **Association (line)** = Generic relationship
