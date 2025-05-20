import { useEffect, useRef } from "react";
import ReactFlow, { useEdgesState, useNodesState,Node, Edge, Background, Controls, MiniMap } from "reactflow";
interface Service {
  id: string;
  name: string;
  health: "healthy" | "warning" | "error";
}

interface Dependency {
  source: string;
  target: string;
  type: "http" | "grpc" | "kafka";
  latency: number;
  errorRate: number;
}

interface ServiceDependenciesProps {
  services: Service[];
  dependencies: Dependency[];
  onServiceClick: (serviceId: string) => void;
}

const ServiceDependencies = ({
  dependencies,
  onServiceClick,
  services,
}: ServiceDependenciesProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const wrapper= useRef<HTMLDivElement>(null)
 
   useEffect(() =>{
  const getHealthColor = (health: string): string => {
    if (health === "healthy") return "#10b981";
    if (health === "warning") return "#f59e0b";
    return "#ef4444"; // default for error/unhealthy state
  };
    //to convert service to node 
     const serviceNodes: Node[] = services.map((service) => ({
       id: service.id,
       data: {
         label: service.name,
         health: service.health,
       },
       position: { x: 0, y: 0 },
       type:'default',
       style:{
        background:getHealthColor(service.health),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        width: 150,
       }
     }));

     const dependencyEdges: Edge[] = dependencies.map((dep)=>({
        id:`${dep.source} - ${dep.target}`,
        source:dep.source,
        target:dep.target,
        label:`${dep.latency}ms | ${dep.errorRate}% errors`,
        type:'smoothstep',
        animated:true,
        style:{stroke:'#64748b'},
     }))
     setNodes(serviceNodes)
     setEdges(dependencyEdges)
   }, [dependencies, services, setEdges, setNodes])

   return (
    <div className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg" ref={wrapper}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node )=> onServiceClick?.(node.id)}
        fitView
        >
            <Background/>
            <Controls/>
            <MiniMap/>
        </ReactFlow>
    </div>
   )
};

export default ServiceDependencies;
