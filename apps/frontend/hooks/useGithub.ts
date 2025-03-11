import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface GitHubData {
  repositories?: any[];
  issues?: any[];
  pullRequests?: any[];
}

export const useGithub = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GitHubData>({});

  const checkConnection = async () => {
    try {
      const response = await apiClient.get('/auth/github/status');
      setIsConnected(response.data.isConnected);
      if (response.data.isConnected) {
        await fetchGithubData();
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubData = async () => {
    try {
      const [repos, issues, prs] = await Promise.all([
        apiClient.get('/auth/github/repos'),
        apiClient.get('/auth/github/issues'),
        apiClient.get('/auth/github/pulls')
      ]);

      setData({
        repositories: repos.data,
        issues: issues.data,
        pullRequests: prs.data
      });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    loading,
    data,
    refreshData: fetchGithubData
  };
};
