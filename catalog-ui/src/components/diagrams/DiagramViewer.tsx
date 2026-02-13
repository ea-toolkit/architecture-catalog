// catalog-ui/src/components/diagrams/DiagramViewer.tsx
// Router component that picks the right viewer based on format

import React from 'react';
import DrawioViewer from './DrawioViewer';
import PlantUMLViewer from './PlantUMLViewer';
import BPMNViewer from './BPMNViewer';

interface DiagramViewerProps {
  format: 'drawio' | 'plantuml' | 'bpmn';
  content: string;
  name: string;
}

export default function DiagramViewer({ format, content, name }: DiagramViewerProps) {
  switch (format) {
    case 'drawio':
      return <DrawioViewer xmlContent={content} name={name} />;
    case 'plantuml':
      return <PlantUMLViewer source={content} name={name} />;
    case 'bpmn':
      return <BPMNViewer xmlContent={content} name={name} />;
    default:
      return (
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#64748b',
          background: '#f8fafc',
          borderRadius: 10,
          border: '1px solid #e2e8f0',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 12px' }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div>Unsupported diagram format: {format}</div>
        </div>
      );
  }
}
