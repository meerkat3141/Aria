import React, { useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    type Edge,
    type Node,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import type { JobResults } from '../types';

interface Props {
    data: JobResults;
}

const nodeWidth = 250;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // adjust to center
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
        return node;
    });

    return { nodes: layoutedNodes, edges };
};

export const AuditGraph: React.FC<Props> = ({ data }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!data.results) return;

        // 1. Create Nodes
        const initialNodes: Node[] = data.results.map((page) => {
            let colorClass = '#E74C3C'; // Red
            if (page.score >= 90) colorClass = '#27AE60'; // Green
            else if (page.score >= 70) colorClass = '#F39C12'; // Orange/Yellow

            // Simplify URL for display
            let label = page.url;
            try {
                const u = new URL(page.url);
                label = u.pathname === '/' ? u.hostname : u.pathname;
            } catch (e) { }

            return {
                id: page.url, // URL as ID
                data: { label: `${label} (Score: ${page.score})` },
                position: { x: 0, y: 0 },
                style: {
                    background: '#F5F5DC', // Light Beige
                    color: '#2C3E50', // Dark Slate
                    border: `2px solid ${colorClass}`,
                    borderRadius: '8px',
                    width: nodeWidth,
                    fontSize: '12px',
                    padding: '10px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                },
            };
        });

        // 2. Create Edges
        const initialEdges: Edge[] = [];
        if (data.graph_data?.edges) {
            data.graph_data.edges.forEach((link, idx) => {
                // Only add edge if both nodes exist in our results
                const sourceExists = initialNodes.find(n => n.id === link.source);
                const targetExists = initialNodes.find(n => n.id === link.target);

                if (sourceExists && targetExists) {
                    initialEdges.push({
                        id: `e${idx}`,
                        source: link.source,
                        target: link.target,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: '#7F8C8D', strokeWidth: 1.5 }, // Grey edges
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: '#7F8C8D',
                        },
                    });
                }
            });
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [data, setNodes, setEdges]);

    return (
        <div className="h-[500px] w-full border border-[#D4C5B0] rounded-xl bg-white/50 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background color="#D4C5B0" gap={16} />
                <Controls className="bg-white border border-[#D4C5B0] text-[#2C3E50]" />
            </ReactFlow>
        </div>
    );
};
