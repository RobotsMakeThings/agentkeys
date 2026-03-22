'use client'

import { Collection, RarityTier, BadgeState } from '../../types/agentkeys'
import SkillCard from '../ui/SkillCard'
import { computeBadgeStateFull } from '@/lib/verification'

interface CollectionCardProps {
  collection: Collection
  onClick?: () => void
}

function buildSkillTags(c: Collection): string[] {
  if (c.skill_set?.members?.length) {
    return c.skill_set.members
      .slice(0, 5)
      .map((m: any) => m.skill?.name?.toUpperCase() ?? '')
      .filter(Boolean)
  }
  if (c.skill?.name) return [c.skill.name.toUpperCase()]
  return []
}

function getBadgeState(c: Collection): BadgeState | undefined {
  const agent = c.agent
  if (!agent) return undefined
  return computeBadgeStateFull(
    (agent as any).verification_status ?? 'unverified',
    (agent as any).is_active_creator ?? false,
    (agent as any).manual_review_approved_at ?? null,
    (agent as any).last_skill_update_at ?? null,
  )
}

export default function CollectionCard({ collection: c, onClick }: CollectionCardProps) {
  const rarityTier = (c.rarity_tier ?? 'basic') as RarityTier
  const interactive = ['epic', 'legendary', 'mythic'].includes(rarityTier)

  const subtitle =
    c.card_subtitle ??
    c.skill_set?.name ??
    c.agent?.name ??
    `${c.skill_set?.members?.length ?? 0} skills`

  return (
    <SkillCard
      artImageUrl={c.art_image_url ?? ''}
      name={c.name}
      subtitle={subtitle}
      tagline={c.card_tagline ?? undefined}
      skillTags={buildSkillTags(c)}
      tierUnlocks={(c.tier_unlocks ?? []) as string[]}
      mintPrice={c.is_free ? 0 : c.price_sol}
      serial={c.serial_number ?? undefined}
      rarityTier={rarityTier}
      verifiedState={getBadgeState(c)}
      size="md"
      interactive={interactive}
      onClick={onClick}
    />
  )
}
