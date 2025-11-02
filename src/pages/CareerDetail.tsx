import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Code, Lightbulb, Target, Users, GraduationCap, Briefcase, TrendingUp, Building, Loader2, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Extended career data with detailed information
const detailedCareerData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Software Engineer',
    description: 'A software engineer designs, develops, and maintains software applications and systems. They solve complex problems using programming languages and development tools.',
    category: 'technology',
    salaryRange: '₹3,00,000 - ₹12,00,000 per year',
    icon: '💻',
    marketDemand: 'High',
    workLifeBalance: 'Good',
    jobSecurity: 'High',
    whyMatters: 'Software engineers are the backbone of the digital economy, creating the applications and systems that power our modern world. They drive innovation, improve efficiency, and create solutions that impact millions of lives globally.',
    jobSatisfaction: 95,
    growthRate: 22,
    requiredSkills: [
      { name: 'Programming', icon: Code },
      { name: 'Problem Solving', icon: Lightbulb },
      { name: 'Analytical Thinking', icon: Target },
      { name: 'Team Collaboration', icon: Users }
    ],
    educationRequirements: [
      'Computer Science',
      'Software Engineering',
      'Information Technology'
    ],
    typicalDuration: '4 years Bachelor\'s degree or equivalent experience',
    careerRoadmap: [
      {
        stage: '12th Science',
        description: 'Complete 12th with Physics, Chemistry, and Mathematics',
        duration: '2 years',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'B.Tech (CS/IT)',
        description: 'Pursue Bachelor\'s in Computer Science or Information Technology',
        duration: '4 years',
        icon: GraduationCap,
        color: 'blue'
      },
      {
        stage: 'Entry-Level Developer',
        description: 'Start as Junior Software Developer or Intern',
        duration: '1-2 years',
        icon: Code,
        color: 'green'
      },
      {
        stage: 'Mid-Level Engineer',
        description: 'Become Software Engineer or Senior Developer',
        duration: '2-3 years',
        icon: Target,
        color: 'orange'
      },
      {
        stage: 'Senior Engineer/Manager',
        description: 'Lead technical teams or become Engineering Manager',
        duration: '3-5 years',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'Web Developer', icon: '🌐' },
      { name: 'Mobile App Developer', icon: '📱' },
      { name: 'Full Stack Developer', icon: '💻' },
      { name: 'AI/ML Engineer', icon: '🤖' },
      { name: 'Data Scientist', icon: '📊' }
    ],
    industries: [
      'IT Services',
      'E-commerce',
      'Fintech',
      'Healthcare Technology',
      'Gaming'
    ],
    marketDemandText: 'Software engineers are in high demand across all industries, with excellent job security and growth opportunities.'
  },
  '2': {
    id: '2',
    title: 'Chartered Accountant',
    description: 'A Chartered Accountant (CA) provides financial advice, auditing services, and tax consulting to businesses and individuals.',
    category: 'finance',
    salaryRange: '₹5,00,000 - ₹20,00,000 per year',
    icon: '📊',
    marketDemand: 'High',
    workLifeBalance: 'Challenging',
    jobSecurity: 'High',
    whyMatters: 'Chartered Accountants are essential for financial transparency and compliance, helping businesses make informed decisions and maintain regulatory standards.',
    jobSatisfaction: 85,
    growthRate: 15,
    requiredSkills: [
      { name: 'Financial Analysis', icon: TrendingUp },
      { name: 'Attention to Detail', icon: Target },
      { name: 'Communication', icon: Users },
      { name: 'Problem Solving', icon: Lightbulb }
    ],
    educationRequirements: [
      'Commerce with Accounting',
      'CA Foundation',
      'CA Intermediate & Final'
    ],
    typicalDuration: '5-6 years including articleship',
    careerRoadmap: [
      {
        stage: '12th Commerce',
        description: 'Complete 12th with Commerce stream',
        duration: '2 years',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'CA Foundation',
        description: 'Clear CA Foundation examination',
        duration: '1 year',
        icon: Target,
        color: 'blue'
      },
      {
        stage: 'CA Intermediate',
        description: 'Complete CA Intermediate & Articleship',
        duration: '3 years',
        icon: Briefcase,
        color: 'green'
      },
      {
        stage: 'CA Final',
        description: 'Clear CA Final examination',
        duration: '1 year',
        icon: GraduationCap,
        color: 'orange'
      },
      {
        stage: 'Chartered Accountant',
        description: 'Practice as qualified CA or join firms',
        duration: 'Career',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'Auditor', icon: '🔍' },
      { name: 'Tax Consultant', icon: '📋' },
      { name: 'Financial Advisor', icon: '💰' },
      { name: 'Corporate Finance', icon: '🏢' },
      { name: 'Investment Analyst', icon: '📈' }
    ],
    industries: [
      'Banking & Finance',
      'Consulting',
      'Corporate',
      'Government',
      'Real Estate'
    ],
    marketDemandText: 'CAs are always in demand for their expertise in financial management, taxation, and compliance across all business sectors.'
  },
  '3': {
    id: '3',
    title: 'Doctor',
    description: 'A doctor is a medical professional who diagnoses, treats, and prevents diseases and injuries. They provide comprehensive medical care to patients across various specialties.',
    category: 'healthcare',
    salaryRange: '₹6,00,000 - ₹25,00,000 per year',
    icon: '❤️',
    marketDemand: 'High',
    workLifeBalance: 'Challenging',
    jobSecurity: 'High',
    whyMatters: 'Doctors are essential for public health, saving lives and improving quality of life. They make critical decisions under pressure and contribute directly to community wellbeing.',
    jobSatisfaction: 90,
    growthRate: 12,
    requiredSkills: [
      { name: 'Medical Knowledge', icon: GraduationCap },
      { name: 'Problem Solving', icon: Lightbulb },
      { name: 'Communication', icon: Users },
      { name: 'Empathy', icon: Target }
    ],
    educationRequirements: [
      'MBBS (Bachelor of Medicine and Bachelor of Surgery)',
      'Medical Entrance Exams (NEET)',
      'Specialization (MD/MS) - Optional'
    ],
    typicalDuration: '5.5 years MBBS + 1 year internship + 3 years for specialization',
    careerRoadmap: [
      {
        stage: '12th Science',
        description: 'Complete 12th with Biology, Physics, Chemistry',
        duration: '2 years',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'NEET & MBBS',
        description: 'Clear NEET entrance exam and pursue MBBS',
        duration: '5.5 years',
        icon: GraduationCap,
        color: 'blue'
      },
      {
        stage: 'Internship',
        description: 'Complete mandatory internship in hospitals',
        duration: '1 year',
        icon: Briefcase,
        color: 'green'
      },
      {
        stage: 'Practice/Specialization',
        description: 'Start practice or pursue MD/MS specialization',
        duration: '3+ years',
        icon: Target,
        color: 'orange'
      },
      {
        stage: 'Senior Doctor',
        description: 'Become senior consultant or lead medical teams',
        duration: '5+ years',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'General Physician', icon: '🩺' },
      { name: 'Surgeon', icon: '🔬' },
      { name: 'Pediatrician', icon: '👶' },
      { name: 'Cardiologist', icon: '❤️' },
      { name: 'Radiologist', icon: '📷' }
    ],
    industries: [
      'Hospitals',
      'Private Clinics',
      'Government Health Services',
      'Medical Research',
      'Public Health'
    ],
    marketDemandText: 'Medical professionals are in constant demand across all healthcare sectors, with excellent job security and growth opportunities.'
  },
  '4': {
    id: '4',
    title: 'UX/UI Designer',
    description: 'UX/UI designers create user-friendly and visually appealing digital interfaces. They focus on user experience research, interface design, and creating seamless digital interactions.',
    category: 'design',
    salaryRange: '₹4,00,000 - ₹15,00,000 per year',
    icon: '🎨',
    marketDemand: 'High',
    workLifeBalance: 'Excellent',
    jobSecurity: 'Medium',
    whyMatters: 'UX/UI designers shape how millions of users interact with digital products, making technology accessible and enjoyable while driving business success through good design.',
    jobSatisfaction: 88,
    growthRate: 18,
    requiredSkills: [
      { name: 'Design Thinking', icon: Lightbulb },
      { name: 'User Research', icon: Target },
      { name: 'Visual Design', icon: Code },
      { name: 'Collaboration', icon: Users }
    ],
    educationRequirements: [
      'Design or related degree',
      'Portfolio of design work',
      'UX/UI design courses and certifications'
    ],
    typicalDuration: '3-4 years degree + portfolio development + continuous learning',
    careerRoadmap: [
      {
        stage: 'Learn Design Basics',
        description: 'Study design principles, tools, and user psychology',
        duration: '6-12 months',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'Build Portfolio',
        description: 'Create projects and build a strong design portfolio',
        duration: '6-12 months',
        icon: Code,
        color: 'blue'
      },
      {
        stage: 'Junior Designer',
        description: 'Start as Junior UX/UI Designer or intern',
        duration: '1-2 years',
        icon: Briefcase,
        color: 'green'
      },
      {
        stage: 'Mid-Level Designer',
        description: 'Work on complex projects and lead design initiatives',
        duration: '2-3 years',
        icon: Target,
        color: 'orange'
      },
      {
        stage: 'Senior Designer/Lead',
        description: 'Lead design teams or become Design Manager',
        duration: '3+ years',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'UX Designer', icon: '🧠' },
      { name: 'UI Designer', icon: '🎯' },
      { name: 'Product Designer', icon: '📱' },
      { name: 'Visual Designer', icon: '🎨' },
      { name: 'Design Researcher', icon: '🔍' }
    ],
    industries: [
      'Tech Companies',
      'Design Agencies',
      'E-commerce',
      'Fintech',
      'Gaming'
    ],
    marketDemandText: 'UX/UI designers are in high demand as businesses prioritize digital transformation and user experience across all industries.'
  },
  '5': {
    id: '5',
    title: 'Data Scientist',
    description: 'Data scientists analyze complex data to help organizations make informed decisions. They use statistical methods, machine learning, and programming to extract insights from large datasets.',
    category: 'technology',
    salaryRange: '₹5,00,000 - ₹18,00,000 per year',
    icon: '📈',
    marketDemand: 'Very High',
    workLifeBalance: 'Good',
    jobSecurity: 'High',
    whyMatters: 'Data scientists drive decision-making in the data-driven economy, helping organizations optimize operations, predict trends, and create intelligent systems that impact billions of users.',
    jobSatisfaction: 92,
    growthRate: 35,
    requiredSkills: [
      { name: 'Statistics & Math', icon: Target },
      { name: 'Programming', icon: Code },
      { name: 'Machine Learning', icon: Lightbulb },
      { name: 'Communication', icon: Users }
    ],
    educationRequirements: [
      'Statistics, Mathematics, or Computer Science degree',
      'Data Science certifications',
      'Programming skills (Python/R)'
    ],
    typicalDuration: '4 years degree + additional certifications and practical experience',
    careerRoadmap: [
      {
        stage: '12th Science/Math',
        description: 'Complete 12th with Mathematics and Science',
        duration: '2 years',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'STEM Degree',
        description: 'Pursue degree in Statistics, Math, CS, or related field',
        duration: '4 years',
        icon: GraduationCap,
        color: 'blue'
      },
      {
        stage: 'Data Analyst',
        description: 'Start as Data Analyst or Junior Data Scientist',
        duration: '1-2 years',
        icon: Briefcase,
        color: 'green'
      },
      {
        stage: 'Data Scientist',
        description: 'Work on ML models and advanced analytics',
        duration: '2-3 years',
        icon: Target,
        color: 'orange'
      },
      {
        stage: 'Senior/Lead Data Scientist',
        description: 'Lead data science teams and strategic initiatives',
        duration: '3+ years',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'Data Analyst', icon: '📊' },
      { name: 'ML Engineer', icon: '🤖' },
      { name: 'Research Scientist', icon: '🔬' },
      { name: 'Business Intelligence Analyst', icon: '💡' },
      { name: 'AI Specialist', icon: '🧠' }
    ],
    industries: [
      'Technology',
      'Finance & Banking',
      'Healthcare',
      'E-commerce',
      'Consulting'
    ],
    marketDemandText: 'Data scientists are among the most sought-after professionals as organizations increasingly rely on data-driven insights for competitive advantage.'
  },
  '6': {
    id: '6',
    title: 'Marketing Manager',
    description: 'Marketing managers develop and execute marketing strategies to promote products and services. They lead marketing campaigns, analyze market trends, and manage marketing teams.',
    category: 'business',
    salaryRange: '₹4,00,000 - ₹16,00,000 per year',
    icon: '📢',
    marketDemand: 'High',
    workLifeBalance: 'Good',
    jobSecurity: 'Medium',
    whyMatters: 'Marketing managers bridge the gap between products and customers, driving business growth and creating brand awareness that shapes consumer behavior and market trends.',
    jobSatisfaction: 85,
    growthRate: 14,
    requiredSkills: [
      { name: 'Strategy Planning', icon: Target },
      { name: 'Communication', icon: Users },
      { name: 'Creative Thinking', icon: Lightbulb },
      { name: 'Data Analysis', icon: Code }
    ],
    educationRequirements: [
      'Marketing, Business, or related degree',
      'Digital marketing certifications',
      'MBA (preferred for senior roles)'
    ],
    typicalDuration: '3-4 years degree + 2-5 years experience for management roles',
    careerRoadmap: [
      {
        stage: '12th Any Stream',
        description: 'Complete 12th in any stream with good communication skills',
        duration: '2 years',
        icon: GraduationCap,
        color: 'purple'
      },
      {
        stage: 'Marketing Degree',
        description: 'Pursue BBA/BCom in Marketing or related field',
        duration: '3-4 years',
        icon: GraduationCap,
        color: 'blue'
      },
      {
        stage: 'Marketing Executive',
        description: 'Start as Marketing Executive or Coordinator',
        duration: '1-2 years',
        icon: Briefcase,
        color: 'green'
      },
      {
        stage: 'Marketing Manager',
        description: 'Lead marketing campaigns and teams',
        duration: '3-5 years',
        icon: Target,
        color: 'orange'
      },
      {
        stage: 'Senior Manager/Director',
        description: 'Head marketing departments or become CMO',
        duration: '5+ years',
        icon: Users,
        color: 'red'
      }
    ],
    jobRoles: [
      { name: 'Digital Marketing Manager', icon: '💻' },
      { name: 'Brand Manager', icon: '🏷️' },
      { name: 'Content Marketing Manager', icon: '📝' },
      { name: 'Product Marketing Manager', icon: '📦' },
      { name: 'Growth Marketing Manager', icon: '📈' }
    ],
    industries: [
      'FMCG',
      'Technology',
      'E-commerce',
      'Media & Entertainment',
      'Healthcare'
    ],
    marketDemandText: 'Marketing managers are essential across all industries as businesses compete for customer attention in increasingly crowded markets.'
  }
  // Add more detailed career data as needed
};

