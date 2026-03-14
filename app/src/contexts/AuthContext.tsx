'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, userDB, AuthStorage, generateWallet } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: (githubData: any) => Promise<{ success: boolean; error?: string }>;
  loginWithWallet: (walletAddress: string, signMessage?: () => Promise<string>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getUserWallet: () => { address: string; canSign: boolean; hasPrivateKey: boolean };
  exportPrivateKey: (password: string) => Promise<{ privateKey: string; mnemonic: string } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for existing session
      const storedUser = AuthStorage.getUser();
      if (storedUser) {
        // Verify session is still valid (in production, check with backend)
        await userDB.updateLastLogin(storedUser.id);
        setState({
          user: storedUser,
          loading: false,
          error: null
        });
        console.log('✅ Restored user session:', storedUser.email);
      } else {
        setState({
          user: null,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      setState({
        user: null,
        loading: false,
        error: 'Failed to initialize authentication'
      });
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Find user by email
      const userData = await userDB.findUserByEmail(email);
      if (!userData) {
        setState(prev => ({ ...prev, loading: false, error: 'Invalid email or password' }));
        return { success: false, error: 'Invalid email or password' };
      }

      // Validate password
      const isValidPassword = await userDB.validatePassword(email, password);
      if (!isValidPassword) {
        setState(prev => ({ ...prev, loading: false, error: 'Invalid email or password' }));
        return { success: false, error: 'Invalid email or password' };
      }

      // Create user object (without sensitive data)
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        walletAddress: userData.walletAddress,
        authMethod: userData.authMethod,
        githubId: userData.githubId,
        hasPrivateKey: userData.hasPrivateKey,
        createdAt: userData.createdAt,
        lastLoginAt: new Date()
      };

      // Update last login
      await userDB.updateLastLogin(user.id);

      // Store session
      AuthStorage.setUser(user);
      AuthStorage.setSession({
        loginTime: new Date().toISOString(),
        method: 'email'
      });

      setState({
        user,
        loading: false,
        error: null
      });

      console.log('✅ User logged in:', user.email, 'Wallet:', user.walletAddress);
      return { success: true };

    } catch (error) {
      console.error('❌ Login failed:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Login failed' }));
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if user already exists
      const existingUser = await userDB.findUserByEmail(email);
      if (existingUser) {
        setState(prev => ({ ...prev, loading: false, error: 'User already exists with this email' }));
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user with auto-generated wallet
      const user = await userDB.createUser({
        email,
        password,
        name,
        authMethod: 'email'
      });

      // Store session
      AuthStorage.setUser(user);
      AuthStorage.setSession({
        loginTime: new Date().toISOString(),
        method: 'email',
        isNewUser: true
      });

      setState({
        user,
        loading: false,
        error: null
      });

      console.log('✅ User created and logged in:', user.email, 'Wallet:', user.walletAddress);
      return { success: true };

    } catch (error) {
      console.error('❌ Signup failed:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Signup failed' }));
      return { success: false, error: 'Signup failed' };
    }
  };

  const loginWithGithub = async (githubData: any): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let user: User;

      // Check if user exists by GitHub ID
      const existingUser = await userDB.findUserByGithubId(githubData.id.toString());
      
      if (existingUser) {
        // User exists, log them in
        user = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          avatar: existingUser.avatar,
          walletAddress: existingUser.walletAddress,
          authMethod: existingUser.authMethod,
          githubId: existingUser.githubId,
          hasPrivateKey: existingUser.hasPrivateKey,
          createdAt: existingUser.createdAt,
          lastLoginAt: new Date()
        };

        await userDB.updateLastLogin(user.id);
        console.log('✅ Existing GitHub user logged in:', user.email);
      } else {
        // New GitHub user, create account
        user = await userDB.createUser({
          email: githubData.email || `${githubData.login}@github.local`,
          name: githubData.name || githubData.login,
          githubId: githubData.id.toString(),
          avatar: githubData.avatar_url,
          authMethod: 'github'
        });
        console.log('✅ New GitHub user created:', user.email);
      }

      // Store session
      AuthStorage.setUser(user);
      AuthStorage.setSession({
        loginTime: new Date().toISOString(),
        method: 'github',
        isNewUser: !existingUser
      });

      setState({
        user,
        loading: false,
        error: null
      });

      return { success: true };

    } catch (error) {
      console.error('❌ GitHub login failed:', error);
      setState(prev => ({ ...prev, loading: false, error: 'GitHub login failed' }));
      return { success: false, error: 'GitHub login failed' };
    }
  };

  const logout = () => {
    AuthStorage.removeUser();
    setState({
      user: null,
      loading: false,
      error: null
    });
    console.log('✅ User logged out');
  };

  const getUserWallet = () => {
    if (!state.user) {
      return { address: '', canSign: false, hasPrivateKey: false };
    }

    return {
      address: state.user.walletAddress,
      canSign: true,
      hasPrivateKey: state.user.hasPrivateKey
    };
  };

  const loginWithWallet = async (walletAddress: string, signMessage?: () => Promise<string>): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if user exists by wallet address
      let userData = await userDB.findUserByWalletAddress(walletAddress);
      let user: User;

      if (userData) {
        // Existing wallet user
        user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          walletAddress: userData.walletAddress,
          authMethod: userData.authMethod,
          githubId: userData.githubId,
          hasPrivateKey: userData.hasPrivateKey,
          createdAt: userData.createdAt,
          lastLoginAt: new Date()
        };

        await userDB.updateLastLogin(user.id);
        console.log('✅ Existing wallet user logged in:', walletAddress);
      } else {
        // New wallet user - create account
        // For new wallet users, we'll use a simple profile
        user = await userDB.createUser({
          email: `${walletAddress.slice(0, 8)}@wallet.local`,
          name: `Wallet User ${walletAddress.slice(0, 8)}`,
          walletAddress: walletAddress,
          authMethod: 'wallet'
        });
        console.log('✅ New wallet user created:', walletAddress);
      }

      // Store session
      AuthStorage.setUser(user);
      AuthStorage.setSession({
        loginTime: new Date().toISOString(),
        method: 'wallet'
      });

      setState({
        user,
        loading: false,
        error: null
      });

      return { success: true };

    } catch (error) {
      console.error('❌ Wallet login failed:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Wallet login failed' }));
      return { success: false, error: 'Wallet login failed' };
    }
  };

  const exportPrivateKey = async (password: string): Promise<{ privateKey: string; mnemonic: string } | null> => {
    if (!state.user || !state.user.hasPrivateKey) {
      return null;
    }

    // This would call the exportUserPrivateKey function from auth.ts
    // For now, return null since we need to implement the full encryption system
    console.log('🔑 Private key export requested for user:', state.user.id);
    return null;
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    loginWithGithub,
    loginWithWallet,
    logout,
    getUserWallet,
    exportPrivateKey
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};