// Authentication utilities and wallet generation
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletAddress: string;
  authMethod: 'email' | 'github' | 'wallet';
  githubId?: string;
  hasPrivateKey: boolean; // true for email/github, false for wallet connect
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Generate a new wallet for the user
export function generateWallet(): { address: string; privateKey: string; mnemonic: string } {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || ''
  };
}

// Encrypt private key with user password
export function encryptPrivateKey(privateKey: string, password: string): string {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
}

// Decrypt private key with user password
export function decryptPrivateKey(encryptedKey: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Create wallet instance for transactions
export function createWalletInstance(privateKey: string, provider?: ethers.Provider): ethers.Wallet {
  if (provider) {
    return new ethers.Wallet(privateKey, provider);
  }
  return new ethers.Wallet(privateKey);
}

// Mock database operations (replace with real DB in production)
class MockUserDB {
  private users: Map<string, any> = new Map();

  async createUser(userData: {
    email: string;
    name: string;
    password?: string;
    githubId?: string;
    avatar?: string;
    walletAddress?: string; // If connecting with existing wallet
    authMethod: 'email' | 'github' | 'wallet';
  }): Promise<User> {
    let wallet;
    let encryptedPrivateKey;
    let hasPrivateKey;

    if (userData.walletAddress) {
      // User is connecting with existing wallet
      wallet = { 
        address: userData.walletAddress,
        privateKey: '', // We don't have access to external wallet private keys
        mnemonic: ''
      };
      encryptedPrivateKey = '';
      hasPrivateKey = false;
    } else {
      // Generate new wallet for email/GitHub users
      wallet = generateWallet();
      hasPrivateKey = true;
      
      // Encrypt private key if password provided
      encryptedPrivateKey = userData.password 
        ? encryptPrivateKey(wallet.privateKey, userData.password)
        : encryptPrivateKey(wallet.privateKey, userData.email); // For OAuth, use email as encryption key
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      walletAddress: wallet.address,
      authMethod: userData.authMethod,
      githubId: userData.githubId,
      hasPrivateKey: hasPrivateKey,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    // Store user data (in production, use proper database)
    this.users.set(user.id, {
      ...user,
      encryptedPrivateKey,
      mnemonic: wallet.mnemonic,
      passwordHash: userData.password ? this.hashPassword(userData.password) : null
    });

    console.log(`🎉 New user created: ${user.email} with wallet ${user.walletAddress}`);
    return user;
  }

  async findUserByEmail(email: string): Promise<any | null> {
    for (const userData of Array.from(this.users.values())) {
      if (userData.email === email) {
        return userData;
      }
    }
    return null;
  }

  async findUserByGithubId(githubId: string): Promise<any | null> {
    for (const userData of Array.from(this.users.values())) {
      if (userData.githubId === githubId) {
        return userData;
      }
    }
    return null;
  }

  async findUserByWalletAddress(walletAddress: string): Promise<any | null> {
    for (const userData of Array.from(this.users.values())) {
      if (userData.walletAddress === walletAddress) {
        return userData;
      }
    }
    return null;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.passwordHash) return false;
    
    return this.hashPassword(password) === user.passwordHash;
  }

  async updateLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
    }
  }

  private hashPassword(password: string): string {
    // In production, use proper bcrypt or similar
    return CryptoJS.SHA256(password + 'salt').toString();
  }

  async getUserById(userId: string): Promise<any | null> {
    return this.users.get(userId) || null;
  }
}

export const userDB = new MockUserDB();

// GitHub OAuth configuration
export const GITHUB_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'your_github_client_id',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
  redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
  scope: 'user:email'
};

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

// Local storage utilities for client-side session management
// Export private key for users who own their wallet (email/GitHub users)
export async function exportUserPrivateKey(userId: string, password: string): Promise<{ privateKey: string; mnemonic: string } | null> {
  const userData = await userDB.getUserById(userId);
  if (!userData || !userData.hasPrivateKey) {
    return null;
  }

  try {
    const decryptedKey = userData.passwordHash 
      ? decryptPrivateKey(userData.encryptedPrivateKey, password)
      : decryptPrivateKey(userData.encryptedPrivateKey, userData.email);

    return {
      privateKey: decryptedKey,
      mnemonic: userData.mnemonic
    };
  } catch (error) {
    console.error('Failed to decrypt private key:', error);
    return null;
  }
}

export const AuthStorage = {
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentcards_user', JSON.stringify(user));
    }
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('agentcards_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agentcards_user');
      localStorage.removeItem('agentcards_session');
    }
  },

  setSession(sessionData: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentcards_session', JSON.stringify(sessionData));
    }
  },

  getSession(): any | null {
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem('agentcards_session');
      return sessionData ? JSON.parse(sessionData) : null;
    }
    return null;
  }
};