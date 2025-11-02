import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const SupabaseTest = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const { toast } = useToast();

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setConnectionStatus(`Connection Error: ${error.message}`);
        toast({
          title: "Connection Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setConnectionStatus('Connection Successful');
        toast({
          title: "Connection Success",
          description: "Supabase is responding correctly"
        });
      }
    } catch (error: any) {
      setConnectionStatus(`Network Error: ${error.message}`);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSignup = async () => {
    if (!testEmail || !testPassword) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            display_name: 'Test User',
            user_type: 'student'
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        console.error('Signup error:', error);
      } else {
        toast({
          title: "Signup Success",
          description: data.user ? "User created successfully! Check your email for verification." : "Signup initiated"
        });
        console.log('Signup success:', data);
      }
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignin = async () => {
    if (!testEmail || !testPassword) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        toast({
          title: "Signin Failed",
          description: error.message,
          variant: "destructive"
        });
        console.error('Signin error:', error);
      } else {
        toast({
          title: "Signin Success",
          description: "User signed in successfully!"
        });
        console.log('Signin success:', data);
      }
    } catch (error: any) {
      toast({
        title: "Signin Error",
        description: error.message,
        variant: "destructive"
      });
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSupabaseConfig = () => {
    const config = {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey.substring(0, 20) + '...',
      authUrl: `${supabase.supabaseUrl}/auth/v1`,
      restUrl: `${supabase.supabaseUrl}/rest/v1`
    };
    
    console.log('Supabase Configuration:', config);
    toast({
      title: "Configuration Logged",
      description: "Check browser console for Supabase config details"
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Connection Status</Label>
            <div className={`p-2 rounded text-sm ${
              connectionStatus.includes('Successful') ? 'bg-green-100 text-green-800' :
              connectionStatus.includes('Error') ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {connectionStatus}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={isLoading}>
              Test Connection
            </Button>
            <Button onClick={checkSupabaseConfig} variant="outline">
              Check Config
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-email">Test Email</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email"
            />
          </div>
          
          <div>
            <Label htmlFor="test-password">Test Password</Label>
            <Input
              id="test-password"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter test password"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testSignup} disabled={isLoading}>
              Test Signup
            </Button>
            <Button onClick={testSignin} disabled={isLoading} variant="outline">
              Test Signin
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> Use a real email for signup testing as Supabase will send verification emails.</p>
            <p><strong>Tip:</strong> Check browser console and network tab for detailed error information.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};