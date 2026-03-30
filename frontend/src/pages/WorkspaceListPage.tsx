import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Workspace } from '../types/workspace'
import { listWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from '../lib/api'

export default function WorkspaceListPage() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState('')

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await listWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    if (!createName.trim()) return
    try {
      await createWorkspace(createName.trim())
      setCreateName('')
      setShowCreate(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace')
    }
  }

  async function handleRename(id: string) {
    if (!renameName.trim()) return
    try {
      await updateWorkspace(id, { name: renameName.trim() })
      setRenamingId(null)
      setRenameName('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename workspace')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete workspace "${name}"?`)) return
    try {
      await deleteWorkspace(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workspace')
    }
  }

  function startRename(ws: Workspace) {
    setRenamingId(ws.id)
    setRenameName(ws.name)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">bench0r</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            New Workspace
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {showCreate && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Create workspace</h2>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Workspace name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => { setShowCreate(false); setCreateName('') }}
                className="px-4 py-2 text-gray-500 text-sm rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No workspaces yet.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Create your first workspace
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {renamingId === ws.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        autoFocus
                        type="text"
                        value={renameName}
                        onChange={(e) => setRenameName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(ws.id)
                          if (e.key === 'Escape') setRenamingId(null)
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRename(ws.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate(`/workspace/${ws.id}`)}
                        className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate block text-left"
                      >
                        {ws.name}
                      </button>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Updated {formatDate(ws.updated_at)}
                      </p>
                    </>
                  )}
                </div>

                {renamingId !== ws.id && (
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => navigate(`/workspace/${ws.id}`)}
                      className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => startRename(ws)}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(ws.id, ws.name)}
                      className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
