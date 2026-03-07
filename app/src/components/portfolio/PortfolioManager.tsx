import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, DollarSign, BarChart3 } from 'lucide-react';

interface Portfolio {
  agentId: string;
  agentName: string;
  symbol: string;
  keys: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  unrealizedPnl: number;
  pnlPercentage: number;
  lastTrade: string;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalUnrealizedPnl: number;
  totalPnlPercentage: number;
  bestPerformer: string;
  worstPerformer: string;
}

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Simulated portfolio data
  const mockPortfolios: Portfolio[] = [
    {
      agentId: 'oshi',
      agentName: 'Oshi',
      symbol: 'OSHI',
      keys: 50,
      avgBuyPrice: 3.85,
      currentPrice: 4.23,
      totalValue: 211.50,
      totalCost: 192.50,
      unrealizedPnl: 19.00,
      pnlPercentage: 9.87,
      lastTrade: '2026-03-07T10:30:00Z'
    },
    {
      agentId: 'kage',
      agentName: 'Kage',
      symbol: 'KAGE',
      keys: 75,
      avgBuyPrice: 1.72,
      currentPrice: 1.94,
      totalValue: 145.50,
      totalCost: 129.00,
      unrealizedPnl: 16.50,
      pnlPercentage: 12.79,
      lastTrade: '2026-03-06T15:45:00Z'
    },
    {
      agentId: 'sora',
      agentName: 'Sora',
      symbol: 'SORA',
      keys: 30,
      avgBuyPrice: 2.65,
      currentPrice: 2.87,
      totalValue: 86.10,
      totalCost: 79.50,
      unrealizedPnl: 6.60,
      pnlPercentage: 8.30,
      lastTrade: '2026-03-05T09:20:00Z'
    }
  ];

  useEffect(() => {
    setPortfolios(mockPortfolios);
    
    // Calculate summary
    const totalValue = mockPortfolios.reduce((sum, p) => sum + p.totalValue, 0);
    const totalCost = mockPortfolios.reduce((sum, p) => sum + p.totalCost, 0);
    const totalUnrealizedPnl = totalValue - totalCost;
    const totalPnlPercentage = (totalUnrealizedPnl / totalCost) * 100;
    
    const sortedByPnl = [...mockPortfolios].sort((a, b) => b.pnlPercentage - a.pnlPercentage);
    
    setSummary({
      totalValue,
      totalCost,
      totalUnrealizedPnl,
      totalPnlPercentage,
      bestPerformer: sortedByPnl[0].agentName,
      worstPerformer: sortedByPnl[sortedByPnl.length - 1].agentName
    });
  }, [selectedTimeframe]);

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return 'text-success';
    if (pnl < 0) return 'text-danger';
    return 'text-secondary';
  };

  const getPnlIcon = (pnl: number) => {
    if (pnl > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (pnl < 0) return <TrendingDown className="w-4 h-4 text-danger" />;
    return <Minus className="w-4 h-4 text-secondary" />;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="glass-effect p-6 rounded-xl border border-subtle">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">Portfolio Overview</h2>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-blue-500 text-white'
                    : 'glass-effect text-secondary hover:text-primary'
                }`}
              >
                {tf === 'all' ? 'All Time' : tf}
              </button>
            ))}
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-muted text-sm mb-1">Total Value</div>
              <div className="text-2xl font-bold text-primary">
                ${summary.totalValue.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-muted text-sm mb-1">Total Cost</div>
              <div className="text-2xl font-bold text-secondary">
                ${summary.totalCost.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-muted text-sm mb-1">Unrealized P&L</div>
              <div className={`text-2xl font-bold ${getPnlColor(summary.totalUnrealizedPnl)}`}>
                {summary.totalUnrealizedPnl >= 0 ? '+' : ''}${summary.totalUnrealizedPnl.toFixed(2)}
              </div>
              <div className={`text-sm ${getPnlColor(summary.totalUnrealizedPnl)}`}>
                ({summary.totalPnlPercentage >= 0 ? '+' : ''}{summary.totalPnlPercentage.toFixed(2)}%)
              </div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="text-muted text-sm mb-1">Best Performer</div>
              <div className="text-lg font-bold text-success">
                {summary.bestPerformer}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Holdings Table */}
      <div className="glass-effect rounded-xl border border-subtle overflow-hidden">
        <div className="p-6 border-b border-subtle">
          <h3 className="text-lg font-semibold text-primary">Your Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Keys</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Avg Buy</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {portfolios.map((portfolio) => (
                <tr key={portfolio.agentId} className="hover:bg-elevated transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {portfolio.symbol[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-primary">{portfolio.agentName}</div>
                        <div className="text-xs text-muted">{portfolio.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-primary">
                    {portfolio.keys}
                  </td>
                  <td className="px-6 py-4 text-right text-secondary">
                    ${portfolio.avgBuyPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-primary">
                    ${portfolio.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-primary">
                    ${portfolio.totalValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${getPnlColor(portfolio.unrealizedPnl)}`}>
                      {getPnlIcon(portfolio.unrealizedPnl)}
                      <span className="font-medium">
                        {portfolio.unrealizedPnl >= 0 ? '+' : ''}${portfolio.unrealizedPnl.toFixed(2)}
                      </span>
                      <span className="text-xs">
                        ({portfolio.pnlPercentage >= 0 ? '+' : ''}{portfolio.pnlPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="glass-effect p-4 rounded-xl border border-subtle hover:bg-elevated transition-all text-center">
          <DollarSign className="w-6 h-6 text-success mx-auto mb-2" />
          <div className="text-sm font-medium text-primary">Deposit</div>
        </button>
        <button className="glass-effect p-4 rounded-xl border border-subtle hover:bg-elevated transition-all text-center">
          <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-primary">Rebalance</div>
        </button>
        <button className="glass-effect p-4 rounded-xl border border-subtle hover:bg-elevated transition-all text-center">
          <BarChart3 className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-primary">Analytics</div>
        </button>
        <button className="glass-effect p-4 rounded-xl border border-subtle hover:bg-elevated transition-all text-center">
          <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-sm font-medium text-primary">History</div>
        </button>
      </div>
    </div>
  );
}