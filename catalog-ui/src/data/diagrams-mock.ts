// catalog-ui/src/data/diagrams-mock.ts
// Mock diagram metadata and inline content for demo purposes

export interface Diagram {
  id: string;
  name: string;
  domain: string;
  format: 'drawio' | 'plantuml' | 'bpmn';
  description: string;
  tags: string[];
  content: string; // Inline content for mock - in production would read from file
}

// ============================================
// PLANTUML DIAGRAMS (inline source)
// ============================================

const tenantOnboardingSequence = `@startuml
!theme plain
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

title Tenant Onboarding Sequence

actor "Sales Rep" as Sales
participant "CRM API\\nGateway" as GW #E8F4FD
participant "Tenant\\nManagement" as TM #E8F4FD
participant "Billing\\nWorker" as BW #E8F4FD
database "Tenant\\nDB" as DB #F5F5F5
queue "Event\\nBus" as EB #FFF3E0

Sales -> GW: POST /api/v1/tenants
activate GW
GW -> TM: Create Tenant
activate TM

TM -> DB: Insert tenant record
DB --> TM: tenant_id

TM -> TM: Provision default config
TM -> BW: Create trial subscription
activate BW
BW --> TM: subscription_id
deactivate BW

TM -> EB: Publish "Tenant Created"
activate EB
EB --> TM: ack
deactivate EB

TM --> GW: 201 Created {tenant_id}
deactivate TM
GW --> Sales: Tenant provisioned
deactivate GW

... Trial period (14 days) ...

EB -> BW: Consume "Tenant Created"
activate BW
BW -> BW: Schedule trial expiry check
BW --> EB: ack
deactivate BW

@enduml`;

const platformDataFlow = `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

title Platform Data Flow

package "Tenant Domain" {
  [Tenant Management] as TM
  [Tenant DB] as TDB
}

package "Billing Domain" {
  [Subscription Billing] as SB
  [Billing Worker] as BW
}

package "Analytics Domain" {
  [Contact Analytics] as CA
  [Analytics Pipeline] as AP
}

cloud "Events" {
  [Tenant Events] as TE
  [Billing Events] as BE
}

TM --> TDB : persist
TM --> TE : publish
TE --> SB : subscribe
SB --> BW : delegate
BW --> BE : publish
TE --> AP : subscribe
BE --> AP : subscribe
AP --> CA : enrich

@enduml`;

const analyticsQuerySequence = `@startuml
!theme plain
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Analytics Query Flow

participant "Dashboard\\nUI" as UI #E8F4FD
participant "Analytics\\nQuery API" as AQ #E8F4FD
participant "Analytics\\nPipeline" as AP #E8F4FD
database "Data\\nWarehouse" as DW #F5F5F5

UI -> AQ: GraphQL Query
activate AQ
AQ -> AP: Transform Query
activate AP
AP -> DW: Execute SQL
DW --> AP: Result Set
AP --> AQ: Formatted Data
deactivate AP
AQ --> UI: JSON Response
deactivate AQ

note over UI,DW: All queries are read-only against pre-aggregated datasets

@enduml`;

// ============================================
// BPMN DIAGRAMS (inline XML)
// ============================================

const subscriptionLifecycleBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="SubscriptionLifecycle" name="Subscription Lifecycle Process" isExecutable="true">
    <bpmn:startEvent id="Start" name="Tenant Selects Plan">
      <bpmn:outgoing>Flow1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task1" name="Validate Payment Method">
      <bpmn:incoming>Flow1</bpmn:incoming>
      <bpmn:outgoing>Flow2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task2" name="Calculate Charges">
      <bpmn:incoming>Flow2</bpmn:incoming>
      <bpmn:outgoing>Flow3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway1" name="Upgrade or New?">
      <bpmn:incoming>Flow3</bpmn:incoming>
      <bpmn:outgoing>Flow4a</bpmn:outgoing>
      <bpmn:outgoing>Flow4b</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Task3a" name="Prorate Existing Plan">
      <bpmn:incoming>Flow4a</bpmn:incoming>
      <bpmn:outgoing>Flow5a</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task3b" name="Create New Subscription">
      <bpmn:incoming>Flow4b</bpmn:incoming>
      <bpmn:outgoing>Flow5b</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway2">
      <bpmn:incoming>Flow5a</bpmn:incoming>
      <bpmn:incoming>Flow5b</bpmn:incoming>
      <bpmn:outgoing>Flow6</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Task4" name="Process Payment">
      <bpmn:incoming>Flow6</bpmn:incoming>
      <bpmn:outgoing>Flow7</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Task5" name="Activate Subscription">
      <bpmn:incoming>Flow7</bpmn:incoming>
      <bpmn:outgoing>Flow8</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="End" name="Subscription Active">
      <bpmn:incoming>Flow8</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow1" sourceRef="Start" targetRef="Task1"/>
    <bpmn:sequenceFlow id="Flow2" sourceRef="Task1" targetRef="Task2"/>
    <bpmn:sequenceFlow id="Flow3" sourceRef="Task2" targetRef="Gateway1"/>
    <bpmn:sequenceFlow id="Flow4a" name="Upgrade" sourceRef="Gateway1" targetRef="Task3a"/>
    <bpmn:sequenceFlow id="Flow4b" name="New" sourceRef="Gateway1" targetRef="Task3b"/>
    <bpmn:sequenceFlow id="Flow5a" sourceRef="Task3a" targetRef="Gateway2"/>
    <bpmn:sequenceFlow id="Flow5b" sourceRef="Task3b" targetRef="Gateway2"/>
    <bpmn:sequenceFlow id="Flow6" sourceRef="Gateway2" targetRef="Task4"/>
    <bpmn:sequenceFlow id="Flow7" sourceRef="Task4" targetRef="Task5"/>
    <bpmn:sequenceFlow id="Flow8" sourceRef="Task5" targetRef="End"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="SubscriptionLifecycle">
      <bpmndi:BPMNShape id="Start_di" bpmnElement="Start">
        <dc:Bounds x="152" y="192" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="125" y="235" width="90" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task1_di" bpmnElement="Task1">
        <dc:Bounds x="240" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task2_di" bpmnElement="Task2">
        <dc:Bounds x="390" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway1_di" bpmnElement="Gateway1" isMarkerVisible="true">
        <dc:Bounds x="545" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task3a_di" bpmnElement="Task3a">
        <dc:Bounds x="650" y="90" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task3b_di" bpmnElement="Task3b">
        <dc:Bounds x="650" y="250" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway2_di" bpmnElement="Gateway2" isMarkerVisible="true">
        <dc:Bounds x="805" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task4_di" bpmnElement="Task4">
        <dc:Bounds x="910" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task5_di" bpmnElement="Task5">
        <dc:Bounds x="1060" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_di" bpmnElement="End">
        <dc:Bounds x="1212" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow1_di" bpmnElement="Flow1">
        <di:waypoint x="188" y="210"/><di:waypoint x="240" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow2_di" bpmnElement="Flow2">
        <di:waypoint x="340" y="210"/><di:waypoint x="390" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow3_di" bpmnElement="Flow3">
        <di:waypoint x="490" y="210"/><di:waypoint x="545" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow4a_di" bpmnElement="Flow4a">
        <di:waypoint x="570" y="185"/><di:waypoint x="570" y="130"/><di:waypoint x="650" y="130"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow4b_di" bpmnElement="Flow4b">
        <di:waypoint x="570" y="235"/><di:waypoint x="570" y="290"/><di:waypoint x="650" y="290"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow5a_di" bpmnElement="Flow5a">
        <di:waypoint x="750" y="130"/><di:waypoint x="830" y="130"/><di:waypoint x="830" y="185"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow5b_di" bpmnElement="Flow5b">
        <di:waypoint x="750" y="290"/><di:waypoint x="830" y="290"/><di:waypoint x="830" y="235"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow6_di" bpmnElement="Flow6">
        <di:waypoint x="855" y="210"/><di:waypoint x="910" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow7_di" bpmnElement="Flow7">
        <di:waypoint x="1010" y="210"/><di:waypoint x="1060" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow8_di" bpmnElement="Flow8">
        <di:waypoint x="1160" y="210"/><di:waypoint x="1212" y="210"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// ============================================
// DRAW.IO DIAGRAMS (inline mxGraph XML)
// ============================================

