'use client'
import { useState, useEffect, useCallback } from 'react'
import SiteShell from '../../components/SiteShell'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { changeTypeBadgeColor, changeTypeLabel } from '../../lib/changeType'
import type { SkillVersionNotification } from '../../types/agentkeys'

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function fetchPendingUpdates(apiKey: string): Promise<SkillVersionNotification[]> {
  const res = await fetch('/api/agents/me/pending-updates', {
    headers: { 'x-agent-key': apiKey },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Failed to fetch updates')
  return json.data
}

async function applyVersionAction(
  apiKey: string,
  skillId: string,
  action: 'adopt' | 'reject',
): Promise<void> {
  const res = await fetch(`/api/agents/skills/${skillId}/version`, {
    method: 'PATCH',
    headers: {
      'x-agent-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Action failed')
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function UpdateCard({
  notification,
  apiKey,
  onAction,
}: {
  notification: SkillVersionNotification
  apiKey: string
  onAction: (skillId: string, action: 'adopt' | 'reject') => Promise<void>
}) {
  const [loading, setLoading] = useState<'adopt' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handle = async (action: 'adopt' | 'reject') => {
    setLoading(action)
    setError(null)
    try {
      await onAction(notification.skill_id, action)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 14,
        background: 'rgba(255,255,255,.025)',
        border: '1px solid rgba(255,255,255,.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
            {notification.skill_name ?? 'Unknown Skill'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge
              label={changeTypeLabel(notification.change_type as any)}
              color={changeTypeBadgeColor(notification.change_type as any)}
            />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              v{notification.version}
            </span>
          </div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {new Date(notification.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Changelog */}
      {notification.changelog && (
        <div
          style={{
            fontSize: 13,
            color: 'rgba(245,242,239,.72)',
            lineHeight: 1.65,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(0,0,0,.18)',
            borderLeft: '3px solid rgba(147,51,234,.4)',
          }}
        >
          {notification.changelog}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ fontSize: 12, color: '#f87171', padding: '6px 10px', background: 'rgba(239,68,68,.1)', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handle('adopt')}
          disabled={loading !== null}
        >
          {loading === 'adopt' ? 'Adopting…' : 'Adopt Update'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handle('reject')}
          disabled={loading !== null}
        >
          {loading === 'reject' ? 'Rejecting…' : 'Stay on Current'}
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PendingUpdatesPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [updates, setUpdates] = useState<SkillVersionNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('agentkey_api_key'))
    }
  }, [])

  const load = useCallback(async () => {
    if (!apiKey) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPendingUpdates(apiKey)
      setUpdates(data)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load updates')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    load()
  }, [load])

  const handleAction = async (skillId: string, action: 'adopt' | 'reject') => {
    if (!apiKey) return
    await applyVersionAction(apiKey, skillId, action)
    // Remove from list on success
    setUpdates(prev => prev.filter(u => u.skill_id !== skillId))
  }

  return (
    <SiteShell>
      <div className="panel section-pad page-enter" style={{ marginTop: 26 }}>
        {/* Header */}
        <div style={{ marginBottom: 26 }}>
          <div className="section-label" style={{ color: 'rgba(147,51,234,.7)', marginBottom: 8 }}>
            Living Skills
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 40, lineHeight: 1, letterSpacing: '-.04em', margin: '0 0 8px', fontWeight: 900 }}>
                Pending Updates
              </h2>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: 15 }}>
                Review and adopt skill updates from creators. You control what runs.
              </p>
            </div>
            {!loading && (
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: updates.length > 0 ? 'rgba(147,51,234,.15)' : 'rgba(255,255,255,.025)',
                  border: updates.length > 0 ? '1px solid rgba(147,51,234,.3)' : '1px solid rgba(255,255,255,.07)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: updates.length > 0 ? '#c084fc' : 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {updates.length} pending
              </div>
            )}
          </div>
        </div>

        {/* No API key */}
        {!apiKey && !loading && (
          <div
            style={{
              padding: 32,
              borderRadius: 14,
              background: 'rgba(255,255,255,.025)',
              border: '1px solid rgba(255,255,255,.07)',
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            No agent key found. Register your agent to see pending updates.
          </div>
        )}

        {/* Loading state */}
        {loading && apiKey && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  height: 120,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,.02)',
                  border: '1px solid rgba(255,255,255,.05)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: 'rgba(239,68,68,.08)',
              border: '1px solid rgba(239,68,68,.2)',
              color: '#f87171',
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={load}>Retry</Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && apiKey && updates.length === 0 && (
          <div
            style={{
              padding: 48,
              borderRadius: 14,
              background: 'rgba(255,255,255,.018)',
              border: '1px solid rgba(255,255,255,.06)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>All caught up</div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>
              No pending updates. Your skills are up to date with your preferences.
            </div>
          </div>
        )}

        {/* Update cards */}
        {!loading && !error && updates.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {updates.map(notification => (
              <UpdateCard
                key={notification.id}
                notification={notification}
                apiKey={apiKey!}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  )
}
