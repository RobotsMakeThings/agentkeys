'use client'

interface FilterPillProps {
  label: string
  active: boolean
  onClick: () => void
}

export default function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white' 
          : 'bg-[rgba(255,255,255,.035)] text-[rgba(245,242,239,.58)] border border-[rgba(255,255,255,.09)] hover:bg-[rgba(255,255,255,.05)]'
      }`}
    >
      {label}
    </button>
  )
}