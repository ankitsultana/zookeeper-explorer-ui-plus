import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Save, FileText, Info, Trash2, Clock, Hash, Users, Zap, Copy } from "lucide-react";
import { ZNode } from '../pages/ZookeeperBrowser';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useZookeeper } from '../contexts/ZookeeperContext';

interface ZNodeContentProps {
  nodeData: ZNode | null;
  selectedPath: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onNodeSelect: (path: string) => void;
}

export const ZNodeContent: React.FC<ZNodeContentProps> = ({
  nodeData,
  selectedPath,
  loading,
  error,
  onRefresh,
  onNodeSelect
}) => {
  const { service } = useZookeeper();
  const [editedData, setEditedData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (nodeData) {
      setEditedData(nodeData.data);
      setIsEditing(false);
    }
  }, [nodeData]);

  const saveData = async () => {
    if (!service) {
      toast({
        title: "Error",
        description: "ZooKeeper service not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await service.setData(selectedPath, editedData);

      toast({
        title: "Success",
        description: "Data saved successfully",
      });

      setIsEditing(false);
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save data",
        variant: "destructive",
      });
    }
  };

  const deleteNode = async () => {
    if (!service) {
      toast({
        title: "Error",
        description: "ZooKeeper service not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await service.remove(selectedPath);

      toast({
        title: "Success",
        description: "Node deleted successfully",
      });

      // Navigate to parent node after deletion
      const parentPath = selectedPath === '/' ? '/' : selectedPath.substring(0, selectedPath.lastIndexOf('/')) || '/';
      onNodeSelect(parentPath);

      // Trigger refresh which will update both sidebar and content
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete node",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!nodeData) return;
    
    try {
      await navigator.clipboard.writeText(nodeData.data);
      toast({
        title: "Success",
        description: "Node data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading node data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-700">
            <span className="font-medium">Error loading node:</span>
            <span>{error}</span>
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!nodeData) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Select a node to view its content
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{selectedPath}</h2>
          <p className="text-slate-600 mt-1">ZNode Details and Data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {selectedPath !== '/' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete ZNode</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{selectedPath}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteNode} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Node Data
              </CardTitle>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditedData(nodeData.data);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveData}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedData}
                  onChange={(e) => setEditedData(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter node data..."
                />
              ) : (
                <div className="bg-slate-50 rounded-md p-4">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {nodeData.data || <span className="text-slate-400 italic">No data</span>}
                  </pre>
                </div>
              )}
              <div className="mt-4 text-sm text-slate-500">
                Data length: {nodeData.stat.dataLength} bytes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Node Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-slate-600">Children</div>
                    <div className="font-semibold">{nodeData.stat.numChildren}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-slate-600">Version</div>
                    <div className="font-semibold">{nodeData.stat.version}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <div className="text-sm text-slate-600">Node Type</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={nodeData.stat.ephemeralOwner === 0 ? "secondary" : "destructive"}>
                      {nodeData.stat.ephemeralOwner === 0 ? "Persistent" : "Ephemeral"}
                    </Badge>
                    {nodeData.stat.ephemeralOwner !== 0 && (
                      <span className="text-xs text-slate-500">
                        Owner: {nodeData.stat.ephemeralOwner}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="text-sm text-slate-600">Created</div>
                    <div className="text-sm font-mono">{formatTimestamp(nodeData.stat.ctime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div className="flex-1">
                    <div className="text-sm text-slate-600">Modified</div>
                    <div className="text-sm font-mono">{formatTimestamp(nodeData.stat.mtime)}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-600">C Version:</span>
                  <Badge variant="secondary" className="ml-1">{nodeData.stat.cversion}</Badge>
                </div>
                <div>
                  <span className="text-slate-600">A Version:</span>
                  <Badge variant="secondary" className="ml-1">{nodeData.stat.aversion}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Children Section */}
      {nodeData.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Child Nodes ({nodeData.children.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {nodeData.children.map((child) => (
                <Badge 
                  key={child} 
                  variant="outline" 
                  className="justify-start p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  {child}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
