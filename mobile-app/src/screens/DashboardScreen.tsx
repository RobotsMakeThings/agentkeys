import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { Card } from '../components/Card';
import { GradientButton } from '../components/GradientButton';
import { useWalletStore } from '../services/walletStore';
import { usePortfolioStore } from '../services/portfolioStore';

const { width: screenWidth } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isConnected, connectWallet } = useWalletStore();
  const { portfolio, totalValue, change24h, refreshPortfolio, loading } = usePortfolioStore();
  const [refreshing, setRefreshing] = useState(false);

  // Mock chart data - replace with real data
  const chartData = {
    labels: ['1d', '7d', '30d', '90d', '1y'],
    datasets: [
      {
        data: [1200, 1580, 2100, 2850, 3200],
        strokeWidth: 2,
      },
    ],
  };

  const quickActions: QuickAction[] = [
    {
      id: 'buy',
      title: 'Buy Keys',
      icon: 'add-circle',
      color: '#22c55e',
      onPress: () => navigation.navigate('MainApp' as any, { screen: 'Trading' }),
    },
    {
      id: 'sell',
      title: 'Sell Keys',
      icon: 'remove-circle',
      color: '#ef4444',
      onPress: () => navigation.navigate('MainApp' as any, { screen: 'Trading' }),
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: 'search',
      color: '#3b82f6',
      onPress: () => navigation.navigate('MainApp' as any, { screen: 'Explore' }),
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      icon: 'pie-chart',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('MainApp' as any, { screen: 'Portfolio' }),
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPortfolio();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? '#22c55e' : '#ef4444';
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.connectContainer}>
          <Ionicons name="wallet-outline" size={80} color="#71717a" />
          <Text style={styles.connectTitle}>Connect Your Wallet</Text>
          <Text style={styles.connectDescription}>
            Connect your Solana wallet to start trading AI agent keys
          </Text>
          <GradientButton
            title="Connect Wallet"
            onPress={connectWallet}
            style={styles.connectButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.welcomeText}>Welcome to AgentKeys</Text>
      </View>

      {/* Portfolio Value */}
      <Card style={styles.valueCard}>
        <Text style={styles.valueLabel}>Total Portfolio Value</Text>
        <Text style={styles.valueAmount}>{formatCurrency(totalValue)}</Text>
        <View style={styles.changeContainer}>
          <Ionicons 
            name={change24h >= 0 ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={getChangeColor(change24h)} 
          />
          <Text style={[styles.changeText, { color: getChangeColor(change24h) }]}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
          </Text>
        </View>
      </Card>

      {/* Performance Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#040405',
            backgroundGradientTo: '#040405',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#0066ff',
            },
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { borderColor: action.color }]}
              onPress={action.onPress}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Top Holdings */}
      <Card style={styles.holdingsCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Holdings</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainApp' as any, { screen: 'Portfolio' })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {portfolio.slice(0, 3).map((holding, index) => (
          <TouchableOpacity
            key={holding.id}
            style={styles.holdingRow}
            onPress={() => navigation.navigate('AgentDetail', { agentId: holding.id })}
          >
            <View style={styles.holdingInfo}>
              <View style={[styles.agentIcon, { backgroundColor: holding.color }]}>
                <Text style={styles.agentIconText}>
                  {holding.symbol.substring(0, 2)}
                </Text>
              </View>
              <View>
                <Text style={styles.holdingName}>{holding.name}</Text>
                <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
              </View>
            </View>
            <View style={styles.holdingValue}>
              <Text style={styles.holdingAmount}>
                {formatCurrency(holding.value)}
              </Text>
              <Text style={[
                styles.holdingChange,
                { color: getChangeColor(holding.change24h) }
              ]}>
                {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(1)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Market Activity */}
      <Card style={styles.activityCard}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="add-circle" size={20} color="#22c55e" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Bought ResearchOS</Text>
              <Text style={styles.activityDescription}>10 keys • $24.10</Text>
            </View>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="trending-up" size={20} color="#3b82f6" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Price Alert</Text>
              <Text style={styles.activityDescription}>TradePilot +5.2%</Text>
            </View>
            <Text style={styles.activityTime}>4h ago</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040405',
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  connectDescription: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  connectButton: {
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  greeting: {
    fontSize: 16,
    color: '#71717a',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  valueCard: {
    margin: 20,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  valueLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 8,
  },
  valueAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  holdingsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#0066ff',
    fontSize: 14,
    fontWeight: '500',
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  holdingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  holdingName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  holdingSymbol: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  holdingAmount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  holdingChange: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  activityCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 32,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  activityDescription: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    color: '#71717a',
    fontSize: 12,
  },
});