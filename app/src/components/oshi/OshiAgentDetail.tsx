'use client';

import React from 'react';
import { useOshi } from '@/hooks/useOshi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
    Activity, 
    TrendingUp, 
    DollarSign, 
    Target, 
    GitBranch, 
    Twitter, 
    ExternalLink,
    RefreshCw,
    Circle,
    BarChart3,
    Zap
} from 'lucide-react';

const OshiAgentDetail: React.FC = () => {
    const { oshiData, realtimeData, isLoading, error, lastUpdated, refreshData } = useOshi();

    if (isLoading && !oshiData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Oshi agent data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !oshiData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">Error loading Oshi data: {error}</p>
                            <Button onClick={refreshData} variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!oshiData) {
        return <div>No data available</div>;
    }

    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatPercentage = (decimal: number) => {
        return `${(decimal * 100).toFixed(1)}%`;
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">🎯</span>
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold">{oshiData.name}</h1>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                {oshiData.symbol}
                            </Badge>
                            {realtimeData?.isTrading && (
                                <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">
                                    <Circle className="w-2 h-2 mr-1 fill-current" />
                                    LIVE
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-600 text-lg max-w-2xl">{oshiData.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{oshiData.category}</Badge>
                            <span className="text-sm text-gray-500">
                                by {oshiData.creator}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(oshiData.currentPrice)}
                    </div>
                    <div className={`text-lg font-semibold ${
                        oshiData.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {oshiData.priceChange24h >= 0 ? '+' : ''}
                        {formatPercentage(oshiData.priceChange24h / 100)} (24h)
                    </div>
                    <Button 
                        onClick={refreshData} 
                        variant="outline" 
                        size="sm"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Market Cap</p>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(oshiData.marketCap)}
                                </div>
                            </div>
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatPercentage(oshiData.tradingStats.winRate)}
                                </div>
                            </div>
                            <Target className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(oshiData.tradingStats.totalProfit)}
                                </div>
                            </div>
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                                <div className="text-2xl font-bold">
                                    {oshiData.tradingStats.totalTrades.toLocaleString()}
                                </div>
                            </div>
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Capability Scores */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>Agent Capabilities</span>
                    </CardTitle>
                    <CardDescription>
                        Real-time scoring based on code quality, social presence, agent integration, and trading performance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">CODE</span>
                                <span className="text-sm font-bold">{oshiData.codeScore}/100</span>
                            </div>
                            <Progress value={oshiData.codeScore} className="h-2" />
                            <p className="text-xs text-gray-500">GitHub activity & code quality</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">SOCIAL</span>
                                <span className="text-sm font-bold">{oshiData.socialScore}/100</span>
                            </div>
                            <Progress value={oshiData.socialScore} className="h-2" />
                            <p className="text-xs text-gray-500">Twitter engagement & reach</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">AGENT</span>
                                <span className="text-sm font-bold">{oshiData.agentScore}/100</span>
                            </div>
                            <Progress value={oshiData.agentScore} className="h-2" />
                            <p className="text-xs text-gray-500">Ecosystem integration</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">PERFORMANCE</span>
                                <span className="text-sm font-bold text-green-600">{oshiData.performanceScore}/100</span>
                            </div>
                            <Progress value={oshiData.performanceScore} className="h-2" />
                            <p className="text-xs text-gray-500">Trading results & profitability</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Tabs defaultValue="trading" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="trading">Trading Performance</TabsTrigger>
                    <TabsTrigger value="social">Social Metrics</TabsTrigger>
                    <TabsTrigger value="realtime">Real-time Status</TabsTrigger>
                    <TabsTrigger value="about">About Agent</TabsTrigger>
                </TabsList>

                <TabsContent value="trading" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Average Profit per Trade</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(oshiData.tradingStats.averageProfit)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Best Single Day</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(oshiData.tradingStats.bestDay)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Current Streak</span>
                                    <span className="font-semibold">
                                        {oshiData.tradingStats.currentStreak} trades
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Max Drawdown</span>
                                    <span className="font-semibold text-red-600">
                                        {formatCurrency(oshiData.tradingStats.maxDrawdown)}
                                    </span>
                                </div>
                                {oshiData.tradingStats.sharpeRatio && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Sharpe Ratio</span>
                                        <span className="font-semibold">
                                            {formatNumber(oshiData.tradingStats.sharpeRatio, 2)}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Market Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Keys</span>
                                    <span className="font-semibold">{oshiData.totalKeys.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Holders</span>
                                    <span className="font-semibold">{oshiData.holders.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">24h Volume</span>
                                    <span className="font-semibold">{formatCurrency(oshiData.volume24h)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Last Trade</span>
                                    <span className="font-semibold text-xs">
                                        {oshiData.tradingStats.lastTradeTime 
                                            ? new Date(oshiData.tradingStats.lastTradeTime).toLocaleString()
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Twitter className="h-5 w-5 text-blue-400" />
                                    <span>Twitter Presence</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Followers</span>
                                    <span className="font-semibold">{oshiData.socialMetrics.twitterFollowers.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Engagement Rate</span>
                                    <span className="font-semibold">{formatPercentage(oshiData.socialMetrics.twitterEngagement)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Recent Tweets</span>
                                    <span className="font-semibold">{oshiData.socialMetrics.recentTweets}</span>
                                </div>
                                <a href={`https://twitter.com/${oshiData.twitterHandle.replace('@', '')}`} 
                                   target="_blank" rel="noopener noreferrer"
                                   className="w-full inline-flex items-center justify-center px-4 py-2 border border-subtle text-primary bg-transparent hover:bg-elevated/50 rounded-lg font-medium transition-all">
                                    <Twitter className="w-4 h-4 mr-2" />
                                    Follow on Twitter
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <GitBranch className="h-5 w-5" />
                                    <span>GitHub Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Repository Stars</span>
                                    <span className="font-semibold">{oshiData.socialMetrics.githubStars}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Commits</span>
                                    <span className="font-semibold">{oshiData.socialMetrics.githubCommits.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Last Commit</span>
                                    <span className="font-semibold text-xs">
                                        {oshiData.socialMetrics.lastCommitTime 
                                            ? new Date(oshiData.socialMetrics.lastCommitTime).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                                <a href={oshiData.githubUrl} target="_blank" rel="noopener noreferrer"
                                   className="w-full inline-flex items-center justify-center px-4 py-2 border border-subtle text-primary bg-transparent hover:bg-elevated/50 rounded-lg font-medium transition-all">
                                    <GitBranch className="w-4 h-4 mr-2" />
                                    View Repository
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="realtime" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                <span>Live Trading Status</span>
                            </CardTitle>
                            <CardDescription>
                                Real-time monitoring of Oshi's trading operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        realtimeData?.isTrading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                    }`}></div>
                                    <span className="font-medium">
                                        {realtimeData?.isTrading ? 'Active Trading' : 'Standby Mode'}
                                    </span>
                                </div>
                                <Badge variant={realtimeData?.isTrading ? "default" : "secondary"}>
                                    {oshiData.tradingStats.isOnline ? 'ONLINE' : 'OFFLINE'}
                                </Badge>
                            </div>

                            {realtimeData?.currentPosition && (
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Current Position</h4>
                                    <p className="text-sm text-gray-600">{realtimeData.currentPosition}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Last Update</h4>
                                    <p className="text-sm text-gray-600">
                                        {realtimeData?.lastUpdate 
                                            ? new Date(realtimeData.lastUpdate).toLocaleString()
                                            : 'N/A'
                                        }
                                    </p>
                                </div>
                                
                                {realtimeData?.nextScanTime && (
                                    <div>
                                        <h4 className="font-medium mb-2">Next Scan</h4>
                                        <p className="text-sm text-gray-600">
                                            {new Date(realtimeData.nextScanTime).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Oshi</CardTitle>
                            <CardDescription>
                                The flagship trading agent demonstrating real AI-driven profitability
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Strategy Overview</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Oshi specializes in 15-minute BTC prediction markets on Kalshi using the proven T1/T2 strategy.
                                    The system analyzes trend direction with confluence indicators to achieve a 68% win rate.
                                    Key features include automated compounding, risk management, and real-time performance tracking.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Technical Architecture</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• T1: Trend + Confluence (≥2/4 indicators)</li>
                                    <li>• T2: Strong Momentum Override (≥0.05%)</li>
                                    <li>• 4-Indicator System: PSAR + RSI + Momentum + Bollinger Bands</li>
                                    <li>• Automated position sizing with compounding logic</li>
                                    <li>• Real-time Discord and Telegram notifications</li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-gray-500">
                                    Data last updated: {lastUpdated?.toLocaleString() || 'Unknown'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OshiAgentDetail;