import type { AppNode, NodeProperty } from './node'
import type { AppEdge } from './edge'

export interface Workspace {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceFullState {
  workspace: Workspace
  nodes: AppNode[]
  node_properties: NodeProperty[]
  edges: AppEdge[]
}
