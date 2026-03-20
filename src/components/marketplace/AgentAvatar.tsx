interface AgentAvatarProps {
  name: string
  skillCount?: number
  avatarUrl?: string | null
}

export default function AgentAvatar({ name, skillCount, avatarUrl }: AgentAvatarProps) {
  const initials = name.split(' ').map(word => word[0]).join('').slice(0, 2)
  
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-r from-[#9333ea] to-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-sm">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <div className="text-[#f5f2ef] font-medium text-sm">{name}</div>
        {skillCount && (
          <div className="text-[rgba(245,242,239,.58)] text-xs">
            {skillCount} skill{skillCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}