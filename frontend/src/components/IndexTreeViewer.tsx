'use client';

import { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { IndexStructureResponse } from '@/lib/api';

interface IndexTreeViewerProps {
  structure: IndexStructureResponse;
}

function buildNodesAndEdges(
  node: IndexStructureResponse['root'],
  parentId: string | null = null,
  nodes: Node[] = [],
  edges: Edge[] = [],
  x: number = 0,
  y: number = 0,
  level: number = 0
): { nodes: Node[]; edges: Edge[] } {
  const nodeId = node.id || `node-${nodes.length}`;
  
  // Colores según el nivel
  const colors = [
    { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: '#6366f1' }, // Root
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #10b981 100%)', border: '#8b5cf6' }, // Level 1
    { bg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', border: '#10b981' }, // Level 2
    { bg: '#334155', border: '#475569' }, // Level 3+
  ];
  
  const colorScheme = colors[Math.min(level, colors.length - 1)];
  
  const newNode: Node = {
    id: nodeId,
    data: { label: node.label },
    position: { x, y },
    style: {
      background: colorScheme.bg,
      color: '#fff',
      border: `2px solid ${colorScheme.border}`,
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '120px',
      fontWeight: level === 0 ? 'bold' : 'semibold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    },
  };

  nodes.push(newNode);

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
      },
      animated: true,
    });
  }

  const childCount = node.children.length;
  const spacing = 200;
  const startX = x - ((childCount - 1) * spacing) / 2;

  node.children.forEach((child, index) => {
    const childX = startX + index * spacing;
    const childY = y + 150;
    buildNodesAndEdges(child, nodeId, nodes, edges, childX, childY, level + 1);
  });

  return { nodes, edges };
}

export function IndexTreeViewer({ structure }: IndexTreeViewerProps) {
  const { nodes, edges } = useMemo(() => {
    if (!structure.root) {
      return { nodes: [], edges: [] };
    }
    return buildNodesAndEdges(structure.root);
  }, [structure]);

  if (nodes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <div className="text-6xl mb-4">🌳</div>
        <p>No hay estructura para visualizar</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '600px' }} className="rounded-xl overflow-hidden border border-white/10">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
        className="bg-dark-bg"
      >
        <Background 
          color="#334155" 
          gap={16}
          size={1}
        />
        <Controls 
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
        <MiniMap 
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          nodeColor="#6366f1"
        />
      </ReactFlow>
    </div>
  );
}

