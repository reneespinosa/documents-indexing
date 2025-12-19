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

interface TreeNodeLayout {
  node: IndexStructureResponse['root'];
  x: number;
  y: number;
  width: number;
  mod: number;
}

// Constantes para el layout
const NODE_WIDTH = 150;
const NODE_HEIGHT = 80;
const LEVEL_HEIGHT = 200;
const SIBLING_SPACING = 100;
const SUBTREE_SPACING = 50;

// Primera pasada: calcular el ancho de cada subárbol
function calculateSubtreeWidth(node: IndexStructureResponse['root']): number {
  if (node.children.length === 0) {
    return NODE_WIDTH;
  }
  
  let totalWidth = 0;
  for (const child of node.children) {
    totalWidth += calculateSubtreeWidth(child) + SIBLING_SPACING;
  }
  totalWidth -= SIBLING_SPACING; // Remover el último espaciado
  
  return Math.max(NODE_WIDTH, totalWidth);
}

// Segunda pasada: posicionar los nodos usando un algoritmo jerárquico mejorado
function positionNodes(
  node: IndexStructureResponse['root'],
  x: number,
  y: number,
  level: number = 0
): TreeNodeLayout[] {
  const layouts: TreeNodeLayout[] = [];
  const nodeId = node.id || `node-${level}`;
  
  let currentX = x;
  
  if (node.children.length > 0) {
    // Calcular el ancho total de todos los hijos
    const childrenWidths = node.children.map(child => calculateSubtreeWidth(child));
    const totalChildrenWidth = childrenWidths.reduce((sum, w) => sum + w, 0) + 
                               (node.children.length - 1) * SIBLING_SPACING;
    
    // Centrar el nodo padre sobre sus hijos
    const parentX = x + totalChildrenWidth / 2 - NODE_WIDTH / 2;
    currentX = parentX;
    
    // Posicionar cada hijo
    let childX = x;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childWidth = childrenWidths[i];
      
      // Posicionar el hijo centrado en su subárbol
      const childCenterX = childX + childWidth / 2;
      const childLayouts = positionNodes(
        child,
        childX,
        y + LEVEL_HEIGHT,
        level + 1
      );
      
      layouts.push(...childLayouts);
      
      // Mover x para el siguiente hijo
      childX += childWidth + SIBLING_SPACING;
    }
  }
  
  // Agregar el nodo actual
  layouts.push({
    node,
    x: currentX,
    y,
    width: NODE_WIDTH,
    mod: 0,
  });
  
  return layouts;
}

function buildNodesAndEdges(
  structure: IndexStructureResponse['root']
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Calcular el ancho total del árbol para centrarlo
  const treeWidth = calculateSubtreeWidth(structure);
  const startX = -treeWidth / 2;
  
  // Obtener los layouts de todos los nodos
  const layouts = positionNodes(structure, startX, 0);
  
  // Crear un mapa de niveles para aplicar colores
  const levelMap = new Map<string, number>();
  function assignLevels(node: IndexStructureResponse['root'], level: number = 0) {
    const nodeId = node.id || 'root';
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
  layouts.forEach((layout, index) => {
    const nodeId = layout.node.id || `node-${index}`;
    const level = levelMap.get(nodeId) || 0;
    const colorScheme = colors[Math.min(level, colors.length - 1)];
    
    const newNode: Node = {
      id: nodeId,
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
    nodeMap.set(nodeId, newNode);
  });
  
  // Crear edges
  function createEdges(node: IndexStructureResponse['root'], parentId: string | null = null) {
    const nodeId = node.id || 'root';
    
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
          nodes={nodes} 
          edges={edges} 
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

