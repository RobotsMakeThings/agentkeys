interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl font-bold text-[#f5f2ef] mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[rgba(245,242,239,.58)] text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}