
import React, { createContext, useContext, useState, useEffect } from 'react';
import ZookeeperService, { ZookeeperConfig } from '../services/zookeeperService';

interface ZookeeperContextType {
  service: ZookeeperService | null;
  config: ZookeeperConfig;
  updateConfig: (newConfig: ZookeeperConfig) => void;
}

const ZookeeperContext = createContext<ZookeeperContextType | undefined>(undefined);

export const useZookeeper = () => {
  const context = useContext(ZookeeperContext);
  if (!context) {
    throw new Error('useZookeeper must be used within a ZookeeperProvider');
  }
  return context;
};

interface ZookeeperProviderProps {
  children: React.ReactNode;
}

export const ZookeeperProvider: React.FC<ZookeeperProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ZookeeperConfig>({
    mode: 'http',
    httpUrl: 'http://localhost:12345'
  });
  const [service, setService] = useState<ZookeeperService | null>(null);

  useEffect(() => {
    const newService = new ZookeeperService(config);
    setService(newService);

    return () => {
      newService.disconnect();
    };
  }, [config]);

  const updateConfig = (newConfig: ZookeeperConfig) => {
    setConfig(newConfig);
  };

  return (
    <ZookeeperContext.Provider value={{ service, config, updateConfig }}>
      {children}
    </ZookeeperContext.Provider>
  );
};
