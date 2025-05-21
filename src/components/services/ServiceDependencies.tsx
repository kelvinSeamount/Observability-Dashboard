import { useEffect, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Service, Dependency } from "../../types";

interface ServiceDependenciesProps {
  services: Service[];
  dependencies: Dependency[];
}

const ServiceDependencies = ({
  services,
  dependencies,
}: ServiceDependenciesProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const getHealthColor = (health: string): string => {
        if (health === "healthy") return "#10b981";
        if (health === "warning") return "#f59e0b";
        return "#ef4444";
      };
    const serviceNodes: Node[] = services.map((service) => ({
      id: service.id,
      data: {
        label: service.name,
        health: service.health,
      },
      position: { x: 0, y: 0 }, 
      type: "default",
      style: {
        background:getHealthColor(service.health),
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "10px",
        width: 150,
      },
    }));

    // Convert dependencies to edges
    const dependencyEdges: Edge[] = dependencies.map((dep) => ({
      id: `${dep.source}-${dep.target}`,
      source: dep.source,
      target: dep.target,
      label: `${dep.latency}ms | ${dep.errorRate}% errors`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#64748B" },
    }));

    setNodes(serviceNodes);
    setEdges(dependencyEdges);
  }, [services, dependencies, setNodes, setEdges]);

  return (
    <div
      ref={wrapper}
      className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ServiceDependencies;
