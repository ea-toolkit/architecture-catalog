---
title: Event Flow Map
description: Visualize event publish/consume flows across your domain.
---

The event flow map shows how domain events flow between services — who publishes, who consumes, and the events in between.

<!-- VIDEO: #4 Event Flow Map — open event flow, show animated edges, hover nodes, export PNG (30s) -->

## How it works

The event flow map is driven by `models/event-mapping.yaml`, which bridges registry types to semantic event-flow roles:

```yaml
service_type: software_subsystem     # what acts as a "service"
event_type: domain_event             # what acts as an "event"
publishes_field: published_by_api_endpoints
consumes_field: consumed_by_api_endpoints
```

The loader follows these paths at build time:
1. Find all domain events in the domain
2. Follow `published_by_api_endpoints` to discover publishers
3. Follow `consumed_by_api_endpoints` to discover consumers
4. Auto-traverse intermediate hops (event -> API endpoint -> subsystem) via BFS

## Layout

The graph is arranged left-to-right in three columns:

```
Publishers  ->  Events  ->  Consumers
(services)      (domain      (services)
                 events)
```

Cross-domain services (consuming events from another domain) are visually marked.

## Visual features

| Feature | Description |
|---------|-------------|
| **Animated edges** | Flowing dots along publish/consume edges show data flow direction |
| **Color coding** | Blue edges for "publishes", green edges for "consumes" |
| **Edge labels** | Each edge shows "PUBLISHES" or "CONSUMES" in a styled badge |
| **Cross-domain flag** | Services from other domains get a special indicator |
| **PNG export** | Download the graph as an image |

## Legend

The bottom-right legend shows:
- Publish and consume edge styles
- Event node appearance
- Service node appearance

## Adding events

To populate the event flow map, create domain event Markdown files with publish/consume connections:

```yaml
---
type: domain-event
name: Order Placed
domain: Order Management
status: active
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - order-create-endpoint
consumed_by_api_endpoints:
  - billing-invoice-trigger
  - analytics-event-ingest
---
```

The more connections your events have, the richer the event flow visualization becomes. Cross-domain consumers make the graph particularly interesting.
