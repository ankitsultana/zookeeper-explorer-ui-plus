import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Server, Globe, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Setup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Database className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Setup Guide
            </h1>
            <p className="text-lg text-slate-600">
              How to configure Zookeeper Browser with HTTP Proxy
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Architecture Overview
              </CardTitle>
              <CardDescription>
                Understanding the required setup for Zookeeper Browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/e8d79631-97cb-4a44-a5ad-061f34ad3c05.png" 
                  alt="Zookeeper Browser Architecture Diagram"
                  className="max-w-full h-auto rounded-lg border shadow-lg"
                />
              </div>
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  The Zookeeper Browser requires an HTTP Proxy to communicate with your Zookeeper clusters. 
                  This proxy acts as a bridge between the web frontend and your Zookeeper instances.
                </p>
                <ul className="text-slate-700 space-y-2">
                  <li>• The <strong>Frontend</strong> (this application) can be hosted anywhere or run locally</li>
                  <li>• The <strong>HTTP Proxy</strong> maps paths to different ZK clusters (/dev, /prod, etc.)</li>
                  <li>• Multiple <strong>ZK Clusters</strong> can be accessed through the same proxy</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  HTTP Proxy Setup
                </CardTitle>
                <CardDescription>
                  Required component for ZK communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 text-sm">
                  You need to run an HTTP Proxy like keeper-ui that provides REST API endpoints 
                  for Zookeeper operations.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Recommended Proxy:</h4>
                  <a 
                    href="https://github.com/ankitsultana/keeper-ui" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 underline"
                  >
                    keeper-ui on GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-600" />
                  Self-Hosting Option
                </CardTitle>
                <CardDescription>
                  Host both frontend and proxy together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 text-sm">
                  The keeper-ui repository includes both the HTTP proxy and a version of this frontend.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Benefits:</h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Single deployment</li>
                    <li>• Unified configuration</li>
                    <li>• No CORS issues</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader>
              <CardTitle>Quick Start Steps</CardTitle>
              <CardDescription>
                Get up and running in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="text-slate-700 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <div>
                    <strong>Clone the keeper-ui repository:</strong>
                    <code className="block mt-1 p-2 bg-slate-100 rounded text-sm">
                      git clone https://github.com/ankitsultana/keeper-ui.git
                    </code>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <div>
                    <strong>Configure your Zookeeper connection settings</strong> in the proxy configuration
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <div>
                    <strong>Start the HTTP proxy</strong> and point this frontend to it
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <div>
                    <strong>Begin browsing</strong> your Zookeeper clusters!
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/zookeeper">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Using Zookeeper Browser
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
