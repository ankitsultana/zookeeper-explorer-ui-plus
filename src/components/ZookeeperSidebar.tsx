
import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, RefreshCw, Database, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useZookeeper } from '../contexts/ZookeeperContext';

interface TreeNode {
  path: string;
  children: TreeNode[];
  expanded: boolean;
  hasChildren: boolean;
}

interface ZookeeperSidebarProps {
  selectedNode: string;
  onNodeSelect: (path: string) => void;
  onRefresh: () => void;
  refreshTrigger: number;
}

export const ZookeeperSidebar: React.FC<ZookeeperSidebarProps> = ({
  selectedNode,
  onNodeSelect,
  onRefresh,
  refreshTrigger
}) => {
  const { service } = useZookeeper();
  const [tree, setTree] = useState<TreeNode>({
    path: '/',
    children: [],
    expanded: true,
    hasChildren: true
  });
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeData, setNewNodeData] = useState('');
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [selectedParent, setSelectedParent] = useState('/');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchChildren = async (path: string): Promise<string[]> => {
    if (!service) {
      console.error('ZooKeeper service not available');
      return [];
    }

    try {
      return await service.getChildren(path);
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  };

  const loadTreeNode = async (node: TreeNode): Promise<TreeNode> => {
    const children = await fetchChildren(node.path);
    const childNodes: TreeNode[] = await Promise.all(
      children.map(async (child) => {
        const childPath = node.path === '/' ? `/${child}` : `${node.path}/${child}`;
        const grandChildren = await fetchChildren(childPath);
        return {
          path: childPath,
          children: [],
          expanded: false,
          hasChildren: grandChildren.length > 0
        };
      })
    );

    return {
      ...node,
      children: childNodes,
      hasChildren: children.length > 0
    };
  };

  const toggleNode = async (path: string) => {
    const updateTree = async (node: TreeNode): Promise<TreeNode> => {
      if (node.path === path) {
        if (!node.expanded && node.children.length === 0) {
          const updatedNode = await loadTreeNode(node);
          return { ...updatedNode, expanded: true };
        }
        return { ...node, expanded: !node.expanded };
      }

      const updatedChildren = await Promise.all(
        node.children.map(child => updateTree(child))
      );
      
      return { ...node, children: updatedChildren };
    };

    const newTree = await updateTree(tree);
    setTree(newTree);
  };

  const handleNodeClick = (node: TreeNode) => {
    onNodeSelect(node.path);
  };

  const handleToggleClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.hasChildren) {
      toggleNode(node.path);
    }
  };

  const createNode = async () => {
    if (!service) {
      toast({
        title: "Error",
        description: "ZooKeeper service not available",
        variant: "destructive",
      });
      return;
    }

    if (!newNodeName.trim()) {
      toast({
        title: "Error",
        description: "Node name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const fullPath = selectedParent === '/' ? `/${newNodeName}` : `${selectedParent}/${newNodeName}`;
    
    try {
      await service.create(fullPath, newNodeData, isEphemeral);

      toast({
        title: "Success",
        description: `Node ${fullPath} created successfully${isEphemeral ? ' (ephemeral)' : ''}`,
      });

      setNewNodeName('');
      setNewNodeData('');
      setIsEphemeral(false);
      setDialogOpen(false);
      
      // Refresh the tree and trigger parent refresh
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create node",
        variant: "destructive",
      });
    }
  };

  const refreshTree = async () => {
    const newTree = await loadTreeNode({
      path: '/',
      children: [],
      expanded: true,
      hasChildren: true
    });
    setTree(newTree);
  };

  // Initial load and refresh when refreshTrigger changes
  useEffect(() => {
    if (service) {
      refreshTree();
    }
  }, [service, refreshTrigger]);

  const renderTree = (node: TreeNode, level: number = 0) => {
    const isSelected = node.path === selectedNode;
    
    // Use folder icons for nodes that have children in ZooKeeper, page icon for leaf nodes
    const Icon = node.hasChildren 
      ? (node.expanded ? FolderOpen : Folder)
      : FileText;
    
    const ChevronIcon = node.expanded ? ChevronDown : ChevronRight;

    return (
      <div key={node.path}>
        <SidebarMenuItem>
          <div className="flex items-center w-full group/menu-item">
            <SidebarMenuButton
              onClick={() => handleNodeClick(node)}
              className={`flex-1 justify-start ${isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-slate-100'} transition-colors`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {node.hasChildren && (
                    <div
                      onClick={(e) => handleToggleClick(node, e)}
                      className="p-0 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
                    >
                      <ChevronIcon className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <Icon className={`h-4 w-4 shrink-0 ${node.hasChildren ? 'text-blue-600' : 'text-slate-600'}`} />
                <span className="truncate text-sm">{node.path === '/' ? 'root' : node.path.split('/').pop()}</span>
              </div>
            </SidebarMenuButton>
            <div
              className="h-6 w-6 p-0 opacity-0 group-hover/menu-item:opacity-100 transition-opacity shrink-0 hover:bg-slate-200 rounded-sm flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedParent(node.path);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
            </div>
          </div>
        </SidebarMenuItem>
        {node.expanded && node.children.map(child => renderTree(child, level + 1))}
      </div>
    );
  };

  return (
    <Sidebar className="border-r bg-white/50 backdrop-blur-sm">
      <SidebarHeader className="border-b bg-white/80 p-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-slate-800">ZK Tree</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshTree}
            className="ml-auto h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderTree(tree)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New ZNode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="parent">Parent Path</Label>
              <Input
                id="parent"
                value={selectedParent}
                readOnly
                className="bg-slate-50"
              />
            </div>
            <div>
              <Label htmlFor="name">Node Name</Label>
              <Input
                id="name"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Enter node name"
              />
            </div>
            <div>
              <Label htmlFor="data">Initial Data (optional)</Label>
              <Input
                id="data"
                value={newNodeData}
                onChange={(e) => setNewNodeData(e.target.value)}
                placeholder="Enter initial data"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ephemeral"
                checked={isEphemeral}
                onCheckedChange={(checked) => setIsEphemeral(checked === true)}
              />
              <Label htmlFor="ephemeral" className="text-sm font-normal">
                Create as ephemeral node
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createNode}>
                Create Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};
