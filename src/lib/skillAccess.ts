import { SkillAccessResponse } from '@/types/agentkeys'

export async function checkSkillAccess(
  skillId: string,
  apiKey: string
): Promise<SkillAccessResponse> {
  const res = await fetch(`/api/skill-access/${skillId}`, {
    headers: { 'x-agent-key': apiKey },
  })

  if (!res.ok) {
    return { has_access: false, current_version: 0, served_version: 0, is_pinned: false }
  }

  const json = await res.json()
  return json.data
}