'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { IndexStructureResponse } from '@/lib/api';

interface IndexTreeViewerProps {
  structure: IndexStructureResponse;
}

interface NodeLayout {
  id: string;
  x: number;
  y: number;
  node: IndexStructureResponse['root'];
}

// Constantes para el layout
const NODE_WIDTH = 150;
const LEVEL_HEIGHT = 200;
const SIBLING_SPACING = 120; // Espaciado horizontal entre nodos hermanos
const MIN_SUBTREE_WIDTH = NODE_WIDTH; // Ancho mínimo de un subárbol

// Calcular el ancho necesario para un subárbol
function getSubtreeWidth(node: IndexStructureResponse['root']): number {
  if (node.children.length === 0) {
    return MIN_SUBTREE_WIDTH;
  }
  
  let totalWidth = 0;
  for (const child of node.children) {
    totalWidth += getSubtreeWidth(child);
  }
  
  // Agregar espaciado entre hijos
  if (node.children.length > 1) {
    totalWidth += (node.children.length - 1) * SIBLING_SPACING;
  }
  
  return Math.max(MIN_SUBTREE_WIDTH, totalWidth);
}

// Algoritmo de posicionamiento jerárquico mejorado
function layoutTree(
  node: IndexStructureResponse['root'],
  x: number,
  y: number,
  level: number = 0
): NodeLayout[] {
  const layouts: NodeLayout[] = [];
  const nodeId = node.id || (level === 0 ? 'root' : `node-${level}-${Math.random()}`);
  
  let nodeX = x;
  
  if (node.children.length > 0) {
    // Calcular el ancho de cada subárbol hijo
    const childWidths = node.children.map(child => getSubtreeWidth(child));
    const totalChildrenWidth = childWidths.reduce((sum, w) => sum + w, 0) + 
                               (node.children.length - 1) * SIBLING_SPACING;
    
    // Posicionar el nodo actual centrado sobre sus hijos
    nodeX = x + totalChildrenWidth / 2 - NODE_WIDTH / 2;
    
    // Posicionar cada hijo recursivamente
    let currentX = x;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childWidth = childWidths[i];
      
      // Calcular la posición X del hijo (centrado en su subárbol)
      const childSubtreeX = currentX;
      const childLayouts = layoutTree(
        child,
        childSubtreeX,
        y + LEVEL_HEIGHT,
        level + 1
      );
      
      layouts.push(...childLayouts);
      
      // Mover la posición X para el siguiente hijo
      currentX += childWidth + SIBLING_SPACING;
    }
  }
  
  // Agregar el nodo actual al inicio para mantener orden jerárquico
  layouts.unshift({
    id: nodeId,
    x: nodeX,
    y,
    node,
  });
  
  return layouts;
}

function buildNodesAndEdges(
  structure: IndexStructureResponse['root']
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Calcular el ancho total del árbol
  const treeWidth = getSubtreeWidth(structure);
  
  // Centrar el árbol comenzando desde la izquierda
  const startX = -treeWidth / 2;
  
  // Obtener los layouts de todos los nodos
  const layouts = layoutTree(structure, startX, 0);
  
  // Crear un mapa de niveles para aplicar colores
  const levelMap = new Map<string, number>();
  function assignLevels(node: IndexStructureResponse['root'], level: number = 0) {
    const nodeId = node.id || (level === 0 ? 'root' : `node-${level}`);
    levelMap.set(nodeId, level);
    node.children.forEach(child => assignLevels(child, level + 1));
  }
  assignLevels(structure);
  
  // Colores según el nivel
  const colors = [
    { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: '#6366f1' }, // Root
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #10b981 100%)', border: '#8b5cf6' }, // Level 1
    { bg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', border: '#10b981' }, // Level 2
    { bg: '#334155', border: '#475569' }, // Level 3+
  ];
  
  // Crear nodos ReactFlow
  const nodeMap = new Map<string, Node>();
  layouts.forEach((layout) => {
    const level = levelMap.get(layout.id) || 0;
    const colorScheme = colors[Math.min(level, colors.length - 1)];
    
    const newNode: Node = {
      id: layout.id,
      data: { label: layout.node.label },
      position: { x: layout.x, y: layout.y },
      style: {
        background: colorScheme.bg,
        color: '#fff',
        border: `2px solid ${colorScheme.border}`,
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '120px',
        fontWeight: level === 0 ? 'bold' : 'semibold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
      },
    };
    
    nodes.push(newNode);
    nodeMap.set(layout.id, newNode);
  });
  
  // Crear edges
  function createEdges(node: IndexStructureResponse['root'], parentId: string | null = null) {
    const nodeId = node.id || (parentId === null ? 'root' : `node-${Math.random()}`);
    
    if (parentId && nodeMap.has(parentId) && nodeMap.has(nodeId)) {
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
    
    node.children.forEach(child => {
      createEdges(child, nodeId);
    });
  }
  
  createEdges(structure);
  
  return { nodes, edges };
}

export function IndexTreeViewer({ structure }: IndexTreeViewerProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { nodes, edges } = useMemo(() => {
    if (!structure.root) {
      return { nodes: [], edges: [] };
    }
    return buildNodesAndEdges(structure.root);
  }, [structure]);

  // Create a unique key based on structure to force ReactFlow to re-render
  const structureKey = useMemo(() => {
    if (!structure.root) return 'empty';
    // Create a hash from the structure to detect changes
    const structureHash = JSON.stringify(structure.root);
    return `${structure.index_type}-${nodes.length}-${edges.length}-${structureHash.length}`;
  }, [structure, nodes.length, edges.length]);

  // Force fitView when structure changes
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      const timer = setTimeout(() => {
        reactFlowInstance.fitView({ duration: 300, padding: 0.2 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [reactFlowInstance, structureKey, nodes.length]);

  const onInit = (instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  };

  if (nodes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <div className="text-6xl mb-4">🌳</div>
        <p className="text-lg mb-2">No hay estructura para visualizar</p>
        <p className="text-sm text-gray-500">
          Crea un índice primero para ver su estructura
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Total de nodos: {nodes.length}</span>
        <span>Total de conexiones: {edges.length}</span>
      </div>
      <div style={{ width: '100%', height: '600px' }} className="rounded-xl overflow-hidden border border-white/10 bg-dark-bg">
        <ReactFlow 
          key={structureKey}
          nodes={nodes} 
          edges={edges} 
          onInit={onInit}
          fitView
          className="bg-dark-bg"
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background 
            color="#334155" 
            gap={16}
            size={1}
            variant="dots"
          />
          <Controls 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
            showInteractive={false}
          />
          <MiniMap 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
            nodeColor="#6366f1"
            maskColor="rgba(0, 0, 0, 0.5)"
          />
        </ReactFlow>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-4">
        <span>💡 Usa el mouse para arrastrar y hacer zoom</span>
        <span>•</span>
        <span>Usa los controles para navegar</span>
      </div>
    </div>
  );
}

