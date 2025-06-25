
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, Server, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ZookeeperConnection {
  id: string;
  name: string;
  url: string;
}

interface ZookeeperConnectionManagerProps {
  connections: ZookeeperConnection[];
  activeConnectionId: string;
  onConnectionsChange: (connections: ZookeeperConnection[]) => void;
  onActiveConnectionChange: (connectionId: string) => void;
}

export const ZookeeperConnectionManager: React.FC<ZookeeperConnectionManagerProps> = ({
  connections,
  activeConnectionId,
  onConnectionsChange,
  onActiveConnectionChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [newConnectionUrl, setNewConnectionUrl] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();

  const handleAddConnection = () => {
    if (!newConnectionName.trim() || !newConnectionUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide both name and URL for the connection.",
        variant: "destructive",
      });
      return;
    }

    const newConnection: ZookeeperConnection = {
      id: Date.now().toString(),
      name: newConnectionName.trim(),
      url: newConnectionUrl.trim(),
    };

    const updatedConnections = [...connections, newConnection];
    onConnectionsChange(updatedConnections);
    
    // If this is the first connection, make it active
    if (connections.length === 0) {
      onActiveConnectionChange(newConnection.id);
    }

    setNewConnectionName('');
    setNewConnectionUrl('');
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Connection "${newConnection.name}" added successfully.`,
    });
  };

  const handleDeleteConnection = (connectionId: string) => {
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    onConnectionsChange(updatedConnections);
    
    // If we deleted the active connection, switch to the first available one
    if (connectionId === activeConnectionId && updatedConnections.length > 0) {
      onActiveConnectionChange(updatedConnections[0].id);
    }
    
    toast({
      title: "Success",
      description: "Connection deleted successfully.",
    });
  };

  const activeConnection = connections.find(conn => conn.id === activeConnectionId);

  return (
    <Card className="mb-6">
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Zookeeper Connections
              </div>
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="connection-select">Active Connection</Label>
                <Select value={activeConnectionId} onValueChange={onActiveConnectionChange}>
                  <SelectTrigger id="connection-select">
                    <SelectValue placeholder="Select a connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem key={connection.id} value={connection.id}>
                        {connection.name} ({connection.url})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Connection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="connection-name">Connection Name</Label>
                        <Input
                          id="connection-name"
                          value={newConnectionName}
                          onChange={(e) => setNewConnectionName(e.target.value)}
                          placeholder="Local Development"
                        />
                      </div>
                      <div>
                        <Label htmlFor="connection-url">ZooKeeper URL</Label>
                        <Input
                          id="connection-url"
                          value={newConnectionUrl}
                          onChange={(e) => setNewConnectionUrl(e.target.value)}
                          placeholder="http://localhost:12345"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddConnection}>
                          Add Connection
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {activeConnection && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteConnection(activeConnectionId)}
                    disabled={connections.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {activeConnection && (
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                <strong>Current Connection:</strong> {activeConnection.name}<br />
                <strong>URL:</strong> {activeConnection.url}
              </div>
            )}
            
            {connections.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">
                No connections configured. Add a connection to get started.
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
