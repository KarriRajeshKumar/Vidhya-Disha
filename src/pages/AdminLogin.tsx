import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Admin credentials (in production, this should be handled by backend)
  const ADMIN_CREDENTIALS = {
    email: 'admin@vidhyadisha.com',
    password: 'VD@Admin2025'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting admin login with:', { 
        email: formData.email, 
        password: formData.password.substring(0, 3) + '***' 
      });
      console.log('Expected credentials:', ADMIN_CREDENTIALS);

      // Verify admin credentials (case-insensitive email)
      if (formData.email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase() && 
          formData.password.trim() === ADMIN_CREDENTIALS.password) {
        
        console.log('Admin credentials verified successfully');
        
        // Store admin session
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', formData.email);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        toast.success('Admin login successful! Redirecting to dashboard...');
        
        // Small delay to show success message
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1000);
        
      } else {
        console.log('Admin credentials verification failed');
        console.log('Email match:', formData.email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase());
        console.log('Password match:', formData.password.trim() === ADMIN_CREDENTIALS.password);
        
        toast.error('Access Denied: Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9FF] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1E88E5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFB74D]/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white border-[#1E88E5]/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-[#1E88E5] to-[#FFB74D] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-[#1E88E5] font-['Montserrat']">
              Admin Access
            </CardTitle>
            <p className="text-gray-600 font-['Poppins']">
              Secure login for community verification
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-['Poppins'] font-medium">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@vidhyadisha.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-[#1E88E5]/30 focus:border-[#1E88E5] focus:ring-[#1E88E5]/20"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-['Poppins'] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="border-[#1E88E5]/30 focus:border-[#1E88E5] focus:ring-[#1E88E5]/20 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Auto-fill button for development */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-3 border-[#1E88E5]/30 text-[#1E88E5] hover:bg-[#1E88E5]/10"
                onClick={() => setFormData({
                  email: ADMIN_CREDENTIALS.email,
                  password: ADMIN_CREDENTIALS.password
                })}
              >
                Auto-fill Admin Credentials
              </Button>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#1976D2] hover:from-[#1976D2] hover:to-[#1565C0] text-white font-['Poppins'] font-semibold py-3 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Admin Dashboard
                  </div>
                )}
              </Button>
            </form>

            {/* Development Credentials Helper */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 font-['Poppins'] text-sm">
                    Development Credentials
                  </h4>
                  <div className="text-xs font-['Poppins'] mt-2 space-y-1">
                    <p><strong>Email:</strong> admin@vidhyadisha.com</p>
                    <p><strong>Password:</strong> VD@Admin2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-[#FFB74D]/10 border border-[#FFB74D]/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FFB74D] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#FFB74D] font-['Poppins'] text-sm">
                    Secure Access Required
                  </h4>
                  <p className="text-gray-600 text-xs font-['Poppins'] mt-1">
                    This area is restricted to authorized administrators only. All access attempts are logged.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#1E88E5] hover:text-[#1976D2] font-['Poppins']"
          >
            ← Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}