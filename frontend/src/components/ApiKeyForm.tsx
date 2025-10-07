import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const ApiKeyForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isValid = await apiService.validateApiKey(apiKey);
      
      if (isValid) {
        apiService.setApiKey(apiKey);
        navigate('/jobs');
      } else {
        setError('Invalid API key. Please check your key and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">JobHarvester</CardTitle>
          <CardDescription className="text-lg">
            Enter your Greenhouse API key to access job listings and candidate information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <Input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Greenhouse API key"
                required
                className="w-full"
              />
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !apiKey.trim()}
              size="lg"
            >
              {loading ? 'Validating...' : 'Continue'}
            </Button>
          </form>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">Demo API Key:</h4>
              <Badge variant="secondary">Sandbox</Badge>
            </div>
            <div className="bg-background p-3 rounded border font-mono text-sm">
              08c74138d0466463988a945a8becdeaa-9
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is a sandbox key with fake data for demonstration purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyForm;
