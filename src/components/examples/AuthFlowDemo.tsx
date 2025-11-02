import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Mail, CheckCircle, ArrowRight, GraduationCap } from "lucide-react";

/**
 * Auth Flow Demo Component
 * Demonstrates the new authentication system and user flows
 */
export const AuthFlowDemo = () => {
  return (
    <div className="bg-primary-main min-h-screen section-padding">
      <div className="container-modern">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-large text-4xl mb-6">
            🔐 New Authentication System
          </h1>
          <p className="text-body text-xl max-w-3xl mx-auto">
            Comprehensive authentication flow for students and admins with email integration
          </p>
        </div>

        {/* Authentication Options */}
        <section className="mb-16">
          <h2 className="heading-primary text-2xl text-center mb-8">Authentication Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-primary text-xl mb-3">Student Login</h3>
              <p className="text-body mb-4">
                Existing students can log in with their email and password to access their dashboard.
              </p>
              <Badge className="bg-primary/10 text-primary">Email + Password</Badge>
            </div>

            <div className="card-accent text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="heading-accent text-xl mb-3">Student Signup</h3>
              <p className="text-body mb-4">
                New students can register with name, email, and password. Email verification required.
              </p>
              <Badge className="bg-accent/20 text-accent">Registration + Verification</Badge>
            </div>

            <div className="card-primary text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="heading-primary text-xl mb-3">Admin Access</h3>
              <p className="text-body mb-4">
                Administrators can access the system with special admin credentials and permissions.
              </p>
              <Badge className="bg-primary/20 text-primary">Admin Credentials</Badge>
            </div>
          </div>
        </section>

        {/* User Flows */}
        <section className="mb-16">
          <h2 className="heading-primary text-2xl text-center mb-8">User Journey Flows</h2>
          
          {/* New Student Flow */}
          <div className="card-modern mb-8">
            <CardHeader>
              <CardTitle className="heading-accent text-xl flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                New Student Registration Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">1</span>
                  </div>
                  <p className="text-sm text-body">Visit Home Page</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  <p className="text-sm text-body">Click "Sign Up" Tab</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <p className="text-sm text-body">Fill Registration Form</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">4</span>
                  </div>
                  <p className="text-sm text-body">Email Sent</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">5</span>
                  </div>
                  <p className="text-sm text-body">Verify Email</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm text-body">Access Dashboard</p>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Existing Student Flow */}
          <div className="card-modern mb-8">
            <CardHeader>
              <CardTitle className="heading-primary text-xl flex items-center gap-2">
                <User className="w-6 h-6" />
                Existing Student Login Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-sm text-body">Visit Home Page</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-sm text-body">Enter Credentials</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p className="text-sm text-body">Authentication</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-body">Dashboard Access</p>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Password Reset Flow */}
          <div className="card-modern">
            <CardHeader>
              <CardTitle className="heading-primary text-xl flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Password Reset Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-sm text-body">Click "Forgot Password"</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-sm text-body">Enter Email</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-body">Reset Email Sent</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <p className="text-sm text-body">Set New Password</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-body">Login Success</p>
                </div>
              </div>
            </CardContent>
          </div>
        </section>

        {/* Email Integration */}
        <section className="mb-16">
          <h2 className="heading-primary text-2xl text-center mb-8">Email Integration Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-accent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <h3 className="heading-accent text-lg">Automatic Emails</h3>
              </div>
              <ul className="space-y-2 text-body">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Registration confirmation emails</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Email verification links</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Password reset instructions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Login success notifications</span>
                </li>
              </ul>
            </div>

            <div className="card-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="heading-primary text-lg">Security Features</h3>
              </div>
              <ul className="space-y-2 text-body">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Email verification required</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Secure password requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Session management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Supabase database storage</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Implementation Summary */}
        <section>
          <div className="card-hero text-center">
            <h2 className="heading-large text-3xl mb-6">
              ✅ Implementation Complete
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Your home page now features a comprehensive authentication system with career development focus, 
              email integration, and secure user management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-3">🔐 Authentication</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Student login & signup</li>
                  <li>• Admin access system</li>
                  <li>• Password reset flow</li>
                  <li>• Email verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📧 Email System</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Registration confirmations</li>
                  <li>• Verification links</li>
                  <li>• Password reset emails</li>
                  <li>• Success notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🎨 Design</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• Career development focus</li>
                  <li>• 60-30-10 color theme</li>
                  <li>• Mobile responsive</li>
                  <li>• Professional appearance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};