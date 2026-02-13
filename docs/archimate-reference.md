# ArchiMate Reference

Mapping between ArchiMate 3.2 elements, registry folders, and draw.io shapes.

## Strategy Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Capability | `registry/strategy/capabilities/` | `mxgraph.archimate3.capability` |
| Resource | `registry/strategy/resources/` | `mxgraph.archimate3.resource` |
| Course of Action | `registry/strategy/courses-of-action/` | `mxgraph.archimate3.courseOfAction` |
| Value Stream | `registry/strategy/value-streams/` | `mxgraph.archimate3.valueStream` |

## Motivation Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Stakeholder | `registry/motivation/stakeholders/` | `mxgraph.archimate3.stakeholder` |
| Driver | `registry/motivation/drivers/` | `mxgraph.archimate3.driver` |
| Assessment | `registry/motivation/assessments/` | `mxgraph.archimate3.assessment` |
| Goal | `registry/motivation/goals/` | `mxgraph.archimate3.goal` |
| Outcome | `registry/motivation/outcomes/` | `mxgraph.archimate3.outcome` |
| Principle | `registry/motivation/principles/` | `mxgraph.archimate3.principle` |
| Requirement | `registry/motivation/requirements/` | `mxgraph.archimate3.requirement` |
| Constraint | `registry/motivation/constraints/` | `mxgraph.archimate3.constraint` |
| Meaning | `registry/motivation/meanings/` | `mxgraph.archimate3.meaning` |
| Value | `registry/motivation/values/` | `mxgraph.archimate3.value` |

## Business Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Business Actor | `registry/business/actors/` | `mxgraph.archimate3.business` (busType=actor) |
| Business Role | `registry/business/roles/` | `mxgraph.archimate3.business` (busType=role) |
| Business Collaboration | `registry/business/collaborations/` | `mxgraph.archimate3.business` (busType=collaboration) |
| Business Interface | `registry/business/interfaces/` | `mxgraph.archimate3.business` (busType=interface) |
| Business Process | `registry/business/processes/` | `mxgraph.archimate3.business` (busType=process) |
| Business Function | `registry/business/functions/` | `mxgraph.archimate3.business` (busType=function) |
| Business Interaction | `registry/business/interactions/` | `mxgraph.archimate3.business` (busType=interaction) |
| Business Service | `registry/business/services/` | `mxgraph.archimate3.business` (busType=service) |
| Business Event | `registry/business/events/` | `mxgraph.archimate3.business` (busType=event) |
| Business Object | `registry/business/objects/` | `mxgraph.archimate3.business` (busType=object) |
| Contract | `registry/business/contracts/` | `mxgraph.archimate3.business` (busType=contract) |
| Representation | `registry/business/representations/` | `mxgraph.archimate3.business` (busType=representation) |
| Product | `registry/business/products/` | `mxgraph.archimate3.business` (busType=product) |

## Application Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Application Component | `registry/application/components/` | `mxgraph.archimate3.application` (appType=comp) |
| Application Service | `registry/application/services/` | `mxgraph.archimate3.application` (appType=service) |
| Application Interface | `registry/application/interfaces/` | `mxgraph.archimate3.application` (appType=interface) |
| Application Function | `registry/application/functions/` | `mxgraph.archimate3.application` (appType=function) |
| Application Interaction | `registry/application/interactions/` | `mxgraph.archimate3.application` (appType=interaction) |
| Application Collaboration | `registry/application/collaborations/` | `mxgraph.archimate3.application` (appType=collaboration) |
| Application Event | `registry/application/events/` | `mxgraph.archimate3.application` (appType=event) |
| Data Object | `registry/application/data-objects/` | `mxgraph.archimate3.application` (appType=dataObject) |

## Technology Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Node | `registry/technology/nodes/` | `mxgraph.archimate3.tech` (techType=node) |
| Device | `registry/technology/devices/` | `mxgraph.archimate3.tech` (techType=device) |
| System Software | `registry/technology/system-software/` | `mxgraph.archimate3.tech` (techType=systemSoftware) |
| Technology Interface | `registry/technology/interfaces/` | `mxgraph.archimate3.tech` (techType=interface) |
| Technology Service | `registry/technology/services/` | `mxgraph.archimate3.tech` (techType=service) |
| Technology Function | `registry/technology/functions/` | `mxgraph.archimate3.tech` (techType=function) |
| Technology Process | `registry/technology/processes/` | `mxgraph.archimate3.tech` (techType=process) |
| Technology Interaction | `registry/technology/interactions/` | `mxgraph.archimate3.tech` (techType=interaction) |
| Technology Collaboration | `registry/technology/collaborations/` | `mxgraph.archimate3.tech` (techType=collaboration) |
| Path | `registry/technology/paths/` | `mxgraph.archimate3.tech` (techType=path) |
| Communication Network | `registry/technology/communication-networks/` | `mxgraph.archimate3.tech` (techType=communicationNetwork) |
| Artifact | `registry/technology/artifacts/` | `mxgraph.archimate3.tech` (techType=artifact) |

## Physical Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Equipment | `registry/physical/equipment/` | `mxgraph.archimate3.equipment` |
| Facility | `registry/physical/facilities/` | `mxgraph.archimate3.facility` |
| Distribution Network | `registry/physical/distribution-networks/` | `mxgraph.archimate3.distributionNetwork` |
| Material | `registry/physical/materials/` | `mxgraph.archimate3.material` |

## Implementation & Migration Layer

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Work Package | `registry/implementation/work-packages/` | `mxgraph.archimate3.workPackage` |
| Deliverable | `registry/implementation/deliverables/` | `mxgraph.archimate3.deliverable` |
| Plateau | `registry/implementation/plateaus/` | `mxgraph.archimate3.plateau` |
| Gap | `registry/implementation/gaps/` | `mxgraph.archimate3.gap` |

## Composite Elements

| Element Type | Registry Folder | draw.io Shape |
|---|---|---|
| Location | `registry/composite/locations/` | `mxgraph.archimate3.location` |
| Grouping | `registry/composite/groupings/` | `mxgraph.archimate3.grouping` |

## How draw.io shapes work

draw.io uses two patterns for ArchiMate shapes:

1. **Layer-level shapes**: The `shape` attribute contains the layer name, and a sub-type attribute specifies the element type:
   ```
   shape=mxgraph.archimate3.application;appType=comp
   shape=mxgraph.archimate3.business;busType=process
   shape=mxgraph.archimate3.tech;techType=node
   ```

2. **Individual shapes**: The `shape` attribute directly names the element type:
   ```
   shape=mxgraph.archimate3.workPackage
   shape=mxgraph.archimate3.capability
   shape=mxgraph.archimate3.stakeholder
   ```

The validator currently matches on the `shape` attribute to determine the ArchiMate layer. It validates element names against the registry but does not yet validate sub-types (e.g., it does not check that an element in `components/` uses `appType=comp`).
