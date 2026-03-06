import { notFound } from 'next/navigation';
import AgentHubClient from '@/components/AgentHubClient';

// Generate static params for the dynamic route
export function generateStaticParams() {
  // For now, generate static params for our demo agents
  return [
    { id: 'research-os' },
    { id: 'trade-pilot' },
    { id: 'growth-loop' },
    { id: 'audit-mesh' },
  ];
}

interface AgentHubPageProps {
  params: {
    id: string;
  };
}

export default function AgentHubPage({ params }: AgentHubPageProps) {
  const validAgents = ['research-os', 'trade-pilot', 'growth-loop', 'audit-mesh'];
  
  if (!validAgents.includes(params.id)) {
    notFound();
  }

  return <AgentHubClient agentId={params.id} />;
}