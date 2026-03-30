import { useEffect, useState, useCallback } from 'react'
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
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { WorkspaceFullState } from '../types/workspace'
import type { NodeType } from '../types/node'
import { loadWorkspace } from '../lib/api'

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  AGENT: 'Agent',
  DATASOURCE: 'Data Source',
  TOOL: 'Tool',
  RULE: 'Rule',
}

const NODE_TYPE_STYLES: Record<NodeType, { background: string; border: string; borderRadius: string }> = {
  AGENT: { background: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '8px' },
  DATASOURCE: { background: '#d1fae5', border: '2px solid #10b981', borderRadius: '50%' },
  TOOL: { background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '4px 16px 4px 16px' },
  RULE: { background: '#fce7f3', border: '2px solid #ec4899', borderRadius: '0' },
}

function toFlowNodes(state: WorkspaceFullState): Node[] {
  return state.nodes.map((n) => {
    const style = NODE_TYPE_STYLES[n.type as NodeType] ?? NODE_TYPE_STYLES.AGENT
    return {
      id: n.id,
      type: 'default',
      position: { x: n.x_position, y: n.y_position },
      data: { label: n.label, nodeType: n.type },
      style: {
        ...style,
        width: 160,
        minHeight: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 500,
      },
    }
  })
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

  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    loadWorkspace(id)
      .then((state) => {
        setWorkspaceName(state.workspace.name)
        setNodes(toFlowNodes(state))
        setEdges(toFlowEdges(state))
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load workspace')
      )
      .finally(() => setLoading(false))
  }, [id, setNodes, setEdges])

  const onConnect: OnConnect = useCallback(
    (_connection) => {
      // Edge creation will be implemented in a later task
    },
    []
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
      setSelectedEdge(null)
    },
    []
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge)
      setSelectedNode(null)
    },
    []
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // void usage to suppress lint warning
  void setSaveStatus
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
              className="text-left px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              title={`Add ${NODE_TYPE_LABELS[type]} (coming soon)`}
              disabled
            >
              <span
                className="inline-block w-3 h-3 rounded-sm mr-2 align-middle"
                style={{ background: NODE_TYPE_STYLES[type].background, border: NODE_TYPE_STYLES[type].border }}
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
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
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
          {selectedNode ? (
            <NodeDetailPanel node={selectedNode} />
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

function NodeDetailPanel({ node }: { node: Node }) {
  const nodeType = (node.data as { nodeType?: string })?.nodeType ?? 'Unknown'
  const label = (node.data as { label?: string })?.label ?? ''

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        {nodeType} Node
      </p>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <p className="text-sm text-gray-800 font-medium">{label}</p>
      </div>
      <p className="text-xs text-gray-400 mt-4">Editing coming soon.</p>
    </div>
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
      <p className="text-xs text-gray-400 mt-4">Editing coming soon.</p>
    </div>
  )
}
