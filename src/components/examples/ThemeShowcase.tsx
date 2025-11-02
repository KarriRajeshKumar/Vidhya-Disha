import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Users, Sparkles } from "lucide-react";

/**
 * Theme Showcase Component
 * Demonstrates the Calm & Trustworthy Blue-Orange design system
 * Following the 60-30-10 color rule
 */
export const ThemeShowcase = () => {
  return (
    <div className="bg-primary-main min-h-screen">
      {/* Hero Section - Primary Background (60%) */}
      <section className="section-padding-lg bg-primary-main">
        <div className="container-modern text-center">
          <h1 className="heading-large text-5xl md:text-6xl mb-6 animate-fade-in">
            Calm & Trustworthy Design
          </h1>
          <p className="text-body text-xl mb-8 max-w-3xl mx-auto animate-slide-in">
            Experience our student-focused AI career guidance platform with beautiful, 
            modern design that promotes focus and trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <button className="btn-primary">
              Get Started Today
            </button>
            <button className="btn-accent">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Typography Examples */}
      <section className="section-padding bg-primary-main">
        <div className="container-modern space-y-6">
          <h2 className="heading-primary text-3xl text-center mb-8">Typography System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="heading-primary text-2xl">Primary Headings</h3>
              <h4 className="heading-accent text-xl">Accent Headings</h4>
              <p className="text-body">
                Body text using Poppins (400-500 weight) for optimal readability during 
                long study sessions. Perfect for educational content.
              </p>
              <p className="text-secondary">
                Secondary text for less important information, maintaining good contrast 
                while being visually subordinate.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="heading-large text-2xl">Large Display Text</h3>
              <p className="text-body-medium">
                Medium weight body text (500) for emphasis without being too bold. 
                Great for important paragraphs and descriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Button System - 30% Secondary, 10% Accent */}
      <section className="section-padding bg-primary-soft">
        <div className="container-modern">
          <h3 className="heading-primary text-2xl text-center mb-8">Interactive Button System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-4">
              <h4 className="heading-accent text-lg">Primary Buttons</h4>
              <button className="btn-primary w-full">
                Secondary Color (30%)
              </button>
              <p className="text-secondary text-sm">
                Main actions using secondary color
              </p>
            </div>
            <div className="text-center space-y-4">
              <h4 className="heading-accent text-lg">Accent Buttons</h4>
              <button className="btn-accent w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Accent Color (10%)
              </button>
              <p className="text-secondary text-sm">
                Call-to-action with hover glow
              </p>
            </div>
            <div className="text-center space-y-4">
              <h4 className="heading-accent text-lg">Outline Style</h4>
              <button className="btn-outline w-full">
                Learn More
              </button>
              <p className="text-secondary text-sm">
                Secondary actions with hover fill
              </p>
            </div>
            <div className="text-center space-y-4">
              <h4 className="heading-accent text-lg">Soft Style</h4>
              <button className="btn-soft w-full">
                Explore
              </button>
              <p className="text-secondary text-sm">
                Subtle emphasis with gentle hover
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Card System */}
      <section className="section-padding bg-primary-main">
        <div className="container-modern">
          <h3 className="heading-primary text-2xl text-center mb-8">Modern Card System</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Modern Standard Card */}
            <div className="card-modern animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h4 className="heading-primary text-lg">Learning Path</h4>
              </div>
              <p className="text-body mb-4">
                Modern card with soft shadows, rounded corners, and smooth hover animations. 
                Perfect for educational content.
              </p>
              <Badge className="bg-primary/10 text-primary border border-primary/20">
                Primary Background (60%)
              </Badge>
            </div>

            {/* Accent Card */}
            <div className="card-accent animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h4 className="heading-accent text-lg">Career Goals</h4>
              </div>
              <p className="text-body mb-4">
                Accent card using the warm orange color (10% rule) for special features 
                and call-to-action content.
              </p>
              <Badge className="bg-accent/20 text-accent border border-accent/30">
                Accent Color (10%)
              </Badge>
            </div>

            {/* Primary Feature Card */}
            <div className="card-primary animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="heading-primary text-lg">Expert Mentorship</h4>
              </div>
              <p className="text-body mb-4">
                Primary feature card using secondary color (30% rule) for important 
                sections and key features.
              </p>
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                Secondary Color (30%)
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Card Section */}
      <section className="section-padding bg-secondary">
        <div className="container-modern">
          <div className="card-hero text-center animate-scale-in">
            <h3 className="heading-large text-3xl mb-4">
              AI-Powered Career Guidance
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Experience the future of education with our intelligent mentorship system
            </p>
            <button className="btn-accent animate-float">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Animation Examples */}
      <section className="section-padding bg-primary-main">
        <div className="container-modern">
          <h3 className="heading-primary text-2xl text-center mb-8">Smooth Animations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern text-center animate-pulse-glow">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="heading-primary text-lg mb-2">Pulse Glow</h4>
              <p className="text-secondary">Gentle pulsing animation for important elements</p>
            </div>
            
            <div className="card-accent text-center animate-accent-pulse">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent-foreground" />
              </div>
              <h4 className="heading-accent text-lg mb-2">Accent Pulse</h4>
              <p className="text-secondary">Warm accent glow for call-to-action elements</p>
            </div>
            
            <div className="card-primary text-center animate-float">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="heading-primary text-lg mb-2">Float Animation</h4>
              <p className="text-secondary">Subtle floating motion for engaging interactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Rule Demonstration */}
      <section className="section-padding bg-accent-soft">
        <div className="container-modern text-center">
          <h3 className="heading-large text-2xl mb-8">60-30-10 Color Rule Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-main p-6 rounded-2xl border-2 border-background">
              <h4 className="heading-primary text-xl mb-3">Primary (60%)</h4>
              <div className="w-16 h-16 bg-background rounded-xl mx-auto mb-3"></div>
              <p className="text-body">#F4F9FF - Main backgrounds, content areas</p>
            </div>
            <div className="bg-secondary p-6 rounded-2xl">
              <h4 className="heading-large text-xl mb-3">Secondary (30%)</h4>
              <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-3"></div>
              <p className="text-primary-foreground">#1E88E5 - Navbars, titles, major buttons</p>
            </div>
            <div className="bg-accent p-6 rounded-2xl">
              <h4 className="heading-large text-xl mb-3">Accent (10%)</h4>
              <div className="w-16 h-16 bg-accent rounded-xl mx-auto mb-3 opacity-80"></div>
              <p className="text-accent-foreground">#FFB74D - Highlights, icons, CTAs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};