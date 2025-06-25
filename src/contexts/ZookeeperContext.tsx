
import React, { createContext, useContext, useState, useEffect } from 'react';
import ZookeeperService, { ZookeeperConfig } from '../services/zookeeperService';
import { ZookeeperConnection } from '../components/ZookeeperConnectionManager';

interface ZookeeperContextType {
  service: ZookeeperService | null;
  config: ZookeeperConfig;
  connections: ZookeeperConnection[];
  activeConnectionId: string;
  updateConnections: (connections: ZookeeperConnection[]) => void;
  setActiveConnection: (connectionId: string) => void;
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
  const [connections, setConnections] = useState<ZookeeperConnection[]>([
    {
      id: 'default',
      name: 'Local Development',
      url: 'http://localhost:12345'
    }
  ]);
  const [activeConnectionId, setActiveConnectionId] = useState<string>('default');
  const [service, setService] = useState<ZookeeperService | null>(null);

  const activeConnection = connections.find(conn => conn.id === activeConnectionId);
  const config: ZookeeperConfig = {
    mode: 'http',
    httpUrl: activeConnection?.url || 'http://localhost:12345'
  };

  useEffect(() => {
    const newService = new ZookeeperService(config);
    setService(newService);

    return () => {
      newService.disconnect();
    };
  }, [config.httpUrl]);

  const updateConnections = (newConnections: ZookeeperConnection[]) => {
    setConnections(newConnections);
    
    // If active connection was removed, switch to first available
    if (newConnections.length > 0 && !newConnections.find(conn => conn.id === activeConnectionId)) {
      setActiveConnectionId(newConnections[0].id);
    }
  };

  const setActiveConnection = (connectionId: string) => {
    setActiveConnectionId(connectionId);
  };

  return (
    <ZookeeperContext.Provider value={{ 
      service, 
      config, 
      connections, 
      activeConnectionId, 
      updateConnections, 
      setActiveConnection 
    }}>
      {children}
    </ZookeeperContext.Provider>
  );
};
