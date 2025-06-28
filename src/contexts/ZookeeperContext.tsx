
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

const STORAGE_KEYS = {
  CONNECTIONS: 'zookeeper-connections',
  ACTIVE_CONNECTION: 'zookeeper-active-connection'
};

const loadConnectionsFromStorage = (): ZookeeperConnection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading connections from localStorage:', error);
  }
  
  // Return default connection if nothing in storage
  return [
    {
      id: 'default',
      name: 'Local Development',
      url: 'localhost:12345/dev'
    }
  ];
};

const loadActiveConnectionFromStorage = (connections: ZookeeperConnection[]): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_CONNECTION);
    if (stored && connections.find(conn => conn.id === stored)) {
      return stored;
    }
  } catch (error) {
    console.error('Error loading active connection from localStorage:', error);
  }
  
  // Return first connection ID if nothing valid in storage
  return connections.length > 0 ? connections[0].id : 'default';
};

export const ZookeeperProvider: React.FC<ZookeeperProviderProps> = ({ children }) => {
  const [connections, setConnections] = useState<ZookeeperConnection[]>(() => loadConnectionsFromStorage());
  const [activeConnectionId, setActiveConnectionId] = useState<string>(() => 
    loadActiveConnectionFromStorage(loadConnectionsFromStorage())
  );
  const [service, setService] = useState<ZookeeperService | null>(null);

  const activeConnection = connections.find(conn => conn.id === activeConnectionId);
  const config: ZookeeperConfig = {
    mode: 'http',
    httpUrl: activeConnection?.url || 'localhost:12345/dev'
  };

  // Save connections to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
    } catch (error) {
      console.error('Error saving connections to localStorage:', error);
    }
  }, [connections]);

  // Save active connection to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CONNECTION, activeConnectionId);
    } catch (error) {
      console.error('Error saving active connection to localStorage:', error);
    }
  }, [activeConnectionId]);

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
