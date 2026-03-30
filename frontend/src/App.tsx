import { Routes, Route, Navigate } from 'react-router-dom'
import WorkspaceListPage from './pages/WorkspaceListPage'
import WorkspaceCanvasPage from './pages/WorkspaceCanvasPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceListPage />} />
      <Route path="/workspace/:id" element={<WorkspaceCanvasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
