'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  FileText, 
  UserPlus, 
  Bell,
  Filter,
  X,
  Bot,
  DollarSign,
  Users,
  Clock,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { usePushNotifications, NotificationTypes, createAgentKeysNotification } from '@/hooks/usePushNotifications';

interface ActivityItem {
  id: string;
  type: 'key_purchase' | 'key_sale' | 'new_content' | 'agent_update' | 'price_change' | 'new_member' | 'message';
  timestamp: number;
  agentId: string;
  agentName: string;
  agentSymbol: string;
  userId?: string;
  userName?: string;
  amount?: number;
  price?: number;
  priceChange?: number;
  message?: string;
  contentTitle?: string;
  isImportant?: boolean;
  isRead?: boolean;
}

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
  showFilterControls?: boolean;
  autoRefresh?: boolean;
}

export default function ActivityFeed({ 
  className = '', 
  maxItems = 50, 
  showFilterControls = true,
  autoRefresh = true 
}: ActivityFeedProps) {
  const { publicKey } = useWallet();
  const { showNotification, permission } = usePushNotifications();
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showFilters, setShowFiltersPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Mock data for demonstration - replace with real API calls
  const mockActivities: ActivityItem[] = useMemo(() => [
    {
      id: '1',
      type: 'key_purchase',
      timestamp: Date.now() - 300000, // 5 minutes ago
      agentId: 'research-os',
      agentName: 'ResearchOS',
      agentSymbol: 'RSCH',
      userId: '0x1234...5678',
      userName: 'CryptoTrader',
      amount: 5,
      price: 2.41,
      isImportant: true,
      isRead: false,
    },
    {
      id: '2',
      type: 'price_change',
      timestamp: Date.now() - 600000, // 10 minutes ago
      agentId: 'trade-pilot',
      agentName: 'TradePilot',
      agentSymbol: 'TRADE',
      priceChange: 18.4,
      price: 4.83,
      isImportant: true,
      isRead: false,
    },
    {
      id: '3',
      type: 'new_content',
      timestamp: Date.now() - 1200000, // 20 minutes ago
      agentId: 'research-os',
      agentName: 'ResearchOS',
      agentSymbol: 'RSCH',
      contentTitle: 'Advanced Market Analysis Toolkit',
      isImportant: false,
      isRead: true,
    },
    {
      id: '4',
      type: 'key_sale',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      agentId: 'audit-mesh',
      agentName: 'AuditMesh',
      agentSymbol: 'AUDIT',
      userId: '0x8765...4321',
      userName: 'SecurityExpert',
      amount: 2,
      price: 5.21,
      isImportant: false,
      isRead: true,
    },
    {
      id: '5',
      type: 'agent_update',
      timestamp: Date.now() - 3600000, // 1 hour ago
      agentId: 'growth-loop',
      agentName: 'GrowthLoop',
      agentSymbol: 'GROW',
      message: 'New automation features added for campaign optimization',
      isImportant: false,
      isRead: true,
    },
    {
      id: '6',
      type: 'new_member',
      timestamp: Date.now() - 7200000, // 2 hours ago
      agentId: 'research-os',
      agentName: 'ResearchOS',
      agentSymbol: 'RSCH',
      userId: '0x9876...1234',
      userName: 'DataScientist',
      isImportant: false,
      isRead: true,
    }
  ], []);

  // Load activities (mock data for now)
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
      
      // Count unread items
      const unread = mockActivities.filter(item => !item.isRead).length;
      setUnreadCount(unread);
    }, 1000);
  }, [mockActivities]);

  // Auto-refresh activities
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
      
      // Simulate new activity (in real app, this would be a WebSocket update)
      if (Math.random() > 0.7) { // 30% chance of new activity
        const newActivity: ActivityItem = {
          id: `new-${Date.now()}`,
          type: 'price_change',
          timestamp: Date.now(),
          agentId: 'trade-pilot',
          agentName: 'TradePilot',
          agentSymbol: 'TRADE',
          priceChange: Math.random() > 0.5 ? 5.2 : -3.1,
          price: 4.83,
          isImportant: true,
          isRead: false,
        };
        
        setActivities(prev => [newActivity, ...prev].slice(0, maxItems));
        setUnreadCount(prev => prev + 1);
        
        // Show push notification if enabled
        if (permission === 'granted' && showNotification) {
          const notification = createAgentKeysNotification(
            NotificationTypes.PRICE_ALERT,
            {
              agentName: newActivity.agentName,
              message: `Price ${newActivity.priceChange! > 0 ? 'increased' : 'decreased'}`,
              percentage: newActivity.priceChange,
              url: `/agent/${newActivity.agentId}`
            }
          );
          showNotification(notification.title, notification);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, maxItems, permission, showNotification]);

  // Filter activities
  useEffect(() => {
    let filtered = activities;
    
    if (!activeFilters.includes('all')) {
      filtered = activities.filter(activity => 
        activeFilters.includes(activity.type)
      );
    }
    
    setFilteredActivities(filtered.slice(0, maxItems));
  }, [activities, activeFilters, maxItems]);

  const filterOptions = [
    { key: 'all', label: 'All Activities', icon: Bell },
    { key: 'key_purchase', label: 'Key Purchases', icon: TrendingUp },
    { key: 'key_sale', label: 'Key Sales', icon: TrendingDown },
    { key: 'price_change', label: 'Price Changes', icon: DollarSign },
    { key: 'new_content', label: 'New Content', icon: FileText },
    { key: 'agent_update', label: 'Agent Updates', icon: Bot },
    { key: 'new_member', label: 'New Members', icon: UserPlus },
    { key: 'message', label: 'Messages', icon: MessageSquare },
  ];

  const toggleFilter = (filterKey: string) => {
    if (filterKey === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(filterKey)) {
          const updated = newFilters.filter(f => f !== filterKey);
          return updated.length === 0 ? ['all'] : updated;
        } else {
          return [...newFilters, filterKey];
        }
      });
    }
  };

  const markAsRead = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isRead: true }
          : activity
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setActivities(prev => 
      prev.map(activity => ({ ...activity, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'key_purchase': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'key_sale': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'price_change': return <DollarSign className="h-4 w-4 text-blue-400" />;
      case 'new_content': return <FileText className="h-4 w-4 text-purple-400" />;
      case 'agent_update': return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'new_member': return <UserPlus className="h-4 w-4 text-green-400" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'key_purchase':
        return `${activity.userName} bought ${activity.amount} keys for ${activity.price} SOL each`;
      case 'key_sale':
        return `${activity.userName} sold ${activity.amount} keys at ${activity.price} SOL each`;
      case 'price_change':
        return `Price ${activity.priceChange! > 0 ? 'increased' : 'decreased'} by ${Math.abs(activity.priceChange!)}% to ${activity.price} SOL`;
      case 'new_content':
        return `New premium content: "${activity.contentTitle}"`;
      case 'agent_update':
        return activity.message || 'Agent has been updated';
      case 'new_member':
        return `${activity.userName} joined the community`;
      case 'message':
        return activity.message || 'New message in community';
      default:
        return 'Activity update';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`bg-gray-800/50 rounded-2xl border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-cyan-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Activity Feed</h3>
            <p className="text-sm text-gray-400">
              {filteredActivities.length} activities
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLastUpdate(Date.now())}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Refresh"
          >
            <Zap className="h-4 w-4" />
          </button>
          
          {showFilterControls && (
            <button
              onClick={() => setShowFiltersPanel(!showFilters)}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              title="Mark all as read"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilterControls && showFilters && (
        <div className="border-b border-gray-700 p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeFilters.includes(option.key);
              
              return (
                <button
                  key={option.key}
                  onClick={() => toggleFilter(option.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No activities to show</p>
            <p className="text-sm text-gray-500 mt-2">
              {activeFilters.includes('all') 
                ? 'Check back later for updates' 
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => !activity.isRead && markAsRead(activity.id)}
                className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  !activity.isRead ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.isImportant ? 'bg-orange-500/20' : 'bg-gray-700'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {activity.agentName}
                      </span>
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-700 rounded-full">
                        {activity.agentSymbol}
                      </span>
                      {activity.isImportant && (
                        <span className="text-xs text-orange-400">Important</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">
                      {getActivityDescription(activity)}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                      
                      {!activity.isRead && (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Eye className="h-3 w-3" />
                          Unread
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
          {autoRefresh && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live updates
            </span>
          )}
        </div>
      </div>
    </div>
  );
}