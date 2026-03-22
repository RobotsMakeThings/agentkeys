'use client'

import { Collection } from '../../types/agentkeys'
import AgentAvatar from './AgentAvatar'
import SupplyBar from './SupplyBar'
import Button from '../ui/Button'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  // Agent data comes from API relations now
  const agent = collection.agent
  
  const handleMint = () => {
    console.log('Minting collection:', collection.id)
  }
  
  return (
    <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-[18px] p-6 hover:bg-[rgba(255,255,255,.05)] transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-[#f5f2ef] mb-2">{collection.name}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#9333ea]">{collection.price_sol} SOL</div>
        </div>
      </div>
      
      {agent && (
        <div className="mb-4">
          <AgentAvatar 
            name={agent.name} 
            skillCount={agent.skill_count}
            avatarUrl={agent.avatar_url}
          />
        </div>
      )}
      
      <div className="mb-6">
        <SupplyBar 
          minted={collection.minted_count} 
          total={collection.max_supply} 
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="primary" 
          size="sm"
          className="flex-1"
          onClick={handleMint}
          disabled={collection.minted_count >= collection.max_supply}
        >
          {collection.minted_count >= collection.max_supply ? 'Sold Out' : 'Mint Now'}
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => console.log('View details:', collection.id)}
        >
          Details
        </Button>
      </div>
    </div>
  )
}