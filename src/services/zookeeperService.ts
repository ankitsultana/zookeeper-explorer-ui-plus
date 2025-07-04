
export interface ZookeeperConfig {
  mode: 'http';
  httpUrl: string;
}

export interface ZNodeStat {
  ctime: number;
  mtime: number;
  version: number;
  cversion: number;
  aversion: number;
  ephemeralOwner: number;
  dataLength: number;
  numChildren: number;
}

export interface ZNodeData {
  path: string;
  data: string;
  children: string[];
  stat: ZNodeStat;
}

class ZookeeperService {
  private config: ZookeeperConfig;

  constructor(config: ZookeeperConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    let url = this.config.httpUrl;
    
    // Add http:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }
    
    return url;
  }

  async getChildren(path: string): Promise<string[]> {
    const response = await fetch(`${this.getBaseUrl()}/ls?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch children: ${response.statusText}`);
    }
    const data = await response.json();
    return data.children || [];
  }

  async getData(path: string): Promise<ZNodeData> {
    const response = await fetch(`${this.getBaseUrl()}/get?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch node data: ${response.statusText}`);
    }
    return await response.json();
  }

  async setData(path: string, data: string): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.statusText}`);
    }
  }

  async create(path: string, data: string = '', isEphemeral: boolean = false): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, data, isEphemeral }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create node: ${response.statusText}`);
    }
  }

  async remove(path: string): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/delete?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete node: ${response.statusText}`);
    }
  }

  disconnect(): void {
    // No-op for HTTP mode
  }
}

export default ZookeeperService;
