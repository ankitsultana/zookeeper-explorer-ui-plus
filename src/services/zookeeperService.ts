
import * as zookeeper from 'node-zookeeper-client';

export interface ZookeeperConfig {
  mode: 'http' | 'direct';
  httpUrl?: string;
  connectionString?: string;
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
  private client?: zookeeper.Client;

  constructor(config: ZookeeperConfig) {
    this.config = config;
    if (config.mode === 'direct' && config.connectionString) {
      this.client = zookeeper.createClient(config.connectionString);
      this.client.connect();
    }
  }

  async getChildren(path: string): Promise<string[]> {
    if (this.config.mode === 'http') {
      const response = await fetch(`${this.config.httpUrl}/ls?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch children: ${response.statusText}`);
      }
      const data = await response.json();
      return data.children || [];
    } else {
      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('ZooKeeper client not initialized'));
          return;
        }
        
        this.client.getChildren(path, (error, children) => {
          if (error) {
            reject(error);
          } else {
            resolve(children || []);
          }
        });
      });
    }
  }

  async getData(path: string): Promise<ZNodeData> {
    if (this.config.mode === 'http') {
      const response = await fetch(`${this.config.httpUrl}/get?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch node data: ${response.statusText}`);
      }
      return await response.json();
    } else {
      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('ZooKeeper client not initialized'));
          return;
        }

        this.client.getData(path, (error, data, stat) => {
          if (error) {
            reject(error);
            return;
          }

          this.client.getChildren(path, (childError, children) => {
            if (childError) {
              reject(childError);
              return;
            }

            resolve({
              path,
              data: data ? data.toString('utf8') : '',
              children: children || [],
              stat: {
                ctime: stat.ctime.getTime(),
                mtime: stat.mtime.getTime(),
                version: stat.version,
                cversion: stat.cversion,
                aversion: stat.aversion,
                ephemeralOwner: stat.ephemeralOwner,
                dataLength: stat.dataLength,
                numChildren: stat.numChildren
              }
            });
          });
        });
      });
    }
  }

  async setData(path: string, data: string): Promise<void> {
    if (this.config.mode === 'http') {
      const response = await fetch(`${this.config.httpUrl}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
    } else {
      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('ZooKeeper client not initialized'));
          return;
        }

        this.client.setData(path, Buffer.from(data, 'utf8'), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }

  async create(path: string, data: string = ''): Promise<void> {
    if (this.config.mode === 'http') {
      const response = await fetch(`${this.config.httpUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create node: ${response.statusText}`);
      }
    } else {
      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('ZooKeeper client not initialized'));
          return;
        }

        this.client.create(path, Buffer.from(data, 'utf8'), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }

  async remove(path: string): Promise<void> {
    if (this.config.mode === 'http') {
      const response = await fetch(`${this.config.httpUrl}/delete?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete node: ${response.statusText}`);
      }
    } else {
      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('ZooKeeper client not initialized'));
          return;
        }

        this.client.remove(path, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.close();
    }
  }
}

export default ZookeeperService;
