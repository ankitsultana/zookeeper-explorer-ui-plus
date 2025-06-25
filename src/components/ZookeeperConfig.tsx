
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useZookeeper } from '../contexts/ZookeeperContext';
import { ZookeeperConfig as ZKConfig } from '../services/zookeeperService';

export const ZookeeperConfig: React.FC = () => {
  const { config, updateConfig } = useZookeeper();
  const [localConfig, setLocalConfig] = useState<ZKConfig>(config);

  const handleSave = () => {
    updateConfig(localConfig);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Connection Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="httpUrl">HTTP API URL</Label>
          <Input
            id="httpUrl"
            value={localConfig.httpUrl}
            onChange={(e) => setLocalConfig({ ...localConfig, httpUrl: e.target.value })}
            placeholder="http://localhost:12345"
          />
          <p className="text-sm text-slate-600 mt-1">
            Connect to a ZooKeeper HTTP API server (browser-compatible mode only)
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          Apply Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
