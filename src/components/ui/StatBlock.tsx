interface StatBlockProps {
  label: string
  value: string | number
  suffix?: string
}

export default function StatBlock({ label, value, suffix }: StatBlockProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#f5f2ef]">
        {value}{suffix && <span className="text-lg">{suffix}</span>}
      </div>
      <div className="text-sm text-[rgba(245,242,239,.58)] mt-1">
        {label}
      </div>
    </div>
  )
}