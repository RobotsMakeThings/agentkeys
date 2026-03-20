interface BadgeProps {
  label: string
  color?: 'default' | 'purple' | 'green' | 'red'
}

export default function Badge({ label, color = 'default' }: BadgeProps) {
  const colorClasses = {
    default: 'bg-[rgba(255,255,255,.035)] text-[rgba(245,242,239,.58)] border-[rgba(255,255,255,.09)]',
    purple: 'bg-[rgba(147,51,234,.2)] text-[#9333ea] border-[rgba(147,51,234,.3)]',
    green: 'bg-[rgba(34,197,94,.2)] text-green-400 border-[rgba(34,197,94,.3)]',
    red: 'bg-[rgba(239,68,68,.2)] text-red-400 border-[rgba(239,68,68,.3)]'
  }
  
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded border ${colorClasses[color]}`}>
      {label}
    </span>
  )
}