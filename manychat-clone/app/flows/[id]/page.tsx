"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, addEdge, Connection, Edge, Node, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from "reactflow";
import "reactflow/dist/style.css";
import "../builder.css";

function useFlow(id: string) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/flows/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setName(data.name);
      const diagram = data.diagram || { nodes: [], edges: [] };
      setNodes(diagram.nodes);
      setEdges(diagram.edges);
    })();
  }, [id]);

  async function save(diagram: { nodes: Node[]; edges: Edge[] }) {
    await fetch(`/api/flows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, diagram }),
    });
  }

  return { nodes, setNodes, edges, setEdges, name, setName, save };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Builder(props: any) {
  const { id } = props.params || {};
  const { nodes, setNodes, edges, setEdges, name, setName, save } = useFlow(id);

  const onConnect = useCallback((c: Connection) => {
    setEdges((eds) => addEdge({ ...c, animated: true }, eds));
  }, [setEdges]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  async function handleSave() {
    await save({ nodes, edges });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleSave} className="border rounded px-4 py-2 bg-gray-900 text-white">
          حفظ
        </button>
      </div>
      <div className="h-[70vh] border rounded">
        <ReactFlow nodes={nodes} edges={edges} onEdgesChange={onEdgesChange} onNodesChange={onNodesChange} onConnect={onConnect}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
