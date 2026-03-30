import { Handle, Position, type NodeProps } from '@xyflow/react'

export default function DataSourceNode({ data, selected }: NodeProps) {
  return (
    <div className="relative min-w-[130px] text-center" style={{ filter: selected ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : undefined }}>
      <Handle type="target" position={Position.Top} className="!bg-emerald-500" />
      {/* Cylinder shape via SVG */}
      <svg viewBox="0 0 130 90" className="w-[130px] h-[90px]" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="65" cy="18" rx="60" ry="16" fill="#d1fae5" stroke={selected ? '#059669' : '#10b981'} strokeWidth="2" />
        <rect x="5" y="18" width="120" height="50" fill="#d1fae5" />
        <line x1="5" y1="18" x2="5" y2="68" stroke={selected ? '#059669' : '#10b981'} strokeWidth="2" />
        <line x1="125" y1="18" x2="125" y2="68" stroke={selected ? '#059669' : '#10b981'} strokeWidth="2" />
        <ellipse cx="65" cy="68" rx="60" ry="16" fill="#d1fae5" stroke={selected ? '#059669' : '#10b981'} strokeWidth="2" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">Data Source</div>
        <div className="text-sm font-medium text-gray-800 truncate max-w-[110px]">{String(data.label)}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500" />
    </div>
  )
}
