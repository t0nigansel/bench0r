export type NodeType = 'AGENT' | 'DATASOURCE' | 'TOOL' | 'RULE'

export interface AppNode {
  id: string
  workspace_id: string
  type: NodeType
  label: string
  x_position: number
  y_position: number
  width: number | null
  height: number | null
  created_at: string
  updated_at: string
}

export interface NodeProperty {
  id: string
  node_id: string
  key: string
  value: string
  value_type: string
  created_at: string
  updated_at: string
}