export default function CareerDetail() {
  const { careerId } = useParams();
  const { user } = useAuth();
  const career = careerId ? detailedCareerData[careerId] : null;
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  if (!career) {
    return <Navigate to="/career-paths" replace />;
  }

  const getIconComponent = (IconComponent: any, color: string) => {
    const colors = {
      purple: 'text-purple-600 bg-purple-100',
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const generateRoadmap = async () => {
    if (!user || !careerId) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-career-roadmap', {
        body: { careerId, userId: user.id }
      });

      if (error) throw error;

      setRoadmapData(data);
      setShowRoadmap(true);
      toast.success('Career roadmap generated successfully!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate career roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/career-paths">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Career Explorer
          </Button>
        </Link>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">{career.icon}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{career.title}</h1>
                <p className="text-muted-foreground capitalize">{career.category}</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {career.salaryRange}
                  </Badge>
                  <Badge variant="outline">{career.marketDemand} Growth</Badge>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {career.description}
            </p>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Why This Career Matters
              </CardTitle>
              <p className="text-sm text-muted-foreground">Building the digital future</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{career.whyMatters}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{career.jobSatisfaction}%</div>
                  <div className="text-xs text-muted-foreground">Job Satisfaction</div>
                </div>
                <div className="bg-background p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{career.growthRate}%</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills and Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {career.requiredSkills.map((skill: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <skill.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {career.educationRequirements.map((req: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Typical Duration</h4>
                <p className="text-sm text-muted-foreground">{career.typicalDuration}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Roadmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Career Roadmap</CardTitle>
            <p className="text-center text-muted-foreground">Your journey to becoming a successful {career.title.toLowerCase()}</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center overflow-x-auto pb-4">
              {career.careerRoadmap.map((stage: any, index: number) => (
                <div key={index} className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${getIconComponent(stage.icon, stage.color)}`}>
                    <stage.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-center mb-1 text-sm">{stage.stage}</h3>
                  <p className="text-xs text-muted-foreground text-center mb-2 px-2">{stage.description}</p>
                  <Badge variant="outline" className="text-xs">{stage.duration}</Badge>
                  {index < career.careerRoadmap.length - 1 && (
                    <div className="w-full h-0.5 bg-border mt-4 hidden lg:block"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Roles and Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Job Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {career.jobRoles.map((role: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <span className="text-xl">{role.icon}</span>
                    <span className="font-medium">{role.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {career.industries.map((industry: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {industry}
                  </Badge>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Market Demand</h4>
                <p className="text-sm text-muted-foreground">{career.marketDemandText}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="px-8"
            onClick={generateRoadmap}
            disabled={isGenerating || !user}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Roadmap...
              </>
            ) : (
              'Get Detailed Roadmap'
            )}
          </Button>
        </div>
      </div>

      {/* Roadmap Modal */}
      <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              {roadmapData?.careerTitle} - Detailed Career Roadmap
            </DialogTitle>
          </DialogHeader>

          {roadmapData && (
            <div className="space-y-6">
              {/* Personalized Roadmap Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Your Personalized Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{roadmapData.personalizedRoadmap}</p>
                </CardContent>
              </Card>

              {/* Syllabus */}
              {roadmapData.syllabus && roadmapData.syllabus.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Learning Syllabus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roadmapData.syllabus.map((phase: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-lg mb-2">{phase.phase}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Duration: {phase.duration}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Subjects:</h5>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {phase.subjects.map((subject: string, i: number) => (
                                  <li key={i}>{subject}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Resources:</h5>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {phase.resources.map((resource: string, i: number) => (
                                  <li key={i}>{resource}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Advantages and Disadvantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {roadmapData.advantages?.map((advantage: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <TrendingUp className="w-5 h-5" />
                      Disadvantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {roadmapData.disadvantages?.map((disadvantage: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Career Path */}
              {roadmapData.careerPath && roadmapData.careerPath.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                      Career Progression Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roadmapData.careerPath.map((stage: any, index: number) => (
                        <div key={index} className="border-l-4 border-primary/20 pl-4 pb-4">
                          <h4 className="font-semibold text-lg">{stage.stage}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Salary:</span> {stage.salary}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {stage.duration}
                            </div>
                          </div>
                          {stage.requirements && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Requirements:</span>
                              <ul className="list-disc list-inside text-sm mt-1">
                                {stage.requirements.map((req: string, i: number) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Suggested Resources */}
              {roadmapData.suggestedResources && roadmapData.suggestedResources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-indigo-500" />
                      Recommended Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {roadmapData.suggestedResources.map((resource: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-3">{resource.type}</h4>
                          <ul className="space-y-2">
                            {resource.items.map((item: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              {roadmapData.nextSteps && roadmapData.nextSteps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Next Steps to Get Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {roadmapData.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}