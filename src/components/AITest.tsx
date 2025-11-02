import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateResponse, testAIConnection } from '@/services/aiService';

export function AITest() {
  const [testPrompt, setTestPrompt] = useState('Hello, please respond with "AI is working!"');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResponse('');
    
    try {
      console.log('🧪 Starting AI test...');
      const result = await generateResponse(testPrompt);
      setResponse(result);
      console.log('✅ Test completed successfully');
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionTest = async () => {
    setLoading(true);
    try {
      const isWorking = await testAIConnection();
      setConnectionStatus(isWorking);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Service Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleConnectionTest} disabled={loading}>
            Test Connection
          </Button>
          {connectionStatus !== null && (
            <div className={`px-3 py-1 rounded text-sm ${
              connectionStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus ? '✅ Connected' : '❌ Using Fallback'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Input
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter test prompt"
          />
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test AI Response'}
          </Button>
        </div>
        
        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Response:</h4>
            <div className="whitespace-pre-wrap text-sm">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}