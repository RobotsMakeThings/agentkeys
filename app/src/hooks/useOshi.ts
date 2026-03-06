import { useState, useEffect, useCallback } from 'react';

interface TradingStats {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    averageProfit: number;
    bestDay: number;
    worstDay: number;
    currentStreak: number;
    maxDrawdown: number;
    sharpeRatio?: number;
    lastTradeTime?: string;
    isOnline: boolean;
}

interface SocialMetrics {
    twitterFollowers: number;
    twitterEngagement: number;
    recentTweets: number;
    lastTweetTime?: string;
    githubStars: number;
    githubCommits: number;
    lastCommitTime?: string;
}

interface OshiAgentData {
    name: string;
    symbol: string;
    description: string;
    category: string;
    creator: string;
    githubUrl: string;
    twitterHandle: string;
    launchDate: string;
    codeScore: number;
    socialScore: number;
    agentScore: number;
    performanceScore: number;
    tradingStats: TradingStats;
    socialMetrics: SocialMetrics;
    currentPrice: number;
    marketCap: number;
    totalKeys: number;
    holders: number;
    volume24h: number;
    priceChange24h: number;
}

interface RealtimeUpdate {
    isTrading: boolean;
    currentPosition?: string;
    lastUpdate: string;
    nextScanTime?: string;
}

const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://api.agentkeys.xyz' 
    : 'http://localhost:3001';

export const useOshi = () => {
    const [oshiData, setOshiData] = useState<OshiAgentData | null>(null);
    const [realtimeData, setRealtimeData] = useState<RealtimeUpdate | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchOshiData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/api/oshi`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch Oshi data: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setOshiData(result.data);
                setLastUpdated(new Date());
                setError(null);
            } else {
                throw new Error(result.error || 'Failed to fetch Oshi data');
            }
        } catch (err) {
            console.error('Error fetching Oshi data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRealtimeData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/oshi/realtime`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch realtime data: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setRealtimeData(result.data);
            }
        } catch (err) {
            console.error('Error fetching realtime data:', err);
        }
    }, []);

    const fetchTradingStats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/oshi/trading-stats`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch trading stats: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Update just the trading stats portion
                setOshiData(prev => prev ? { ...prev, tradingStats: result.data } : null);
            }
        } catch (err) {
            console.error('Error fetching trading stats:', err);
        }
    }, []);

    const fetchSocialMetrics = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/oshi/social-metrics`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch social metrics: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Update just the social metrics portion
                setOshiData(prev => prev ? { ...prev, socialMetrics: result.data } : null);
            }
        } catch (err) {
            console.error('Error fetching social metrics:', err);
        }
    }, []);

    const refreshData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/oshi/refresh`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to refresh data: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setOshiData(result.data);
                setLastUpdated(new Date());
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error refreshing data:', err);
            return false;
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchOshiData();
    }, [fetchOshiData]);

    // Set up real-time updates
    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimer: NodeJS.Timeout | null = null;

        const connectWebSocket = () => {
            try {
                const wsUrl = API_BASE.replace('http', 'ws') + '/ws';
                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log('WebSocket connected');
                    
                    // Subscribe to Oshi real-time updates
                    ws?.send(JSON.stringify({
                        type: 'subscribe',
                        data: { channel: 'oshi:realtime' }
                    }));

                    ws?.send(JSON.stringify({
                        type: 'subscribe', 
                        data: { channel: 'agent:oshi-flagship' }
                    }));
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        
                        switch (message.type) {
                            case 'oshi_update':
                            case 'oshi_realtime':
                                if (message.data) {
                                    setRealtimeData(message.data);
                                    
                                    // Update trading stats if included
                                    if (message.data.tradingStats) {
                                        setOshiData(prev => prev ? {
                                            ...prev,
                                            tradingStats: message.data.tradingStats,
                                            currentPrice: message.data.currentPrice || prev.currentPrice,
                                            marketCap: message.data.marketCap || prev.marketCap
                                        } : null);
                                    }
                                }
                                break;

                            case 'oshi_trade':
                                // Handle new trading activity
                                fetchTradingStats();
                                break;

                            case 'price_update':
                                // Handle price updates
                                if (message.data.agentId === 'oshi-flagship') {
                                    setOshiData(prev => prev ? {
                                        ...prev,
                                        currentPrice: message.data.price,
                                        marketCap: message.data.marketCap,
                                        totalKeys: message.data.totalKeys,
                                        holders: message.data.holders
                                    } : null);
                                }
                                break;
                        }
                    } catch (err) {
                        console.error('Error parsing WebSocket message:', err);
                    }
                };

                ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    
                    // Attempt reconnection after 5 seconds
                    reconnectTimer = setTimeout(() => {
                        connectWebSocket();
                    }, 5000);
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

            } catch (err) {
                console.error('Error connecting WebSocket:', err);
                
                // Retry connection after 5 seconds
                reconnectTimer = setTimeout(() => {
                    connectWebSocket();
                }, 5000);
            }
        };

        // Connect WebSocket
        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (ws) {
                ws.close();
            }
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }
        };
    }, [fetchTradingStats]);

    // Periodic data refresh (every 5 minutes for non-real-time data)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchSocialMetrics(); // Social metrics update less frequently
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchSocialMetrics]);

    // Realtime data refresh (every 30 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchRealtimeData();
        }, 30 * 1000);

        return () => clearInterval(interval);
    }, [fetchRealtimeData]);

    return {
        oshiData,
        realtimeData,
        isLoading,
        error,
        lastUpdated,
        refreshData,
        fetchTradingStats,
        fetchSocialMetrics,
        fetchRealtimeData
    };
};

// Helper hook for just trading stats (lightweight)
export const useOshiTradingStats = () => {
    const [tradingStats, setTradingStats] = useState<TradingStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTradingStats = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/api/oshi/trading-stats`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch trading stats: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setTradingStats(result.data);
                setError(null);
            } else {
                throw new Error(result.error || 'Failed to fetch trading stats');
            }
        } catch (err) {
            console.error('Error fetching trading stats:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTradingStats();
        
        // Refresh every minute
        const interval = setInterval(fetchTradingStats, 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchTradingStats]);

    return {
        tradingStats,
        isLoading,
        error,
        refresh: fetchTradingStats
    };
};