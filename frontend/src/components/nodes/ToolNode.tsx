import { Handle, Position, type NodeProps } from '@xyflow/react'

export default function ToolNode({ data, selected }: NodeProps) {
  return (
    <div className="relative min-w-[130px] text-center" style={{ filter: selected ? 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' : undefined }}>
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />
      {/* Hexagon / wrench-like shape */}
      <svg viewBox="0 0 140 80" className="w-[140px] h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="25,0 115,0 140,40 115,80 25,80 0,40"
          fill="#fef3c7"
          stroke={selected ? '#d97706' : '#f59e0b'}
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Tool</div>
        <div className="text-sm font-medium text-gray-800 truncate max-w-[100px]">{String(data.label)}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500" />
    </div>
  )
}
