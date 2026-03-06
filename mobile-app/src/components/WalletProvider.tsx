import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Connection, PublicKey } from '@solana/web3.js';

interface WalletContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkStoredWallet();
  }, []);

  const checkStoredWallet = async () => {
    try {
      const storedWallet = await AsyncStorage.getItem('wallet_info');
      if (storedWallet) {
        const { publicKey: storedKey } = JSON.parse(storedWallet);
        setPublicKey(new PublicKey(storedKey));
        setConnected(true);
      }
    } catch (error) {
      console.error('Error checking stored wallet:', error);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric authentication is not available on this device');
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric authentication methods are enrolled');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to connect wallet',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const connect = async () => {
    try {
      setConnecting(true);

      // Check if biometric authentication is required
      const biometricRequired = await AsyncStorage.getItem('biometric_required');
      if (biometricRequired === 'true') {
        const authenticated = await authenticateWithBiometrics();
        if (!authenticated) {
          setConnecting(false);
          return;
        }
      }

      // In a real app, this would integrate with actual wallet adapters
      // For demo purposes, we'll simulate wallet connection
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      
      await AsyncStorage.setItem('wallet_info', JSON.stringify({
        publicKey: mockPublicKey.toString(),
        connected: true,
      }));

      setPublicKey(mockPublicKey);
      setConnected(true);
      
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      Alert.alert('Error', 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await AsyncStorage.removeItem('wallet_info');
      setPublicKey(null);
      setConnected(false);
      Alert.alert('Success', 'Wallet disconnected');
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      Alert.alert('Error', 'Failed to disconnect wallet');
    }
  };

  const signTransaction = async (transaction: any) => {
    // Authenticate with biometrics for transaction signing
    const authenticated = await authenticateWithBiometrics();
    if (!authenticated) {
      throw new Error('Authentication failed');
    }

    // In a real app, this would sign the actual transaction
    console.log('Signing transaction:', transaction);
    return transaction;
  };

  const signMessage = async (message: string) => {
    const authenticated = await authenticateWithBiometrics();
    if (!authenticated) {
      throw new Error('Authentication failed');
    }

    // Mock message signing
    return `signed_${message}`;
  };

  const value: WalletContextType = {
    connected,
    publicKey,
    connecting,
    connect,
    disconnect,
    signTransaction,
    signMessage,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}