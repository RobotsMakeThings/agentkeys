import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

interface WalletState {
  isConnected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  connecting: boolean;
  biometricEnabled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  updateBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  publicKey: null,
  balance: 0,
  connecting: false,
  biometricEnabled: false,

  connectWallet: async () => {
    set({ connecting: true });
    
    try {
      // Check if biometric is required
      const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
      if (biometricEnabled === 'true') {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to connect wallet',
            fallbackLabel: 'Use PIN',
          });
          
          if (!result.success) {
            set({ connecting: false });
            throw new Error('Authentication failed');
          }
        }
      }

      // In production, integrate with actual Solana wallet adapters
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      
      await AsyncStorage.setItem('wallet_connected', 'true');
      await AsyncStorage.setItem('wallet_publickey', mockPublicKey.toString());
      
      set({
        isConnected: true,
        publicKey: mockPublicKey,
        balance: 1250.75, // Mock balance
        connecting: false,
        biometricEnabled: biometricEnabled === 'true',
      });
    } catch (error) {
      set({ connecting: false });
      throw error;
    }
  },

  disconnectWallet: async () => {
    await AsyncStorage.removeItem('wallet_connected');
    await AsyncStorage.removeItem('wallet_publickey');
    
    set({
      isConnected: false,
      publicKey: null,
      balance: 0,
      biometricEnabled: false,
    });
  },

  enableBiometric: async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) {
      throw new Error('Biometric authentication is not available');
    }

    await AsyncStorage.setItem('biometric_enabled', 'true');
    set({ biometricEnabled: true });
  },

  disableBiometric: async () => {
    await AsyncStorage.setItem('biometric_enabled', 'false');
    set({ biometricEnabled: false });
  },

  updateBalance: (balance: number) => {
    set({ balance });
  },
}));