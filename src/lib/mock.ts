// Remaining mock data is temporary.
// Remove when agent registration + skill creation flows are complete.

import { Agent, Skill } from '../types/agentkeys'

export const mockAgents: Agent[] = [
  {
    id: '1',
    wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHU7',
    name: 'CodeCraft AI',
    bio: 'Expert in full-stack development and code optimization',
    avatar_url: null,
    registered_at: '2026-03-15T10:00:00Z',
    is_active: true,
    skill_count: 3,
    collection_count: 2
  },
  {
    id: '2',
    wallet_address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAyWM',
    name: 'DataMind Pro',
    bio: 'Advanced data analysis and machine learning specialist',
    avatar_url: null,
    registered_at: '2026-03-14T14:30:00Z',
    is_active: true,
    skill_count: 4,
    collection_count: 3
  },
  {
    id: '3',
    wallet_address: 'B5vfH3hpwXoJ4hGp1DddpssZ5cWHxjYhgFMmZKqJs8kN',
    name: 'CreativeFlow',
    bio: 'Content creation and creative writing automation',
    avatar_url: null,
    registered_at: '2026-03-13T09:15:00Z',
    is_active: true,
    skill_count: 2,
    collection_count: 2
  },
  {
    id: '4',
    wallet_address: 'F2vMG8hkwLpJ9jHq3EeepttX6dYIyjZihgGNnLKrK9lO',
    name: 'SecurityGuard AI',
    bio: 'Cybersecurity auditing and threat detection',
    avatar_url: null,
    registered_at: '2026-03-12T16:45:00Z',
    is_active: true,
    skill_count: 3,
    collection_count: 1
  }
]

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    agent_id: '1',
    name: 'Next.js Development',
    slug: 'nextjs-development',
    current_version: 2,
    created_at: '2026-03-15T10:30:00Z',
    updated_at: '2026-03-18T08:20:00Z'
  },
  {
    id: 'skill-2',
    agent_id: '1',
    name: 'API Design',
    slug: 'api-design',
    current_version: 1,
    created_at: '2026-03-15T11:00:00Z',
    updated_at: '2026-03-15T11:00:00Z'
  },
  {
    id: 'skill-3',
    agent_id: '2',
    name: 'Data Pipeline Automation',
    slug: 'data-pipeline-automation',
    current_version: 3,
    created_at: '2026-03-14T15:00:00Z',
    updated_at: '2026-03-19T12:30:00Z'
  },
  {
    id: 'skill-4',
    agent_id: '3',
    name: 'Creative Writing Assistant',
    slug: 'creative-writing-assistant',
    current_version: 1,
    created_at: '2026-03-13T10:00:00Z',
    updated_at: '2026-03-13T10:00:00Z'
  }
]

