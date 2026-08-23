import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Realm = 'neutral' | 'code' | 'music' | 'visuals';

export interface RealmConfig {
  color: string;
  secondary: string;
  icon: string;
  description: string;
}

export const realmConfigs: Record<Realm, RealmConfig> = {
  neutral: {
    color: '#a855f7',
    secondary: '#06b6d4',
    icon: '◆',
    description: 'All Frequencies',
  },
  code: {
    color: '#a855f7',
    secondary: '#7c3aed',
    icon: '⟨/⟩',
    description: 'Code Frequency',
  },
  music: {
    color: '#06b6d4',
    secondary: '#0891b2',
    icon: '♪',
    description: 'Sound Frequency',
  },
  visuals: {
    color: '#ea580c',
    secondary: '#dc2626',
    icon: '◉',
    description: 'Visual Frequency',
  },
};

interface RealmContextType {
  realm: Realm;
  setRealm: (realm: Realm) => void;
  realmConfig: typeof realmConfigs;
  getRealmColor: (realm: Realm) => string;
}

const RealmContext = createContext<RealmContextType | undefined>(undefined);

interface RealmProviderProps {
  children: ReactNode;
}

export const RealmProvider: React.FC<RealmProviderProps> = ({ children }) => {
  const [realm, setRealm] = useState<Realm>('neutral');

  useEffect(() => {
    const config = realmConfigs[realm];
    const root = document.documentElement;

    root.style.setProperty('--realm-primary', config.color);
    root.style.setProperty('--realm-secondary', config.secondary);
    root.style.setProperty('--realm-glow', config.color);
    
    // Add an opacity version of the primary color for the background
    // Extracting hex to rgb isn't strictly necessary if using color-mix in css,
    // but here we can just set a hex with alpha or use color-mix.
    root.style.setProperty('--realm-bg', `color-mix(in srgb, ${config.color} 10%, transparent)`);
  }, [realm]);

  const getRealmColor = (r: Realm) => realmConfigs[r].color;

  const value = {
    realm,
    setRealm,
    realmConfig: realmConfigs,
    getRealmColor,
  };

  return (
    <RealmContext.Provider value={value}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealm = (): RealmContextType => {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error('useRealm must be used within a RealmProvider');
  }
  return context;
};
