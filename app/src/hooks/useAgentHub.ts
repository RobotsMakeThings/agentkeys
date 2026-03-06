// Real-time messaging and hub functionality for agent gated content
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { encryption } from '@/lib/encryption';
import { useAgentKeys } from './useAgentKeys';

interface Message {
  id: string;
  agentId: string;
  userId: string;
  message: string;
  encryptedData?: string;
  iv?: string;
  timestamp: number;
  fileAttachment?: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    encryptedFile: string;
    iv: string;
  };
}

interface HubUser {
  userId: string;
  publicKey: string;
  keyBalance: number;
  isOnline: boolean;
  lastSeen: number;
}

export function useAgentHub(agentId: string) {
  const { connected, publicKey } = useWallet();
  const { fetchAgentFees, getBuyPrice } = useAgentKeys();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [hubUsers, setHubUsers] = useState<HubUser[]>([]);
  const [userKeyBalance, setUserKeyBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Access levels
  const hasBasicAccess = userKeyBalance >= 1;
  const hasPremiumAccess = userKeyBalance >= 10;

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!connected || !publicKey || !agentId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(`${wsUrl}/hub/${agentId}`);
    
    ws.onopen = () => {
      console.log('Connected to agent hub');
      setIsConnected(true);
      
      // Send authentication
      ws.send(JSON.stringify({
        type: 'auth',
        userId: publicKey.toString(),
        agentId,
      }));
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        await handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from agent hub');
      setIsConnected(false);
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, [connected, publicKey, agentId]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = async (data: any) => {
    switch (data.type) {
      case 'message':
        try {
          // Decrypt message
          const decryptedMessage = await encryption.decryptMessage(
            data.agentId,
            data.encryptedData,
            data.iv
          );
          
          const message: Message = {
            id: data.id,
            agentId: data.agentId,
            userId: data.userId,
            message: decryptedMessage,
            timestamp: data.timestamp,
          };
          
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
        }
        break;
        
      case 'file':
        try {
          const message: Message = {
            id: data.id,
            agentId: data.agentId,
            userId: data.userId,
            message: `📎 ${data.fileName}`,
            timestamp: data.timestamp,
            fileAttachment: data.fileAttachment,
          };
          
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Failed to handle file message:', error);
        }
        break;
        
      case 'userJoined':
        setHubUsers(prev => {
          const existing = prev.find(u => u.userId === data.user.userId);
          if (existing) {
            return prev.map(u => 
              u.userId === data.user.userId 
                ? { ...u, isOnline: true }
                : u
            );
          }
          return [...prev, { ...data.user, isOnline: true }];
        });
        break;
        
      case 'userLeft':
        setHubUsers(prev => 
          prev.map(u => 
            u.userId === data.userId 
              ? { ...u, isOnline: false, lastSeen: Date.now() }
              : u
          )
        );
        break;
        
      case 'userList':
        setHubUsers(data.users);
        break;
        
      case 'keyBalance':
        setUserKeyBalance(data.balance);
        break;
        
      case 'error':
        console.error('Hub error:', data.message);
        break;
    }
  };

  // Send encrypted message
  const sendMessage = useCallback(async (message: string) => {
    if (!wsRef.current || !hasBasicAccess || !message.trim()) return;

    try {
      // Encrypt the message
      const { encryptedData, iv } = await encryption.encryptMessage(agentId, message);
      
      const messageData = {
        type: 'message',
        agentId,
        message,
        encryptedData,
        iv,
        timestamp: Date.now(),
      };

      wsRef.current.send(JSON.stringify(messageData));
      
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, [agentId, hasBasicAccess]);

  // Send encrypted file
  const sendFile = useCallback(async (file: File) => {
    if (!wsRef.current || !hasBasicAccess || !file) return;

    try {
      setIsLoading(true);
      
      // Encrypt the file
      const { encryptedFile, iv, fileName, mimeType } = await encryption.encryptFile(agentId, file);
      
      // Convert to base64 for transmission
      const uint8Array = new Uint8Array(encryptedFile);
      const encryptedFileBase64 = btoa(
        String.fromCharCode.apply(null, Array.from(uint8Array))
      );
      
      const fileData = {
        type: 'file',
        agentId,
        fileName,
        fileSize: file.size,
        mimeType,
        encryptedFile: encryptedFileBase64,
        iv,
        timestamp: Date.now(),
      };

      wsRef.current.send(JSON.stringify(fileData));
      
      return true;
    } catch (error) {
      console.error('Failed to send file:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [agentId, hasBasicAccess]);

  // Download and decrypt file
  const downloadFile = useCallback(async (message: Message) => {
    if (!message.fileAttachment) return;

    try {
      setIsLoading(true);
      
      const { fileName, mimeType, encryptedFile, iv } = message.fileAttachment;
      
      // Convert from base64
      const binaryString = atob(encryptedFile);
      const encryptedBuffer = new ArrayBuffer(binaryString.length);
      const view = new Uint8Array(encryptedBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i);
      }
      
      // Decrypt file
      const decryptedFile = await encryption.decryptFile(
        agentId,
        encryptedBuffer,
        iv,
        fileName,
        mimeType
      );
      
      // Download file
      const url = URL.createObjectURL(decryptedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to download file:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  // Load message history
  const loadMessageHistory = useCallback(async () => {
    if (!connected || !hasBasicAccess) return;

    try {
      setIsLoading(true);
      
      // TODO: Fetch encrypted messages from backend
      // For now, using mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          agentId,
          userId: 'system',
          message: 'Welcome to the agent hub! This is an end-to-end encrypted chat.',
          timestamp: Date.now() - 3600000,
        },
        {
          id: '2',
          agentId,
          userId: '0x1234...5678',
          message: 'Hey everyone! Excited to be part of this exclusive group.',
          timestamp: Date.now() - 1800000,
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load message history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [agentId, connected, hasBasicAccess]);

  // Load user's key balance
  const loadKeyBalance = useCallback(async () => {
    if (!connected || !publicKey) return;

    try {
      // TODO: Get actual key balance from smart contract
      // For demo purposes, using mock data
      setUserKeyBalance(5); // User owns 5 keys
    } catch (error) {
      console.error('Failed to load key balance:', error);
    }
  }, [connected, publicKey]);

  // Initialize hub connection
  useEffect(() => {
    if (connected && publicKey && agentId) {
      loadKeyBalance();
      loadMessageHistory();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connected, publicKey, agentId, loadKeyBalance, loadMessageHistory, connectWebSocket]);

  return {
    // State
    messages,
    hubUsers,
    userKeyBalance,
    isConnected,
    isLoading,
    
    // Access levels
    hasBasicAccess,
    hasPremiumAccess,
    
    // Actions
    sendMessage,
    sendFile,
    downloadFile,
    
    // Utils
    formatTimestamp: (timestamp: number) => new Date(timestamp).toLocaleTimeString(),
    getUserDisplayName: (userId: string) => {
      if (userId === publicKey?.toString()) return 'You';
      if (userId === 'system') return 'System';
      return `${userId.slice(0, 6)}...${userId.slice(-4)}`;
    },
  };
}