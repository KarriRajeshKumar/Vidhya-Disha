import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Handle password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for the password reset link.",
        });
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          if (!data.session) {
            toast({
              title: "Account Created",
              description: "Please check your email to verify your account before signing in.",
            });
            // Switch to sign in mode after successful signup
            setIsSignUp(false);
          } else {
            toast({
              title: "Success",
              description: "Account created and signed in successfully!",
            });
            onAuthSuccess?.();
            navigate("/dashboard");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          if (!data.user.email_confirmed_at) {
            toast({
              title: "Email Not Verified",
              description: "Please check your email for verification link before signing in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success",
              description: "Signed in successfully!",
            });
            onAuthSuccess?.();
            navigate("/dashboard");
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isForgotPassword 
            ? "Reset Password" 
            : isSignUp 
            ? "Create Account" 
            : "Sign In"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isForgotPassword 
              ? "Send Reset Link" 
              : isSignUp 
              ? "Create Account" 
              : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          {!isForgotPassword && (
            <>
              <div>
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Button>
              </div>
              <div>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setIsSignUp(false);
                  }}
                  className="text-sm"
                >
                  Forgot password?
                </Button>
              </div>
            </>
          )}
          {isForgotPassword && (
            <Button
              variant="link"
              onClick={() => setIsForgotPassword(false)}
              className="text-sm"
            >
              Back to Sign In
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}