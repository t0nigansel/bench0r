export interface AppEdge {
  id: string
  workspace_id: string
  source_node_id: string
  target_node_id: string
  type: string
  label: string | null
  created_at: string
  updated_at: string
}
