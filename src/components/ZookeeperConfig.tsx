
import React from 'react';
import { ZookeeperConnectionManager, ZookeeperConnection } from './ZookeeperConnectionManager';
import { useZookeeper } from '../contexts/ZookeeperContext';

export const ZookeeperConfig: React.FC = () => {
  const { connections, activeConnectionId, updateConnections, setActiveConnection } = useZookeeper();

  return (
    <ZookeeperConnectionManager
      connections={connections}
      activeConnectionId={activeConnectionId}
      onConnectionsChange={updateConnections}
      onActiveConnectionChange={setActiveConnection}
    />
  );
};