const customerManagementContextDrawio = `<mxfile>
  <diagram name="Customer Management Context" id="cm-context">
    <mxGraphModel dx="1000" dy="600" grid="1" gridSize="10" guides="1">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Tenant Management" style="rounded=1;whiteSpace=wrap;fillColor=#dbeafe;strokeColor=#3b82f6;" vertex="1" parent="1">
          <mxGeometry x="80" y="60" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="Account Management" style="rounded=1;whiteSpace=wrap;fillColor=#dbeafe;strokeColor=#3b82f6;" vertex="1" parent="1">
          <mxGeometry x="320" y="60" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="User Access Control" style="rounded=1;whiteSpace=wrap;fillColor=#dbeafe;strokeColor=#3b82f6;" vertex="1" parent="1">
          <mxGeometry x="560" y="60" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Platform Core" style="rounded=1;whiteSpace=wrap;fillColor=#f0fdf4;strokeColor=#22c55e;" vertex="1" parent="1">
          <mxGeometry x="200" y="200" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="6" value="Tenant Aggregate" style="rounded=1;whiteSpace=wrap;fillColor=#fef3c7;strokeColor=#f59e0b;" vertex="1" parent="1">
          <mxGeometry x="80" y="340" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="7" value="Account Aggregate" style="rounded=1;whiteSpace=wrap;fillColor=#fef3c7;strokeColor=#f59e0b;" vertex="1" parent="1">
          <mxGeometry x="320" y="340" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="8" value="Tenant API" style="rounded=1;whiteSpace=wrap;fillColor=#ede9fe;strokeColor=#8b5cf6;" vertex="1" parent="1">
          <mxGeometry x="440" y="200" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e1" style="strokeColor=#3b82f6;strokeWidth=2;" edge="1" source="2" target="5" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" style="strokeColor=#3b82f6;strokeWidth=2;" edge="1" source="3" target="5" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" style="strokeColor=#3b82f6;strokeWidth=2;" edge="1" source="4" target="8" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e4" value="owns" style="strokeColor=#f59e0b;strokeWidth=2;dashed=1;" edge="1" source="2" target="6" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e5" value="owns" style="strokeColor=#f59e0b;strokeWidth=2;dashed=1;" edge="1" source="3" target="7" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e6" style="strokeColor=#8b5cf6;strokeWidth=2;" edge="1" source="5" target="8" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

// ============================================
// DIAGRAM REGISTRY
// ============================================

export const diagrams: Diagram[] = [
  // PlantUML diagrams
  {
    id: 'tenant-onboarding-sequence',
    name: 'Tenant Onboarding Sequence',
    domain: 'customer-management',
    format: 'plantuml',
    description: 'Sequence diagram showing the tenant onboarding flow from sales request to provisioning.',
    tags: ['sequence', 'tenant', 'onboarding', 'api'],
    content: tenantOnboardingSequence,
  },
  {
    id: 'platform-data-flow',
    name: 'Platform Data Flow',
    domain: 'customer-management',
    format: 'plantuml',
    description: 'Component diagram showing data flow between platform services and event bus.',
    tags: ['component', 'data-flow', 'events'],
    content: platformDataFlow,
  },
  {
    id: 'analytics-query-sequence',
    name: 'Analytics Query Flow',
    domain: 'customer-management',
    format: 'plantuml',
    description: 'Sequence diagram showing how analytics queries are processed through the pipeline.',
    tags: ['sequence', 'analytics', 'query', 'graphql'],
    content: analyticsQuerySequence,
  },

  // BPMN diagrams
  {
    id: 'subscription-lifecycle',
    name: 'Subscription Lifecycle Process',
    domain: 'customer-management',
    format: 'bpmn',
    description: 'BPMN diagram showing the subscription lifecycle from plan selection to activation.',
    tags: ['bpmn', 'process', 'subscription', 'billing'],
    content: subscriptionLifecycleBpmn,
  },

  // draw.io diagrams
  {
    id: 'customer-management-context',
    name: 'Customer Management Context',
    domain: 'customer-management',
    format: 'drawio',
    description: 'draw.io architecture context diagram showing logical components, systems, aggregates, and APIs in the Customer Management domain.',
    tags: ['context', 'architecture', 'customer-management', 'drawio'],
    content: customerManagementContextDrawio,
  },
];

// Helper to get diagram by ID
export function getDiagramById(id: string): Diagram | undefined {
  return diagrams.find(d => d.id === id);
}

// Helper to get diagrams by domain
export function getDiagramsByDomain(domainId: string): Diagram[] {
  return diagrams.filter(d => d.domain === domainId);
}

// Helper to get diagrams by format
export function getDiagramsByFormat(format: Diagram['format']): Diagram[] {
  return diagrams.filter(d => d.format === format);
}
