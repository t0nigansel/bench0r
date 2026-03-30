import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type ReactFlowInstance,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { WorkspaceFullState } from '../types/workspace'
import type { NodeType } from '../types/node'
import { loadWorkspace, createNode } from '../lib/api'
import { nodeTypes } from '../components/nodes'
import NodeDetailPanel from '../components/panels/NodeDetailPanel'

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  AGENT: 'Agent',
  DATASOURCE: 'Data Source',
  TOOL: 'Tool',
  RULE: 'Rule',
}

const PALETTE_COLORS: Record<NodeType, { bg: string; border: string }> = {
  AGENT: { bg: '#dbeafe', border: '#3b82f6' },
  DATASOURCE: { bg: '#d1fae5', border: '#10b981' },
  TOOL: { bg: '#fef3c7', border: '#f59e0b' },
  RULE: { bg: '#fce7f3', border: '#ec4899' },
}

function makeFlowNode(id: string, nodeType: NodeType, label: string, x: number, y: number): Node {
  return {
    id,
    type: nodeType,
    position: { x, y },
    data: { label, nodeType },
  }
}

function toFlowNodes(state: WorkspaceFullState): Node[] {
  return state.nodes.map((n) =>
    makeFlowNode(n.id, n.type as NodeType, n.label, n.x_position, n.y_position)
  )
}

function toFlowEdges(state: WorkspaceFullState): Edge[] {
  return state.edges.map((e) => ({
    id: e.id,
    source: e.source_node_id,
    target: e.target_node_id,
    label: e.label ?? undefined,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  }))
}

export default function WorkspaceCanvasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  const rfInstance = useRef<ReactFlowInstance | null>(null)
  const nodeCountRef = useRef(0)

  // Derive selected node from nodes array so it stays in sync
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  )

  useEffect(() => {
    if (!id) return
    setLoading(true)
    loadWorkspace(id)
      .then((state) => {
        setWorkspaceName(state.workspace.name)
        const flowNodes = toFlowNodes(state)
        setNodes(flowNodes)
        setEdges(toFlowEdges(state))
        nodeCountRef.current = flowNodes.length
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load workspace')
      )
      .finally(() => setLoading(false))
  }, [id, setNodes, setEdges])

  const handleAddNode = useCallback(
    async (nodeType: NodeType) => {
      if (!id) return

      const offset = nodeCountRef.current * 30
      let x = 250 + offset
      let y = 150 + offset

      if (rfInstance.current) {
        const canvasCenter = rfInstance.current.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        })
        x = canvasCenter.x - 80 + offset
        y = canvasCenter.y - 25 + offset
      }

      const label = `New ${NODE_TYPE_LABELS[nodeType]}`

      setSaveStatus('saving')
      try {
        const created = await createNode(id, {
          type: nodeType,
          label,
          x_position: x,
          y_position: y,
        })
        const flowNode = makeFlowNode(created.id, nodeType, created.label, created.x_position, created.y_position)
        setNodes((prev) => [...prev, flowNode])
        nodeCountRef.current += 1

        setSelectedNodeId(flowNode.id)
        setSelectedEdge(null)
        setSaveStatus('saved')
      } catch (err) {
        setSaveStatus('error')
        console.error('Failed to create node:', err)
      }
    },
    [id, setNodes]
  )

  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      )
    },
    [setNodes]
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId))
      setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId))
      setSelectedNodeId(null)
      nodeCountRef.current = Math.max(0, nodeCountRef.current - 1)
    },
    [setNodes, setEdges]
  )

  const onConnect: OnConnect = useCallback(
    (_connection) => {
      // Edge creation will be implemented in a later task
    },
    []
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id)
      setSelectedEdge(null)
    },
    []
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge)
      setSelectedNodeId(null)
    },
    []
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedEdge(null)
  }, [])

  void onConnect

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <TopBar name="" navigate={navigate} saveStatus="error" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Back to workspaces
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar name={workspaceName} navigate={navigate} saveStatus={saveStatus} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left palette */}
        <div className="w-48 bg-white border-r border-gray-200 p-3 flex flex-col gap-2 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Add Node</p>
          {(Object.keys(NODE_TYPE_LABELS) as NodeType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className="text-left px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                style={{ background: PALETTE_COLORS[type].bg, border: `2px solid ${PALETTE_COLORS[type].border}` }}
              />
              {NODE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading canvas...</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              onInit={(instance) => { rfInstance.current = instance }}
              fitView
              fitViewOptions={{ padding: 0.3 }}
            >
              <Background />
              <Controls />
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-sm">
                    Add your first Agent, Data Source, Tool, or Rule.
                  </p>
                </div>
              )}
            </ReactFlow>
          )}
        </div>

        {/* Right detail panel */}
        <div className="w-72 bg-white border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
          {selectedNode && id ? (
            <NodeDetailPanel
              workspaceId={id}
              nodeId={selectedNode.id}
              nodeType={(selectedNode.data as { nodeType: NodeType }).nodeType}
              label={String(selectedNode.data.label)}
              onLabelChange={handleLabelChange}
              onDelete={handleDeleteNode}
              onSaveStatusChange={setSaveStatus}
            />
          ) : selectedEdge ? (
            <EdgeDetailPanel edge={selectedEdge} />
          ) : (
            <p className="text-sm text-gray-400">Select an element to edit its details.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function TopBar({
  name,
  navigate,
  saveStatus,
}: {
  name: string
  navigate: (path: string) => void
  saveStatus: 'saved' | 'saving' | 'error'
}) {
  return (
    <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white shrink-0 justify-between">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/')}
          className="font-semibold text-gray-700 hover:text-blue-600"
        >
          bench0r
        </button>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-600 text-sm font-medium">
          {name || 'Loading...'}
        </span>
      </div>
      <div className="text-xs text-gray-400">
        {saveStatus === 'saved' && 'Saved'}
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'error' && <span className="text-red-400">Save failed</span>}
      </div>
    </header>
  )
}

function EdgeDetailPanel({ edge }: { edge: Edge }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Edge</p>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Source</label>
        <p className="text-sm text-gray-700 font-mono">{edge.source}</p>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Target</label>
        <p className="text-sm text-gray-700 font-mono">{edge.target}</p>
      </div>
      {edge.label && (
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">Label</label>
          <p className="text-sm text-gray-700">{String(edge.label)}</p>
        </div>
      )}
    </div>
  )
}
