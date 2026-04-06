import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SessionContextValue = {
  isLoggedIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const signIn = async () => {
    setLoading(true);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('isLoggedIn');
    setLoading(false);
  };

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const stored = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(stored === 'true');
      setLoading(false);
    };
    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ isLoggedIn, signIn, signOut, loading }}>
      {children}
    </SessionContext.Provider>
  );
};
