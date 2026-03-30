import { Handle, Position, type NodeProps } from '@xyflow/react'

export default function AgentNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 min-w-[140px] text-center rounded-lg border-2 ${
        selected ? 'border-blue-600 shadow-md' : 'border-blue-400'
      }`}
      style={{ background: '#dbeafe' }}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="text-[10px] uppercase tracking-wider text-blue-500 font-semibold mb-1">Agent</div>
      <div className="text-sm font-medium text-gray-800 truncate">{String(data.label)}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  )
}
