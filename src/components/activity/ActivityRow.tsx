import { Transaction } from '../../types/agentkeys'
import Badge from '../ui/Badge'

interface ActivityRowProps {
  transaction: Transaction
}

export default function ActivityRow({ transaction }: ActivityRowProps) {
  // Agent and collection data comes from API relations now
  const buyer = transaction.buyer
  const seller = transaction.seller
  const collection = transaction.collection
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mint': return 'green'
      case 'sale': return 'purple'
      case 'transfer': return 'default'
      default: return 'default'
    }
  }
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-[rgba(255,255,255,.05)]">
      <div className="flex items-center space-x-4">
        <Badge label={transaction.type.toUpperCase()} color={getTypeColor(transaction.type)} />
        
        <div>
          <div className="text-[#f5f2ef] font-medium">
            {collection?.name || 'Unknown Collection'}
          </div>
          <div className="text-[rgba(245,242,239,.58)] text-sm">
            {transaction.type === 'mint' && buyer && (
              <>Minted by {buyer.name}</>
            )}
            {transaction.type === 'sale' && buyer && seller && (
              <>{seller.name} → {buyer.name}</>
            )}
            {transaction.type === 'transfer' && buyer && seller && (
              <>Transferred: {seller.name} → {buyer.name}</>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-[#9333ea] font-bold">
          {transaction.price_sol} SOL
        </div>
        <div className="text-[rgba(245,242,239,.58)] text-xs">
          {formatTime(transaction.created_at)}
        </div>
      </div>
    </div>
  )
}