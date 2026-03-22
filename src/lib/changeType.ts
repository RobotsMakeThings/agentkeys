export type ChangeType = 'patch' | 'minor' | 'major'

export function changeTypeBadgeColor(changeType: ChangeType): 'amber' | 'violet' | 'pink' {
  const map = {
    patch: 'amber',
    minor: 'violet',
    major: 'pink',
  } as const
  return map[changeType] ?? 'amber'
}

export function changeTypeLabel(changeType: ChangeType): string {
  return changeType.charAt(0).toUpperCase() + changeType.slice(1)
}
