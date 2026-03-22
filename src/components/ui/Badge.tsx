interface BadgeProps {
  label: string
  color?: 'default' | 'purple' | 'green' | 'red' | 'amber' | 'violet' | 'pink'
}

export default function Badge({ label, color = 'default' }: BadgeProps) {
  const colorClasses = {
    default: 'bg-[rgba(255,255,255,.035)] text-[rgba(245,242,239,.58)] border-[rgba(255,255,255,.09)]',
    purple:  'bg-[rgba(147,51,234,.2)] text-[#9333ea] border-[rgba(147,51,234,.3)]',
    green:   'bg-[rgba(34,197,94,.2)] text-green-400 border-[rgba(34,197,94,.3)]',
    red:     'bg-[rgba(239,68,68,.2)] text-red-400 border-[rgba(239,68,68,.3)]',
    // Living Skills change_type colors:
    amber:   'bg-[rgba(245,158,11,.2)] text-amber-400 border-[rgba(245,158,11,.3)]',   // patch (#f59e0b)
    violet:  'bg-[rgba(139,92,246,.2)] text-violet-400 border-[rgba(139,92,246,.3)]',  // minor (#9333ea)
    pink:    'bg-[rgba(236,72,153,.2)] text-pink-400 border-[rgba(236,72,153,.3)]',    // major (#ec4899)
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded border ${colorClasses[color]}`}>
      {label}
    </span>
  )
}
