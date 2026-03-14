import React, { useState, useEffect } from 'react';
// Chart imports removed to fix build
/*
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
*/

interface PerformanceData {
  timestamp: string;
  profit: number;
  trades: number;
  winRate: number;
}

interface AnalyticsDashboardProps {
  agentId: string;
  timeframe?: '1d' | '7d' | '30d' | 'all';
}

export default function AnalyticsDashboard({ agentId, timeframe = '7d' }: AnalyticsDashboardProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'profit' | 'trades' | 'winRate'>('profit');

  // Simulated data - in production, fetch from API
  const mockData = [
    { timestamp: '2026-03-01', profit: 420.50, trades: 12, winRate: 68 },
    { timestamp: '2026-03-02', profit: 482.98, trades: 15, winRate: 71 },
    { timestamp: '2026-03-03', profit: 451.23, trades: 13, winRate: 65 },
    { timestamp: '2026-03-04', profit: 523.45, trades: 18, winRate: 72 },
    { timestamp: '2026-03-05', profit: 498.67, trades: 14, winRate: 69 },
    { timestamp: '2026-03-06', profit: 556.89, trades: 16, winRate: 75 },
    { timestamp: '2026-03-07', profit: 482.98, trades: 206, winRate: 68 }
  ];

  useEffect(() => {
    setPerformanceData(mockData);
  }, [agentId, timeframe]);

  const stats = {
    totalProfit: 482.98,
    totalTrades: 206,
    winRate: 68,
    avgTradeProfit: 2.35,
    bestTrade: 156.78,
    worstTrade: -89.45,
    profitFactor: 2.14,
    sharpeRatio: 1.87
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-effect p-4 rounded-xl border border-subtle">
          <div className="text-muted text-sm mb-1">Total Profit</div>
          <div className="text-2xl font-bold text-success">${stats.totalProfit.toFixed(2)}</div>
          <div className="text-xs text-success">+12.7% this week</div>
        </div>
        <div className="glass-effect p-4 rounded-xl border border-subtle">
          <div className="text-muted text-sm mb-1">Total Trades</div>
          <div className="text-2xl font-bold text-primary">{stats.totalTrades}</div>
          <div className="text-xs text-primary">+18 this week</div>
        </div>
        <div className="glass-effect p-4 rounded-xl border border-subtle">
          <div className="text-muted text-sm mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-blue-400">{stats.winRate}%</div>
          <div className="text-xs text-blue-400">Above target</div>
        </div>
        <div className="glass-effect p-4 rounded-xl border border-subtle">
          <div className="text-muted text-sm mb-1">Profit Factor</div>
          <div className="text-2xl font-bold text-violet-400">{stats.profitFactor}</div>
          <div className="text-xs text-violet-400">Excellent</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="glass-effect p-6 rounded-xl border border-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Performance Over Time</h3>
          <div className="flex gap-2">
            {(['profit', 'trades', 'winRate'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  selectedMetric === metric
                    ? 'bg-blue-500 text-white'
                    : 'glass-effect text-secondary hover:text-primary'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <div className="w-full h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <div className="text-xl font-bold text-green-400 mb-2">Analytics Dashboard</div>
              <div className="text-gray-400">Chart temporarily disabled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-effect p-6 rounded-xl border border-subtle">
          <h3 className="text-lg font-semibold text-primary mb-4">Trade Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Winning Trades</span>
              <span className="text-success font-semibold">140 (68%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Losing Trades</span>
              <span className="text-danger font-semibold">66 (32%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-danger h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-subtle">
          <h3 className="text-lg font-semibold text-primary mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Sharpe Ratio</span>
              <span className="text-primary font-semibold">{stats.sharpeRatio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Best Trade</span>
              <span className="text-success font-semibold">+${stats.bestTrade}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Worst Trade</span>
              <span className="text-danger font-semibold">-${Math.abs(stats.worstTrade)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Avg Trade</span>
              <span className="text-primary font-semibold">+${stats.avgTradeProfit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}