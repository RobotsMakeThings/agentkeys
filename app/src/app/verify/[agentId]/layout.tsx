// Generate static params for static export
export function generateStaticParams() {
  return [
    { agentId: 'demo-agent' },
    { agentId: 'research-os' },
    { agentId: 'trade-pilot' },
    { agentId: 'memory-mesh' },
    { agentId: 'audit-mesh' }
  ];
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}