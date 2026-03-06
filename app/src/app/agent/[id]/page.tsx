import { notFound } from 'next/navigation';
import EnhancedAgentDetail from '@/components/agent-detail/EnhancedAgentDetail';

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

interface AgentDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Agent Details - AgentKeys',
  description: 'Comprehensive agent profile with trading, analytics, and community data',
};

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const validAgents = ['research-os', 'trade-pilot', 'growth-loop', 'audit-mesh'];
  
  if (!validAgents.includes(params.id)) {
    notFound();
  }

  return <EnhancedAgentDetail agentId={params.id} />;
}