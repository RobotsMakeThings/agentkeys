'use client'
import { useState, useEffect } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { changeTypeBadgeColor, changeTypeLabel, ChangeType } from '../../lib/changeType'
import type { SkillVersion } from '../../types/agentkeys'

interface SkillChangelogProps {
  skillId: string
  apiKey: string                     // KR2 fix: always required — needed to authenticate the request
  pendingVersions?: number[]         // which versions are pending decision for this agent
  onAdopt?: (version: number) => Promise<void>
}

async function fetchVersionHistory(skillId: string, apiKey: string): Promise<SkillVersion[]> {
  const res = await fetch(`/api/skills/${skillId}/versions`, {
    headers: { 'x-agent-key': apiKey },
  })
  const json = await res.json()
  // KR2 fix: handle 401 gracefully
  if (res.status === 401) {
    throw new Error('Unauthorized: Please check your agent key.')
  }
  if (!res.ok) throw new Error(json?.error?.message ?? 'Failed to fetch version history')
  return json.data
}

export default function SkillChangelog({
  skillId,
  apiKey,
  pendingVersions = [],
  onAdopt,
}: SkillChangelogProps) {
  const [versions, setVersions] = useState<SkillVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const [adoptingVersion, setAdoptingVersion] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setIsUnauthorized(false)
    fetchVersionHistory(skillId, apiKey)
      .then(data => {
        // Sort descending by version number
        setVersions(data.sort((a, b) => b.version - a.version))
      })
      .catch(err => {
        if (err.message?.startsWith('Unauthorized')) {
          setIsUnauthorized(true)
        } else {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))
  }, [skillId, apiKey])

  const handleAdopt = async (version: number) => {
    if (!onAdopt) return
    setAdoptingVersion(version)
    try {
      await onAdopt(version)
    } finally {
      setAdoptingVersion(null)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 72,
              borderRadius: 10,
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.05)',
            }}
          />
        ))}
      </div>
    )
  }

  // KR2 fix: dedicated 401 error state
  if (isUnauthorized) {
    return (
      <div
        style={{
          fontSize: 13,
          color: '#f87171',
          padding: '10px 14px',
          background: 'rgba(239,68,68,.08)',
          borderRadius: 10,
          border: '1px solid rgba(239,68,68,.2)',
        }}
      >
        Unauthorized: Your agent key does not have access to this skill&apos;s version history.
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ fontSize: 13, color: '#f87171', padding: '10px 14px', background: 'rgba(239,68,68,.08)', borderRadius: 10 }}>
        {error}
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div style={{ color: 'var(--muted)', fontSize: 13, padding: '16px 0' }}>
        No version history available.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {versions.map((v, idx) => {
        const isPending = pendingVersions.includes(v.version)
        const isLatest = idx === 0

        return (
          <div
            key={v.id}
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: isPending
                ? 'rgba(147,51,234,.08)'
                : 'rgba(255,255,255,.022)',
              border: isPending
                ? '1px solid rgba(147,51,234,.25)'
                : '1px solid rgba(255,255,255,.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Version header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>v{v.version}</span>
                <Badge
                  label={changeTypeLabel(v.change_type as ChangeType)}
                  color={changeTypeBadgeColor(v.change_type as ChangeType)}
                />
                {isLatest && (
                  <Badge label="Latest" color="green" />
                )}
                {isPending && (
                  <Badge label="Pending Review" color="purple" />
                )}
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {new Date(v.published_at).toLocaleDateString()}
              </span>
            </div>

            {/* Changelog */}
            {v.changelog && (
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(245,242,239,.72)',
                  lineHeight: 1.65,
                }}
              >
                {v.changelog}
              </div>
            )}

            {/* Adopt button — only for pending versions, only if onAdopt provided */}
            {isPending && onAdopt && (
              <div style={{ marginTop: 4 }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAdopt(v.version)}
                  disabled={adoptingVersion !== null}
                >
                  {adoptingVersion === v.version ? 'Adopting…' : 'Adopt This Version'}
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
