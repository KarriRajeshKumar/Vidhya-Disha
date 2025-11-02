import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Bot, Users, Trophy, BookOpen, GraduationCap, User, Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function CareerHome() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("student-login");
  const [showResetForm, setShowResetForm] = useState(false);
  
  // Student form data
  const [studentData, setStudentData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: ""
  });
  
  // Admin form data
  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  });

  // Reset password email
  const [resetEmail, setResetEmail] = useState("");

  // If user is already logged in, redirect to landing page
  useEffect(() => {
    if (user && !loading) {
      navigate("/landing");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.email || !studentData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email: studentData.email });
      
      const result = await signIn(studentData.email, studentData.password);
      
      console.log('Login result:', result);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account"
      });
      navigate("/landing");
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMessage = "Invalid credentials";
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email address before logging in";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.email || !studentData.password || !studentData.fullName || !studentData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (studentData.password !== studentData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (studentData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting signup with:', { email: studentData.email, name: studentData.fullName });
      
      const result = await signUp(studentData.email, studentData.password, {
        display_name: studentData.fullName,
        user_type: 'student'
      });
      
      console.log('Signup result:', result);
      
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account. A confirmation email has been sent."
      });
      
      // Clear form on success
      setStudentData({
        email: "",
        password: "",
        fullName: "",
        confirmPassword: ""
      });
      
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      let errorMessage = "Failed to create account";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData.email || !adminData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Admin credentials (same as in AdminLogin.tsx)
      const ADMIN_CREDENTIALS = {
        email: 'admin@vidhyadisha.com',
        password: 'VD@Admin2025'
      };

      console.log('Attempting admin login from CareerHome with:', { 
        email: adminData.email, 
        password: adminData.password.substring(0, 3) + '***' 
      });

      // Verify admin credentials (case-insensitive email)
      if (adminData.email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase() && 
          adminData.password.trim() === ADMIN_CREDENTIALS.password) {
        
        console.log('Admin credentials verified successfully from CareerHome');
        
        // Store admin session
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', adminData.email);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard"
        });
        
        // Clear admin form
        setAdminData({ email: '', password: '' });
        
        // Navigate to admin dashboard
        navigate("/admin-dashboard");
      } else {
        console.log('Admin credentials verification failed from CareerHome');
        toast({
          title: "Admin Login Failed",
          description: "Invalid admin credentials. Please check your email and password.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Admin login error from CareerHome:', error);
      toast({
        title: "Admin Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions"
      });
      setResetEmail("");
      setShowResetForm(false);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-main">
      {/* Header */}
      <div className="bg-secondary shadow-primary">
        <div className="container-modern">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">VD</span>
              </div>
              <span className="text-primary-foreground font-semibold text-lg">Vidhya Disha</span>
            </div>
            <div className="text-primary-foreground/80 text-sm">
              Career Development Platform
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-modern max-w-6xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="heading-large text-4xl md:text-5xl mb-6">
              Shape Your <span className="heading-accent">Career Future</span>
            </h1>
            <p className="text-body text-xl mb-8 max-w-3xl mx-auto">
              Discover your potential with AI-powered career guidance, personalized learning paths, 
              and expert mentorship designed for students and professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Career Development Features */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="heading-primary text-2xl mb-6">Why Choose Vidhya Disha?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-primary text-lg mb-2">Personalized Career Guidance</h3>
                    <p className="text-body">AI-driven recommendations based on your skills, interests, and career goals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="heading-primary text-lg mb-2">24/7 AI Mentor</h3>
                    <p className="text-body">Get instant answers to your career questions with our intelligent AI assistant.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-primary text-lg mb-2">Comprehensive Resources</h3>
                    <p className="text-body">Access courses, exam prep, college information, and industry insights.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="heading-primary text-lg mb-2">Track Your Progress</h3>
                    <p className="text-body">Monitor achievements and earn badges as you advance in your career journey.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Authentication */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="card-modern">
                <CardHeader className="text-center">
                  <CardTitle className="heading-primary text-2xl">Get Started Today</CardTitle>
                  <p className="text-secondary">Join thousands of students building successful careers</p>
                </CardHeader>
                <CardContent>
                  {!showResetForm ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="student-login" className="text-sm">
                          <User className="w-4 h-4 mr-2" />
                          Student Login
                        </TabsTrigger>
                        <TabsTrigger value="student-signup" className="text-sm">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Sign Up
                        </TabsTrigger>
                        <TabsTrigger value="admin-login" className="text-sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </TabsTrigger>
                      </TabsList>

                      {/* Student Login */}
                      <TabsContent value="student-login" className="space-y-4">
                        <form onSubmit={handleStudentLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="student-email">Email</Label>
                            <Input
                              id="student-email"
                              type="email"
                              placeholder="Enter your email"
                              value={studentData.email}
                              onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="student-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={studentData.password}
                                onChange={(e) => setStudentData({...studentData, password: e.target.value})}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                          </Button>
                          <div className="text-center">
                            <Button
                              type="button"
                              variant="link"
                              className="text-sm text-primary hover:text-accent"
                              onClick={() => setShowResetForm(true)}
                            >
                              Forgot your password?
                            </Button>
                          </div>
                        </form>
                      </TabsContent>

                      {/* Student Signup */}
                      <TabsContent value="student-signup" className="space-y-4">
                        <form onSubmit={handleStudentSignup} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="student-name">Full Name</Label>
                            <Input
                              id="student-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={studentData.fullName}
                              onChange={(e) => setStudentData({...studentData, fullName: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={studentData.email}
                              onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Create a password (min 6 characters)"
                              value={studentData.password}
                              onChange={(e) => setStudentData({...studentData, password: e.target.value})}
                              required
                              minLength={6}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm your password"
                              value={studentData.confirmPassword}
                              onChange={(e) => setStudentData({...studentData, confirmPassword: e.target.value})}
                              required
                            />
                          </div>
                          <Button type="submit" className="btn-accent w-full" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                          </Button>
                          <p className="text-xs text-secondary text-center">
                            By signing up, you'll receive a confirmation email to verify your account.
                          </p>
                        </form>
                      </TabsContent>

                      {/* Admin Login */}
                      <TabsContent value="admin-login" className="space-y-4">
                        {/* Development Helper */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                          <p className="text-xs text-blue-700 mb-2">Development Credentials:</p>
                          <p className="text-xs text-blue-600">admin@vidhyadisha.com / VD@Admin2025</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                            onClick={() => setAdminData({
                              email: 'admin@vidhyadisha.com',
                              password: 'VD@Admin2025'
                            })}
                          >
                            Auto-fill Credentials
                          </Button>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email</Label>
                            <Input
                              id="admin-email"
                              name="email"
                              type="email"
                              placeholder="Enter admin email"
                              value={adminData.email}
                              onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                              autoComplete="email"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admin-password">Admin Password</Label>
                            <Input
                              id="admin-password"
                              name="password"
                              type="password"
                              placeholder="Enter admin password"
                              value={adminData.password}
                              onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                              autoComplete="current-password"
                              required
                            />
                          </div>
                          <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Admin Sign In"}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    /* Password Reset Form */
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <h3 className="heading-primary text-lg mb-2">Reset Password</h3>
                        <p className="text-secondary text-sm">Enter your email to receive reset instructions</p>
                      </div>
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email Address</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="btn-primary flex-1" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Email"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowResetForm(false)}
                          >
                            Back
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="mt-6 text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">10K+</div>
                    <div className="text-secondary text-xs">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">95%</div>
                    <div className="text-secondary text-xs">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                    <div className="text-secondary text-xs">AI Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA for existing users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="card-accent max-w-2xl mx-auto p-8">
              <h3 className="heading-accent text-2xl mb-4">Already have an account?</h3>
              <p className="text-body mb-6">
                Access your personalized dashboard with career recommendations, progress tracking, and AI mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setActiveTab("student-login")}
                  className="btn-primary"
                >
                  <User className="w-4 h-4 mr-2" />
                  Student Login
                </Button>
                <Button
                  onClick={() => navigate("/admin-login")}
                  className="btn-outline border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Access
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}