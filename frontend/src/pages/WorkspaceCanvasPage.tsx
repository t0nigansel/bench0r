import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Workspace } from '../types/workspace'
import { getWorkspace } from '../lib/api'

export default function WorkspaceCanvasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getWorkspace(id)
      .then(setWorkspace)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load workspace'))
  }, [id])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white shrink-0">
        <button
          onClick={() => navigate('/')}
          className="font-semibold text-gray-700 hover:text-blue-600"
        >
          bench0r
        </button>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-500 text-sm">
          {workspace?.name ?? 'Loading...'}
        </span>
      </header>

      {error ? (
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
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Canvas coming soon.</p>
        </div>
      )}
    </div>
  )
}
