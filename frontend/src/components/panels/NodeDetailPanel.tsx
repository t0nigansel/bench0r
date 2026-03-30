import { useState, useEffect, useCallback } from 'react'
import type { NodeType, NodeProperty } from '../../types/node'
import { updateNode, deleteNode, listNodeProperties, upsertNodeProperty } from '../../lib/api'

const PROPERTY_KEYS_BY_TYPE: Record<NodeType, string[]> = {
  AGENT: ['role', 'goal', 'model', 'notes'],
  DATASOURCE: ['source_kind', 'location', 'sensitivity', 'notes'],
  TOOL: ['tool_kind', 'description', 'notes'],
  RULE: ['rule_kind', 'severity', 'scope', 'notes'],
}

const PROPERTY_LABELS: Record<string, string> = {
  role: 'Role',
  goal: 'Goal',
  model: 'Model',
  notes: 'Notes',
  source_kind: 'Source Kind',
  location: 'Location',
  sensitivity: 'Sensitivity',
  tool_kind: 'Tool Kind',
  description: 'Description',
  rule_kind: 'Rule Kind',
  severity: 'Severity',
  scope: 'Scope',
}

interface Props {
  workspaceId: string
  nodeId: string
  nodeType: NodeType
  label: string
  onLabelChange: (nodeId: string, newLabel: string) => void
  onDelete: (nodeId: string) => void
  onSaveStatusChange: (status: 'saved' | 'saving' | 'error') => void
}

export default function NodeDetailPanel({
  workspaceId,
  nodeId,
  nodeType,
  label,
  onLabelChange,
  onDelete,
  onSaveStatusChange,
}: Props) {
  const [editLabel, setEditLabel] = useState(label)
  const [properties, setProperties] = useState<Record<string, string>>({})
  const [loadedProps, setLoadedProps] = useState(false)

  // Sync label from props when selection changes
  useEffect(() => {
    setEditLabel(label)
  }, [label, nodeId])

  // Load properties when node changes
  useEffect(() => {
    setLoadedProps(false)
    listNodeProperties(workspaceId, nodeId)
      .then((props) => {
        const map: Record<string, string> = {}
        props.forEach((p) => { map[p.key] = p.value })
        setProperties(map)
      })
      .catch(() => setProperties({}))
      .finally(() => setLoadedProps(true))
  }, [workspaceId, nodeId])

  const saveLabel = useCallback(async () => {
    const trimmed = editLabel.trim()
    if (!trimmed || trimmed === label) return
    onSaveStatusChange('saving')
    try {
      await updateNode(workspaceId, nodeId, { label: trimmed })
      onLabelChange(nodeId, trimmed)
      onSaveStatusChange('saved')
    } catch {
      onSaveStatusChange('error')
    }
  }, [editLabel, label, workspaceId, nodeId, onLabelChange, onSaveStatusChange])

  const saveProperty = useCallback(async (key: string, value: string) => {
    onSaveStatusChange('saving')
    try {
      await upsertNodeProperty(workspaceId, nodeId, { key, value })
      setProperties((prev) => ({ ...prev, [key]: value }))
      onSaveStatusChange('saved')
    } catch {
      onSaveStatusChange('error')
    }
  }, [workspaceId, nodeId, onSaveStatusChange])

  const handleDelete = useCallback(async () => {
    if (!confirm('Delete this node?')) return
    onSaveStatusChange('saving')
    try {
      await deleteNode(workspaceId, nodeId)
      onDelete(nodeId)
      onSaveStatusChange('saved')
    } catch {
      onSaveStatusChange('error')
    }
  }, [workspaceId, nodeId, onDelete, onSaveStatusChange])

  const propertyKeys = PROPERTY_KEYS_BY_TYPE[nodeType] ?? []

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        {nodeType} Node
      </p>

      {/* Label */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={saveLabel}
          onKeyDown={(e) => { if (e.key === 'Enter') saveLabel() }}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Type-specific properties */}
      {loadedProps && propertyKeys.map((key) => (
        <PropertyField
          key={key}
          propKey={key}
          label={PROPERTY_LABELS[key] ?? key}
          value={properties[key] ?? ''}
          isMultiline={key === 'notes' || key === 'description' || key === 'goal'}
          onSave={(val) => saveProperty(key, val)}
        />
      ))}

      {/* Delete */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  )
}

function PropertyField({
  propKey,
  label,
  value,
  isMultiline,
  onSave,
}: {
  propKey: string
  label: string
  value: string
  isMultiline: boolean
  onSave: (val: string) => void
}) {
  const [editVal, setEditVal] = useState(value)

  useEffect(() => { setEditVal(value) }, [value])

  const handleBlur = () => {
    if (editVal !== value) onSave(editVal)
  }

  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {isMultiline ? (
        <textarea
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={handleBlur}
          rows={3}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type="text"
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') handleBlur() }}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      )}
    </div>
  )
}
