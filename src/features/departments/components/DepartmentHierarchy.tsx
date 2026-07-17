'use client';

import '@xyflow/react/dist/style.css';

import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import type { DepartmentResult } from '@/server/departments/types/action-results';

import { layoutDepartmentTree } from '../lib/department-hierarchy-layout';
import { DepartmentFlowNode } from './DepartmentFlowNode';

const nodeTypes = { department: DepartmentFlowNode };

type DepartmentHierarchyProps = {
  departments: DepartmentResult[];
};

export function DepartmentHierarchy({ departments }: DepartmentHierarchyProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const { nodes, edges } = useMemo(() => layoutDepartmentTree(departments), [departments]);

  return (
    <div className="bg-card h-[70vh] w-full overflow-hidden rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, node) => router.push(`/dashboard/departments/${node.id}/edit`)}
        colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor="var(--color-primary)"
          maskColor="var(--color-background)"
          className="!bg-card !border-border rounded-md border"
        />
      </ReactFlow>
    </div>
  );
}
