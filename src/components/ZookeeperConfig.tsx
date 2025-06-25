
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
          <Label className="text-base font-medium">Connection Mode</Label>
          <RadioGroup 
            value={localConfig.mode} 
            onValueChange={(value: 'http' | 'direct') => 
              setLocalConfig({ ...localConfig, mode: value })
            }
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="http" id="http" />
              <Label htmlFor="http">HTTP API</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct">Direct Client Connection</Label>
            </div>
          </RadioGroup>
        </div>

        {localConfig.mode === 'http' && (
          <div>
            <Label htmlFor="httpUrl">HTTP API URL</Label>
            <Input
              id="httpUrl"
              value={localConfig.httpUrl || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, httpUrl: e.target.value })}
              placeholder="http://localhost:12345"
            />
          </div>
        )}

        {localConfig.mode === 'direct' && (
          <div>
            <Label htmlFor="connectionString">ZooKeeper Connection String</Label>
            <Input
              id="connectionString"
              value={localConfig.connectionString || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, connectionString: e.target.value })}
              placeholder="localhost:2181"
            />
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Apply Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
