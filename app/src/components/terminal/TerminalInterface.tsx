'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Command, History, RefreshCw, Settings, Activity } from 'lucide-react';
import { useAgentKeys } from '@/hooks/useAgentKeys';
import { useWallet } from '@solana/wallet-adapter-react';

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface TerminalTheme {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const TERMINAL_THEMES: TerminalTheme[] = [
  { name: 'Matrix', primaryColor: '#00ff41', backgroundColor: '#0d1117', textColor: '#00ff41', accentColor: '#39ff14' },
  { name: 'Neural', primaryColor: '#0066ff', backgroundColor: '#040405', textColor: '#ffffff', accentColor: '#7c5cff' },
  { name: 'Cyber', primaryColor: '#ff0080', backgroundColor: '#1a0033', textColor: '#ff69b4', accentColor: '#ffb3d9' },
  { name: 'Neon', primaryColor: '#00ffff', backgroundColor: '#001122', textColor: '#00ffff', accentColor: '#66ffff' },
];

const COMMAND_SUGGESTIONS = [
  '/help - Show all available commands',
  '/buy SYMBOL AMOUNT - Purchase agent keys',
  '/sell SYMBOL AMOUNT - Sell agent keys', 
  '/portfolio - View your holdings',
  '/agents - List all agents',
  '/search QUERY - Find agents by name',
  '/stats SYMBOL - Agent statistics',
  '/leaderboard - Top performing agents',
  '/monitor SYMBOL - Real-time monitoring',
  '/history - Command history',
  '/theme - Change terminal theme',
  '/clear - Clear terminal',
];

export default function TerminalInterface() {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [monitoringAgents, setMonitoringAgents] = useState<Set<string>>(new Set());
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { connected } = useWallet();
  const { fetchAgent, getBuyPrice, getSellPrice } = useAgentKeys();

  const theme = TERMINAL_THEMES[currentTheme];

  useEffect(() => {
    // Auto-focus terminal input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Add welcome message
    if (commands.length === 0) {
      addCommand({
        id: 'welcome',
        command: 'system',
        output: `Welcome to AgentKeys Terminal v2.0
========================================
Type '/help' for available commands
Press TAB for auto-completion
Use ↑↓ keys for command history

Status: ${connected ? 'Wallet Connected' : 'Wallet Not Connected'}`,
        timestamp: new Date(),
        type: 'info'
      });
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    // Filter suggestions based on current input
    if (currentInput.startsWith('/')) {
      const filtered = COMMAND_SUGGESTIONS.filter(cmd => 
        cmd.toLowerCase().includes(currentInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && currentInput.length > 1);
    } else {
      setShowSuggestions(false);
    }
  }, [currentInput]);

  const addCommand = useCallback((cmd: TerminalCommand) => {
    setCommands(prev => prev.concat([cmd]));
  }, []);

  const processCommand = async (input: string) => {
    if (!input.trim()) return;

    setIsProcessing(true);
    const commandId = Date.now().toString();
    
    // Add command to history
    setCommandHistory(prev => prev.concat([input]));
    setHistoryIndex(-1);

    // Add input command
    addCommand({
      id: commandId,
      command: input,
      output: '',
      timestamp: new Date(),
      type: 'info'
    });

    try {
      const output = await executeCommand(input.trim());
      
      // Update with output
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, output, type: 'success' as const }
          : cmd
      ));
    } catch (error) {
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, output: `Error: ${error}`, type: 'error' as const }
          : cmd
      ));
    }

    setIsProcessing(false);
    setCurrentInput('');
  };

  const executeCommand = async (input: string): Promise<string> => {
    const [command, ...args] = input.split(' ');
    
    switch (command.toLowerCase()) {
      case '/help':
        return `Available Commands:
==================
Financial Operations:
  /buy SYMBOL AMOUNT    - Purchase agent keys
  /sell SYMBOL AMOUNT   - Sell agent keys  
  /portfolio           - View your holdings
  /balance             - Check wallet balance

Agent Discovery:
  /agents              - List all agents
  /search QUERY        - Find agents by name
  /stats SYMBOL        - Detailed agent statistics
  /leaderboard         - Top performing agents

Monitoring:
  /monitor SYMBOL      - Start real-time monitoring
  /unmonitor SYMBOL    - Stop monitoring
  /alerts              - View price alerts

System:
  /history             - Command history
  /theme               - Change terminal theme
  /clear               - Clear terminal
  /status              - Connection status`;

      case '/buy':
        if (!connected) throw new Error('Wallet not connected');
        if (args.length < 2) throw new Error('Usage: /buy SYMBOL AMOUNT');
        const [buySymbol, buyAmount] = args;
        return `Initiating purchase of ${buyAmount} ${buySymbol} keys...
Price per key: $2.41
Total cost: $${(parseFloat(buyAmount) * 2.41).toFixed(2)}
Transaction submitted - awaiting confirmation...`;

      case '/sell':
        if (!connected) throw new Error('Wallet not connected');
        if (args.length < 2) throw new Error('Usage: /sell SYMBOL AMOUNT');
        const [sellSymbol, sellAmount] = args;
        return `Initiating sale of ${sellAmount} ${sellSymbol} keys...
Current price: $2.35
Total proceeds: $${(parseFloat(sellAmount) * 2.35).toFixed(2)}
Transaction submitted - awaiting confirmation...`;

      case '/portfolio':
        if (!connected) throw new Error('Wallet not connected');
        return `Your Portfolio:
==============
ResearchOS (RSCH): 15 keys @ $2.41 = $36.15
TradePilot (TRADE): 8 keys @ $4.83 = $38.64
GrowthLoop (GROWTH): 3 keys @ $1.12 = $3.36

Total Portfolio Value: $78.15
24h Change: +$4.23 (+5.7%)`;

      case '/agents':
        return `Active Agents:
=============
🤖 ResearchOS      RSCH    $2.41  ↗ +3.2%    1,242 holders
🚀 TradePilot      TRADE   $4.83  ↗ +8.7%    842 holders  
📈 GrowthLoop      GROWTH  $1.12  ↘ -2.1%    2,341 holders
🔒 AuditMesh       AUDIT   $3.67  ↗ +1.4%    567 holders
🌐 DataOracle      DATA    $6.21  ↗ +12.3%   324 holders`;

      case '/search':
        if (!args.length) throw new Error('Usage: /search QUERY');
        const query = args.join(' ');
        return `Search Results for "${query}":
============================
🔍 Found 3 matches:

🤖 ResearchOS - Autonomous research agent
📊 DataOracle - Real-time data aggregation
🔒 AuditMesh - Security audit automation`;

      case '/stats':
        if (!args.length) throw new Error('Usage: /stats SYMBOL');
        const symbol = args[0].toUpperCase();
        return `${symbol} Statistics:
================
Current Price: $2.41
24h Volume: $18,234
Market Cap: $2.99M
Holders: 1,242
Creator: 0x1a2b...c9d8

Performance Metrics:
- 24h Change: +3.2%
- 7d Change: +15.7% 
- 30d Change: +42.1%
- All Time High: $3.87`;

      case '/leaderboard':
        return `Top Performing Agents (24h):
===========================
🥇 DataOracle    $6.21  ↗ +12.3%  324 holders
🥈 TradePilot    $4.83  ↗ +8.7%   842 holders
🥉 ResearchOS    $2.41  ↗ +3.2%   1,242 holders
4️⃣  AuditMesh     $3.67  ↗ +1.4%   567 holders
5️⃣  GrowthLoop    $1.12  ↘ -2.1%   2,341 holders`;

      case '/monitor':
        if (!args.length) throw new Error('Usage: /monitor SYMBOL');
        const monitorSymbol = args[0].toUpperCase();
        setMonitoringAgents(prev => new Set(Array.from(prev).concat([monitorSymbol])));
        return `Started monitoring ${monitorSymbol}
Live updates will appear in terminal
Use /unmonitor ${monitorSymbol} to stop`;

      case '/unmonitor':
        if (!args.length) throw new Error('Usage: /unmonitor SYMBOL');
        const unmonitorSymbol = args[0].toUpperCase();
        setMonitoringAgents(prev => {
          const newSet = new Set(prev);
          newSet.delete(unmonitorSymbol);
          return newSet;
        });
        return `Stopped monitoring ${unmonitorSymbol}`;

      case '/history':
        return `Command History:
===============
${commandHistory.slice(-10).map((cmd, i) => `${i + 1}. ${cmd}`).join('\n')}`;

      case '/theme':
        if (args.length === 0) {
          return `Available Themes:
================
${TERMINAL_THEMES.map((t, i) => `${i + 1}. ${t.name} ${i === currentTheme ? '(current)' : ''}`).join('\n')}

Usage: /theme NUMBER`;
        }
        const themeIndex = parseInt(args[0]) - 1;
        if (themeIndex >= 0 && themeIndex < TERMINAL_THEMES.length) {
          setCurrentTheme(themeIndex);
          return `Theme changed to: ${TERMINAL_THEMES[themeIndex].name}`;
        }
        throw new Error('Invalid theme number');

      case '/clear':
        setCommands([]);
        return 'Terminal cleared';

      case '/status':
        return `System Status:
=============
Wallet: ${connected ? 'Connected ✅' : 'Disconnected ❌'}
Network: Solana Mainnet
RPC: Connected
WebSocket: Active
Monitoring: ${monitoringAgents.size} agents
Terminal Version: 2.0`;

      default:
        throw new Error(`Unknown command: ${command}. Type '/help' for available commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex === commandHistory.length - 1 ? -1 : historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(newIndex < 0 ? '' : commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        const suggestion = filteredSuggestions[0];
        setCurrentInput(suggestion.split(' - ')[0]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setCurrentInput(suggestion.split(' - ')[0]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="h-screen flex flex-col font-mono text-sm"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      {/* Terminal Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          borderColor: `${theme.primaryColor}40`,
          background: `linear-gradient(90deg, ${theme.backgroundColor} 0%, ${theme.primaryColor}10 100%)`
        }}
      >
        <div className="flex items-center space-x-3">
          <Terminal style={{ color: theme.primaryColor }} size={20} />
          <span style={{ color: theme.primaryColor }} className="font-bold">
            AgentKeys Terminal v2.0
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {monitoringAgents.size > 0 && (
            <div className="flex items-center space-x-1 text-xs">
              <Activity size={14} style={{ color: theme.accentColor }} />
              <span>Monitoring {monitoringAgents.size}</span>
            </div>
          )}
          <button
            onClick={() => setCurrentTheme((prev) => (prev + 1) % TERMINAL_THEMES.length)}
            className="p-1 hover:bg-white/10 rounded"
            title="Change Theme"
          >
            <Settings size={16} style={{ color: theme.primaryColor }} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {commands.map((cmd) => (
          <div key={cmd.id} className="space-y-1">
            {cmd.command !== 'system' && (
              <div className="flex items-start space-x-2">
                <span style={{ color: theme.accentColor }}>{'>'}</span>
                <span style={{ color: theme.primaryColor }}>{cmd.command}</span>
                <span className="text-xs opacity-60">
                  {cmd.timestamp.toLocaleTimeString()}
                </span>
              </div>
            )}
            {cmd.output && (
              <div 
                className={`whitespace-pre-line ml-4 ${
                  cmd.type === 'error' ? 'text-red-400' : 
                  cmd.type === 'warning' ? 'text-yellow-400' : 
                  cmd.type === 'success' ? `text-green-400` : ''
                }`}
                style={cmd.type === 'info' ? { color: theme.textColor } : {}}
              >
                {cmd.output}
              </div>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 ml-4">
            <RefreshCw 
              size={12} 
              className="animate-spin" 
              style={{ color: theme.accentColor }} 
            />
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Auto-complete Suggestions */}
      {showSuggestions && (
        <div 
          className="absolute bottom-16 left-4 right-4 max-h-32 overflow-y-auto rounded border shadow-lg z-10"
          style={{ 
            backgroundColor: theme.backgroundColor,
            borderColor: theme.primaryColor
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-white/10 text-xs"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Terminal Input */}
      <div 
        className="p-4 border-t flex items-center space-x-2"
        style={{ borderColor: `${theme.primaryColor}40` }}
      >
        <span style={{ color: theme.accentColor }}>{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none"
          style={{ color: theme.primaryColor }}
          placeholder="Type a command... (try /help)"
          disabled={isProcessing}
        />
        {isProcessing && (
          <RefreshCw 
            size={16} 
            className="animate-spin" 
            style={{ color: theme.accentColor }} 
          />
        )}
      </div>
    </div>
  );
}