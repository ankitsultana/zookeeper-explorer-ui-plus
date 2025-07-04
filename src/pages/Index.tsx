import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ArrowRight, TreePine, Search, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Database className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Zookeeper Browser
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A modern, intuitive interface for browsing and managing your Apache Zookeeper ensemble. 
            Navigate your ZNode hierarchy with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <TreePine className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Tree Navigation</CardTitle>
              <CardDescription>
                Browse your ZNode hierarchy with an intuitive tree structure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Node Details</CardTitle>
              <CardDescription>
                View comprehensive information about each ZNode including data and statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Node Management</CardTitle>
              <CardDescription>
                Create, edit, and delete ZNodes directly from the browser interface
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Database className="h-5 w-5" />
                Get Started
              </CardTitle>
              <CardDescription className="text-center pt-2">
                Connect to your Zookeeper Instance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/zookeeper">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Open Zookeeper Browser
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Settings className="h-5 w-5" />
                How to Setup
              </CardTitle>
              <CardDescription className="text-center pt-2">
                Learn about the required architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/setup">
                <Button size="lg" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                  View Setup Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 text-sm">
            Source:{" "}
            <a 
              href="https://github.com/ankitsultana/keeper-ui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              https://github.com/ankitsultana/keeper-ui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
