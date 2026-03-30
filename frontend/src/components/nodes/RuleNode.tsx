import { Handle, Position, type NodeProps } from '@xyflow/react'

export default function RuleNode({ data, selected }: NodeProps) {
  return (
    <div className="relative min-w-[130px] text-center" style={{ filter: selected ? 'drop-shadow(0 0 4px rgba(236,72,153,0.5))' : undefined }}>
      <Handle type="target" position={Position.Top} className="!bg-pink-500" />
      {/* Diamond / shield shape */}
      <svg viewBox="0 0 140 90" className="w-[140px] h-[90px]" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="70,2 136,25 120,82 20,82 4,25"
          fill="#fce7f3"
          stroke={selected ? '#db2777' : '#ec4899'}
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <div className="text-[10px] uppercase tracking-wider text-pink-600 font-semibold">Rule</div>
        <div className="text-sm font-medium text-gray-800 truncate max-w-[100px]">{String(data.label)}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-pink-500" />
    </div>
  )
}
