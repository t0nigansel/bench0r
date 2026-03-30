import { useParams } from 'react-router-dom'

export default function WorkspaceCanvasPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
        <span className="font-semibold text-gray-700">bench0r</span>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-500 text-sm">Workspace {id}</span>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Canvas coming soon.</p>
      </div>
    </div>
  )
}
