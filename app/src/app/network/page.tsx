'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Filter, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  category: string;
  value: number;
  x: number;
  y: number;
  radius: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'payment' | 'ownership' | 'usage';
  value?: number;
}

export default function NetworkPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Mock network data
  const [nodes] = useState<GraphNode[]>([
    { id: 'research-os', label: 'ResearchOS', category: 'research', value: 93, x: 400, y: 200, radius: 25 },
    { id: 'trade-pilot', label: 'TradePilot', category: 'trading', value: 91, x: 600, y: 300, radius: 23 },
    { id: 'memory-mesh', label: 'MemoryMesh', category: 'infrastructure', value: 92, x: 300, y: 400, radius: 24 },
    { id: 'audit-mesh', label: 'AuditMesh', category: 'security', value: 91, x: 700, y: 200, radius: 23 },
    { id: 'design-synth', label: 'DesignSynth', category: 'creative', value: 79, x: 500, y: 500, radius: 18 },
    { id: 'growth-loop', label: 'GrowthLoop', category: 'marketing', value: 73, x: 200, y: 300, radius: 16 },
  ]);

  const [edges] = useState<GraphEdge[]>([
    { id: 'e1', source: 'research-os', target: 'memory-mesh', type: 'usage', value: 15 },
    { id: 'e2', source: 'trade-pilot', target: 'research-os', type: 'dependency', value: 8 },
    { id: 'e3', source: 'audit-mesh', target: 'memory-mesh', type: 'usage', value: 12 },
    { id: 'e4', source: 'design-synth', target: 'memory-mesh', type: 'usage', value: 5 },
    { id: 'e5', source: 'growth-loop', target: 'design-synth', type: 'dependency', value: 3 },
    { id: 'e6', source: 'trade-pilot', target: 'audit-mesh', type: 'payment', value: 20 },
  ]);

  const getCategoryColor = (category: string) => {
    const colors = {
      research: '#0066FF',
      trading: '#22C55E', 
      infrastructure: '#A855F7',
      security: '#EF4444',
      creative: '#F59E0B',
      marketing: '#38BDF8',
    };
    return colors[category as keyof typeof colors] || '#71717A';
  };

  const getEdgeColor = (type: string) => {
    const colors = {
      dependency: '#0066FF',
      payment: '#22C55E',
      ownership: '#A855F7',
      usage: '#38BDF8',
    };
    return colors[type as keyof typeof colors] || '#71717A';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw edges
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = getEdgeColor(edge.type);
          ctx.lineWidth = Math.max(1, (edge.value || 1) / 5);
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
          
          // Draw arrow
          const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
          const arrowLength = 10;
          const arrowX = targetNode.x - Math.cos(angle) * (targetNode.radius + 5);
          const arrowY = targetNode.y - Math.sin(angle) * (targetNode.radius + 5);
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowLength * Math.cos(angle - Math.PI / 6), arrowY - arrowLength * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(arrowX - arrowLength * Math.cos(angle + Math.PI / 6), arrowY - arrowLength * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fillStyle = getEdgeColor(edge.type);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius + 10);
        gradient.addColorStop(0, `${getCategoryColor(node.category)}40`);
        gradient.addColorStop(1, `${getCategoryColor(node.category)}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = selectedNode?.id === node.id ? getCategoryColor(node.category) : '#121318';
        ctx.fill();
        ctx.strokeStyle = getCategoryColor(node.category);
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 2;
        ctx.stroke();
        
        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
        
        // Capability score
        ctx.fillStyle = getCategoryColor(node.category);
        ctx.font = 'bold 10px Inter';
        ctx.fillText(node.value.toString(), node.x, node.y + 3);
      });

      ctx.restore();
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw();
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - pan.x) / zoom;
      const y = (event.clientY - rect.top - pan.y) / zoom;
      
      const clickedNode = nodes.find(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= node.radius;
      });
      
      setSelectedNode(clickedNode || null);
      draw();
    };

    resizeCanvas();
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes, edges, selectedNode, zoom, pan]);

  return (
    <div className="flex h-screen">
      {/* Main Graph Area */}
      <div className="flex-1 relative">
        {/* Graph Header */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
          <div className="glass-effect px-4 py-2 rounded-lg border border-subtle">
            <h1 className="text-lg font-semibold text-primary">Agent Network</h1>
            <p className="text-xs text-muted">Visualizing the agent economy</p>
          </div>
          
          <div className="glass-effect px-3 py-2 rounded-lg border border-subtle">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-secondary">Live Network</span>
            </div>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button 
            onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
            className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-secondary" />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.3))}
            className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-secondary" />
          </button>
          <button 
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-secondary" />
          </button>
          <button className="p-2 glass-effect border border-subtle hover:bg-elevated rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-secondary" />
          </button>
        </div>

        {/* Graph Legend */}
        <div className="absolute bottom-4 left-4 z-10 glass-effect p-4 rounded-lg border border-subtle">
          <h3 className="text-sm font-semibold text-primary mb-3">Network Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-secondary">Dependencies</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-secondary">Payments</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-info" />
              <span className="text-secondary">Usage</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-violet-400" />
              <span className="text-secondary">Ownership</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full bg-canvas cursor-pointer"
        />
      </div>

      {/* Node Detail Sidebar */}
      {selectedNode && (
        <div className="w-80 glass-effect border-l border-subtle p-6">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${getCategoryColor(selectedNode.category)}20` }}
            >
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">{selectedNode.label}</h3>
              <p className="text-sm text-secondary capitalize">{selectedNode.category}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-effect p-4 rounded-lg border border-subtle">
              <div className="text-2xl font-bold text-primary mb-1">{selectedNode.value}</div>
              <div className="text-sm text-muted">Capability Score</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">Connections</h4>
              {edges
                .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                .map(edge => {
                  const connectedNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                  const connectedNode = nodes.find(n => n.id === connectedNodeId);
                  const isOutgoing = edge.source === selectedNode.id;
                  
                  return (
                    <div key={edge.id} className="flex items-center justify-between p-3 glass-effect rounded-lg border border-subtle">
                      <div>
                        <div className="text-sm font-medium text-primary">{connectedNode?.label}</div>
                        <div className="text-xs text-muted">
                          {isOutgoing ? 'Outgoing' : 'Incoming'} {edge.type}
                        </div>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getEdgeColor(edge.type) }}
                      />
                    </div>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-subtle">
              <button 
                onClick={() => window.location.href = `/agents/${selectedNode.id}`}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium rounded-lg hover:shadow-lg transition-all neural-glow"
              >
                View Agent Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}