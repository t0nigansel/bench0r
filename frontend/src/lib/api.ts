import type { Workspace, WorkspaceFullState } from '../types/workspace'
import type { AppNode, NodeType } from '../types/node'

const API_BASE = '/api'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body}`)
  }
  return res.json()
}

export function listWorkspaces(): Promise<Workspace[]> {
  return apiFetch('/workspaces')
}

export function createWorkspace(name: string, description?: string): Promise<Workspace> {
  return apiFetch('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
}

export function updateWorkspace(id: string, data: { name?: string; description?: string }): Promise<Workspace> {
  return apiFetch(`/workspaces/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteWorkspace(id: string): Promise<void> {
  return apiFetch(`/workspaces/${id}`, { method: 'DELETE' })
}

export function getWorkspace(id: string): Promise<Workspace> {
  return apiFetch(`/workspaces/${id}`)
}

export function loadWorkspace(id: string): Promise<WorkspaceFullState> {
  return apiFetch(`/workspaces/${id}/load`)
}

export function createNode(
  workspaceId: string,
  data: { type: NodeType; label: string; x_position: number; y_position: number },
): Promise<AppNode> {
  return apiFetch(`/workspaces/${workspaceId}/nodes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
