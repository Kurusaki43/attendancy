import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';

import type { DepartmentResult } from '@/server/departments/types/action-results';

export const DEPARTMENT_NODE_WIDTH = 240;
export const DEPARTMENT_NODE_HEIGHT = 92;

export type DepartmentNode = Node<{ department: DepartmentResult }, 'department'>;

export function layoutDepartmentTree(departments: DepartmentResult[]): {
  nodes: DepartmentNode[];
  edges: Edge[];
} {
  const idsInTree = new Set(departments.map((department) => department.id));

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 100 });

  departments.forEach((department) => {
    graph.setNode(department.id, {
      width: DEPARTMENT_NODE_WIDTH,
      height: DEPARTMENT_NODE_HEIGHT,
    });
  });

  const edges: Edge[] = [];

  departments.forEach((department) => {
    if (department.parentId && idsInTree.has(department.parentId)) {
      graph.setEdge(department.parentId, department.id);
      edges.push({
        id: `${department.parentId}->${department.id}`,
        source: department.parentId,
        target: department.id,
        type: 'smoothstep',
      });
    }
  });

  dagre.layout(graph);

  const nodes: DepartmentNode[] = departments.map((department) => {
    const { x, y } = graph.node(department.id);

    return {
      id: department.id,
      type: 'department',
      position: { x: x - DEPARTMENT_NODE_WIDTH / 2, y: y - DEPARTMENT_NODE_HEIGHT / 2 },
      data: { department },
    };
  });

  return { nodes, edges };
}
