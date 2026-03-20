interface SupplyBarProps {
  minted: number
  total: number
  className?: string
}

export default function SupplyBar({ minted, total, className = '' }: SupplyBarProps) {
  const percentage = (minted / total) * 100
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-[rgba(245,242,239,.58)] mb-1">
        <span>{minted} minted</span>
        <span>{total} total</span>
      </div>
      <div className="w-full bg-[rgba(255,255,255,.05)] rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-[rgba(245,242,239,.58)] mt-1 text-center">
        {Math.round(percentage)}% minted
      </div>
    </div>
  )
}