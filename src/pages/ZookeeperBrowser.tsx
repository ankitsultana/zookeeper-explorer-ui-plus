
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ZookeeperSidebar } from "@/components/ZookeeperSidebar";
import { ZNodeContent } from "@/components/ZNodeContent";
import { ZookeeperConfig } from "@/components/ZookeeperConfig";
import { Separator } from "@/components/ui/separator";
import { ZookeeperProvider, useZookeeper } from "../contexts/ZookeeperContext";

export interface ZNode {
  path: string;
  data: string;
  children: string[];
  stat: {
    ctime: number;
    mtime: number;
    version: number;
    cversion: number;
    aversion: number;
    ephemeralOwner: number;
    dataLength: number;
    numChildren: number;
  };
}

const ZookeeperBrowserContent = () => {
  const [selectedNode, setSelectedNode] = useState<string>('/');
  const [nodeData, setNodeData] = useState<ZNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { service, connections, activeConnectionId } = useZookeeper();

  const activeConnection = connections.find(conn => conn.id === activeConnectionId);

  const fetchNodeData = async (path: string) => {
    if (!service) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await service.getData(path);
      setNodeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching node data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (service) {
      fetchNodeData(selectedNode);
    }
  }, [selectedNode, service, refreshTrigger]);

  const handleNodeSelect = (path: string) => {
    setSelectedNode(path);
  };

  const handleRefresh = () => {
    // Increment refresh trigger to force both sidebar tree and content to refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSidebarRefresh = () => {
    // Trigger refresh for sidebar tree updates
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <ZookeeperSidebar 
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            onRefresh={handleSidebarRefresh}
            refreshTrigger={refreshTrigger}
          />
          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-md transition-colors" />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-800">Zookeeper Browser</h1>
                  {activeConnection && (
                    <div className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {activeConnection.name} • {activeConnection.url}
                    </div>
                  )}
                </div>
              </div>
            </header>
            <div className="flex-1 p-6">
              <ZookeeperConfig />
              <ZNodeContent 
                nodeData={nodeData}
                selectedPath={selectedNode}
                loading={loading}
                error={error}
                onRefresh={handleRefresh}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

const ZookeeperBrowser = () => {
  return (
    <ZookeeperProvider>
      <ZookeeperBrowserContent />
    </ZookeeperProvider>
  );
};

export default ZookeeperBrowser;
