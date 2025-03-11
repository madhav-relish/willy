import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "../ui/button";
import { GithubIcon } from "lucide-react";

export const GithubIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGithubConnection();
  }, []);

  const checkGithubConnection = async () => {
    try {
      const { data } = await apiClient.get('/auth/github/status');
      setIsConnected(data.isConnected);
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { data } = await apiClient.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`);
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error initiating GitHub connection:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await apiClient.post('/auth/github/disconnect');
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <GithubIcon className="w-16 h-16 mb-4" />
      <h3 className="text-lg font-semibold mb-2">GitHub</h3>
      <p className="text-sm text-center mb-4">
        Connect your GitHub account to sync repositories and issues
      </p>
      <Button
        onClick={isConnected ? handleDisconnect : handleConnect}
        variant={isConnected ? "destructive" : "default"}
      >
        {isConnected ? 'Disconnect' : 'Connect GitHub'}
      </Button>
    </div>
  );
};
