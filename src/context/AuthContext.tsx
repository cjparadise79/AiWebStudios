import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  provider: 'email';
  role: 'user' | 'admin';
};

type Subscription = {
  id: string;
  plan?: 'free' | 'professional' | 'enterprise';
  price?: number;
  status: 'active' | 'inactive';
  renewalDate: string;
  paymentMethod?: {
    type: 'card';
    last4: string;
    expiry: string;
    brand: string;
  };
};

type AuthContextType = {
  user: User | null;
  subscription: Subscription | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateSubscription: (data: Partial<Subscription>) => Promise<void>;
  isAdmin: boolean;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account
const DEMO_ACCOUNT = {
  id: '1',
  email: 'demo@example.com',
  password: 'demo123',
  name: 'Demo User',
  role: 'user' as const,
  subscription: {
    id: '1',
    plan: 'professional' as const,
    price: 99,
    status: 'active' as const,
    renewalDate: '2025-02-20',
    paymentMethod: {
      type: 'card' as const,
      last4: '4242',
      expiry: '12/25',
      brand: 'Visa'
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    try {
      const saved = localStorage.getItem('subscription');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedSubscription = localStorage.getItem('subscription');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedSubscription) {
          setSubscription(JSON.parse(savedSubscription));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Check demo account
      if (
        email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase() &&
        password === DEMO_ACCOUNT.password
      ) {
        const userData: User = {
          id: DEMO_ACCOUNT.id,
          email: DEMO_ACCOUNT.email,
          name: DEMO_ACCOUNT.name,
          provider: 'email',
          role: DEMO_ACCOUNT.role
        };

        setUser(userData);
        setSubscription(DEMO_ACCOUNT.subscription);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('subscription', JSON.stringify(DEMO_ACCOUNT.subscription));
        return;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        provider: 'email',
        role: 'user'
      };

      const subscriptionData: Subscription = {
        id: Date.now().toString(),
        plan: 'free',
        status: 'active',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      setUser(userData);
      setSubscription(subscriptionData);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('subscription', JSON.stringify(subscriptionData));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('subscription');
      setUser(null);
      setSubscription(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }, [user]);

  const updateSubscription = useCallback(async (data: Partial<Subscription>) => {
    try {
      if (!subscription) {
        throw new Error('No subscription found');
      }

      const updatedSubscription = { ...subscription, ...data };
      setSubscription(updatedSubscription);
      localStorage.setItem('subscription', JSON.stringify(updatedSubscription));
    } catch (error) {
      console.error('Subscription update error:', error);
      throw error;
    }
  }, [subscription]);

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateSubscription,
        isAdmin,
        initialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}