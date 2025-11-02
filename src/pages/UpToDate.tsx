import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ExternalLink, Clock, User, TrendingUp, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { sendNewSubmissionAlert } from "@/services/emailService";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  url: string;
  trending?: boolean;
}

interface AITool {
  id: string;
  title: string;
  description: string;
  website: string;
  category: string;
  pricing: string;
  documentTitle?: string;
  createdAt: string;
  status?: 'approved' | 'pending' | 'rejected';
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  applicationLink: string;
  description: string;
  documentTitle?: string;
  createdAt: string;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  duration: string;
  location: string;
  stipend?: string;
  deadline?: string;
  applicationLink: string;
  description: string;
  documentTitle?: string;
  createdAt: string;
}

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  eligibility: string;
  deadline?: string;
  amount: string;
  applicationLink: string;
  description: string;
  documentTitle?: string;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  link: string;
  document?: string;
  createdAt: string;
}


export default function UpToDate() {
    const { profile } = useProfile();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   // Community content state
     const [aiTools, setAiTools] = useState<AITool[]>([]);
     const [jobs, setJobs] = useState<Job[]>([]);
     const [internships, setInternships] = useState<Internship[]>([]);
     const [scholarships, setScholarships] = useState<Scholarship[]>([]);
     const [documents, setDocuments] = useState<Document[]>([]);
     const [communityLoading, setCommunityLoading] = useState(true);

  // Form states
   const [aiToolForm, setAiToolForm] = useState({
     title: '',
     description: '',
     website: '',
     category: '',
     pricing: '',
     documentTitle: ''
   });

   const [jobForm, setJobForm] = useState({
     title: '',
     company: '',
     location: '',
     type: '',
     salary: '',
     applicationLink: '',
     description: '',
     documentTitle: ''
   });

   const [internshipForm, setInternshipForm] = useState({
     title: '',
     company: '',
     duration: '',
     location: '',
     stipend: '',
     deadline: '',
     applicationLink: '',
     description: '',
     documentTitle: ''
   });

   const [scholarshipForm, setScholarshipForm] = useState({
     name: '',
     provider: '',
     eligibility: '',
     deadline: '',
     amount: '',
     applicationLink: '',
     description: '',
     documentTitle: ''
   });

   const [documentForm, setDocumentForm] = useState({
     title: '',
     link: '',
     document: ''
   });

   // Dialog open states
   const [aiToolDialogOpen, setAiToolDialogOpen] = useState(false);
   const [jobDialogOpen, setJobDialogOpen] = useState(false);
   const [internshipDialogOpen, setInternshipDialogOpen] = useState(false);
   const [scholarshipDialogOpen, setScholarshipDialogOpen] = useState(false);
   const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  // Fetch news data on component mount
   useEffect(() => {
     fetchNews();
     fetchCommunityData();
     
     // Listen for real-time admin actions
     const handleAdminAction = (event: CustomEvent) => {
       console.log('🔄 Received admin action update:', event.detail);
       const { submission, action } = event.detail;
       
       if (action === 'approved') {
         // Add approved item to appropriate category
         switch (submission.type) {
           case 'aiTool':
             setAiTools(prev => [submission, ...prev]);
             break;
           case 'job':
             setJobs(prev => [submission, ...prev]);
             break;
           case 'internship':
             setInternships(prev => [submission, ...prev]);
             break;
           case 'scholarship':
             setScholarships(prev => [submission, ...prev]);
             break;
           case 'document':
             setDocuments(prev => [submission, ...prev]);
             break;
         }
         toast.success(`✅ New ${submission.type} approved and added: ${submission.title}`);
       } else if (action === 'removed') {
         // Remove item from appropriate category
         switch (submission.type) {
           case 'aiTool':
             setAiTools(prev => prev.filter(item => 
               !(item.title === submission.title && item.id.includes(submission.id))
             ));
             break;
           case 'job':
             setJobs(prev => prev.filter(item => 
               !(item.title === submission.title && item.id.includes(submission.id))
             ));
             break;
           case 'internship':
             setInternships(prev => prev.filter(item => 
               !(item.title === submission.title && item.id.includes(submission.id))
             ));
             break;
           case 'scholarship':
             setScholarships(prev => prev.filter(item => 
               !(item.name === submission.title && item.id.includes(submission.id))
             ));
             break;
           case 'document':
             setDocuments(prev => prev.filter(item => 
               !(item.title === submission.title && item.id.includes(submission.id))
             ));
             break;
         }
         toast.error(`🗑️ ${submission.type} removed from community hub: ${submission.title}`);
       }
     };

     // Add event listener for real-time updates
     window.addEventListener('adminAction', handleAdminAction as EventListener);
     
     // Cleanup
     return () => {
       window.removeEventListener('adminAction', handleAdminAction as EventListener);
     };
   }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || newsData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, newsData.length]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('fetch-news');

      if (error) {
        console.warn('Edge Function not available, using development data');
        // Provide mock data for development when API is not available
        const mockNewsData: NewsItem[] = [
          {
            id: 'mock-1',
            title: 'AI Revolution in Education: How Machine Learning is Transforming Learning',
            excerpt: 'Discover how artificial intelligence is reshaping the educational landscape with personalized learning paths and intelligent tutoring systems.',
            author: 'Dr. Sarah Chen',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read',
            category: 'Technology',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.edtechmagazine.com/k12/article/2024/09/ai-education-machine-learning-transforming-learning',
            trending: true
          },
          {
            id: 'mock-2',
            title: 'Top 10 Emerging Career Fields for 2025',
            excerpt: 'Explore the most promising career opportunities in renewable energy, biotechnology, and digital transformation.',
            author: 'Prof. Michael Rodriguez',
            date: new Date().toISOString().split('T')[0],
            readTime: '7 min read',
            category: 'Careers',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.forbes.com/sites/forbesbusinesscouncil/2024/09/15/top-10-emerging-career-fields-for-2025/'
          },
          {
            id: 'mock-3',
            title: 'The Future of Remote Work: Skills Every Student Should Learn',
            excerpt: 'Essential digital skills and soft competencies that will define success in the distributed workplace of tomorrow.',
            author: 'Emma Thompson',
            date: new Date().toISOString().split('T')[0],
            readTime: '4 min read',
            category: 'Skills',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.coursera.org/articles/remote-work-skills'
          },
          {
            id: 'mock-4',
            title: 'Green Careers: Building a Sustainable Future',
            excerpt: 'How environmental science and sustainable development are creating new job opportunities across industries.',
            author: 'Dr. James Wilson',
            date: new Date().toISOString().split('T')[0],
            readTime: '6 min read',
            category: 'Environment',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.epa.gov/careers/green-careers',
            trending: true
          },
          {
            id: 'mock-5',
            title: 'Coding Bootcamps vs Traditional Degrees: Which Path is Right for You?',
            excerpt: 'A comprehensive comparison of accelerated learning programs versus four-year computer science degrees.',
            author: 'Lisa Park',
            date: new Date().toISOString().split('T')[0],
            readTime: '8 min read',
            category: 'Education',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.coursereport.com/blog/coding-bootcamp-vs-computer-science-degree'
          },
          {
            id: 'mock-6',
            title: 'Mental Health in Tech: Breaking the Stigma',
            excerpt: 'Important insights into maintaining work-life balance and mental wellness in high-pressure tech environments.',
            author: 'Dr. Rachel Green',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read',
            category: 'Wellness',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center',
            url: 'https://www.mentalhealth.org.uk/explore-mental-health/mental-health-problems/work-and-mental-health/tech-industry'
          }
        ];
        setNewsData(mockNewsData);
        setError('Using development data. Deploy the fetch-news Edge Function for live data.');
        return;
      }

      if (data?.news && Array.isArray(data.news) && data.news.length > 0) {
        setNewsData(data.news);
        console.log('Successfully loaded dynamic news data');
      } else {
        throw new Error('No news data received from API');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      const errorMessage = 'Failed to load news. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      // Set empty array to show error state
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityData = async () => {
    try {
      setCommunityLoading(true);
      // Using mock data since backend is not available
      // TODO: Replace with actual API call when backend is ready
      console.log('Using mock data for development');

      const dummyAiTools: AITool[] = [
        {
          id: 'dummy-ai-1',
          title: 'Claude 3.5 Sonnet',
          description: 'Advanced AI assistant for coding, writing, and analysis. Features enhanced reasoning and code generation capabilities.',
          website: 'https://claude.ai',
          category: 'text',
          pricing: 'freemium',
          createdAt: '2025-01-15T10:00:00Z'
        },
        {
          id: 'dummy-ai-2',
          title: 'GitHub Copilot',
          description: 'AI-powered code completion tool that helps developers write code faster with intelligent suggestions.',
          website: 'https://github.com/features/copilot',
          category: 'coding',
          pricing: 'subscription',
          createdAt: '2025-02-01T14:30:00Z'
        },
        {
          id: 'dummy-ai-3',
          title: 'Midjourney v6',
          description: 'Advanced AI image generation tool for creating stunning artwork, designs, and visual content.',
          website: 'https://www.midjourney.com',
          category: 'image',
          pricing: 'subscription',
          createdAt: '2025-01-20T09:15:00Z'
        }
      ];

      const dummyJobs: Job[] = [
        {
          id: 'dummy-job-1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Solutions',
          location: 'Bangalore, India',
          type: 'full-time',
          salary: '₹18,00,000 - ₹25,00,000 per year',
          applicationLink: 'https://techcorp.com/careers/frontend-dev',
          description: 'Join our team to build next-generation web applications using React, TypeScript, and modern frontend technologies.',
          createdAt: '2025-01-10T11:00:00Z'
        },
        {
          id: 'dummy-job-2',
          title: 'AI/ML Engineer',
          company: 'DataFlow Systems',
          location: 'Mumbai, India',
          type: 'full-time',
          salary: '₹20,00,000 - ₹30,00,000 per year',
          applicationLink: 'https://dataflow.com/jobs/ai-engineer',
          description: 'Work on cutting-edge machine learning projects and develop AI solutions for enterprise clients.',
          createdAt: '2025-01-25T16:45:00Z'
        },
        {
          id: 'dummy-job-3',
          title: 'Product Manager',
          company: 'InnovateLabs',
          location: 'Delhi, India',
          type: 'full-time',
          salary: '₹15,00,000 - ₹22,00,000 per year',
          applicationLink: 'https://innovatelabs.com/careers/pm',
          description: 'Lead product development for our SaaS platform and drive user experience improvements.',
          createdAt: '2025-02-05T13:20:00Z'
        }
      ];

      const dummyInternships: Internship[] = [
        {
          id: 'dummy-intern-1',
          title: 'Software Development Intern',
          company: 'Microsoft India',
          duration: '6 months',
          location: 'hybrid',
          stipend: '₹75,000 per month',
          deadline: '2025-03-15',
          applicationLink: 'https://careers.microsoft.com/internships',
          description: 'Gain hands-on experience in software development, work on real projects, and learn from industry experts.',
          createdAt: '2025-01-08T10:30:00Z'
        },
        {
          id: 'dummy-intern-2',
          title: 'Data Science Intern',
          company: 'Google India',
          duration: '3 months',
          location: 'remote',
          stipend: '₹80,000 per month',
          deadline: '2025-02-28',
          applicationLink: 'https://careers.google.com/internships/data-science',
          description: 'Work with large datasets, build ML models, and contribute to Google\'s data-driven initiatives.',
          createdAt: '2025-01-12T14:15:00Z'
        },
        {
          id: 'dummy-intern-3',
          title: 'UI/UX Design Intern',
          company: 'Adobe India',
          duration: '4 months',
          location: 'on-site',
          stipend: '₹65,000 per month',
          deadline: '2025-03-01',
          applicationLink: 'https://adobe.com/careers/internships/design',
          description: 'Design user interfaces for Adobe Creative Cloud products and learn industry-standard design processes.',
          createdAt: '2025-01-18T09:45:00Z'
        }
      ];

      const dummyScholarships: Scholarship[] = [
        {
          id: 'dummy-scholarship-1',
          name: 'Women in Technology Scholarship 2025',
          provider: 'Google for India',
          eligibility: 'Female undergraduate students pursuing CS/IT degrees in India',
          deadline: '2025-04-15',
          amount: '₹5,00,000',
          applicationLink: 'https://womenintech.google.com/scholarship',
          description: 'Supporting women pursuing careers in technology through education and mentorship.',
          createdAt: '2025-01-05T12:00:00Z'
        },
        {
          id: 'dummy-scholarship-2',
          name: 'Merit-based Engineering Scholarship',
          provider: 'Tata Trusts',
          eligibility: 'First-year engineering students with 95%+ in 12th standard',
          deadline: '2025-05-31',
          amount: '₹2,00,000 per year',
          applicationLink: 'https://tatatrusts.org/scholarships/engineering',
          description: 'Annual scholarship for meritorious engineering students to support their education.',
          createdAt: '2025-01-22T15:30:00Z'
        },
        {
          id: 'dummy-scholarship-3',
          name: 'AI Research Fellowship',
          provider: 'IIT Delhi',
          eligibility: 'M.Tech/PhD students in AI/ML specializations',
          deadline: '2025-03-31',
          amount: '₹3,50,000',
          applicationLink: 'https://ai.iitd.ac.in/fellowship',
          description: 'Research fellowship for advanced AI/ML studies and cutting-edge research projects.',
          createdAt: '2025-02-01T11:20:00Z'
        }
      ];

      const dummyDocuments: Document[] = [
        {
          id: 'dummy-doc-1',
          title: 'Complete Guide to Data Structures & Algorithms',
          link: 'https://example.com/dsa-guide-2025.pdf',
          document: 'Comprehensive study material covering all DSA concepts with examples',
          createdAt: '2025-01-03T08:00:00Z'
        },
        {
          id: 'dummy-doc-2',
          title: 'Machine Learning Interview Preparation',
          link: 'https://example.com/ml-interview-guide.pdf',
          document: 'Detailed guide with common ML interview questions and solutions',
          createdAt: '2025-01-14T16:45:00Z'
        },
        {
          id: 'dummy-doc-3',
          title: 'System Design Fundamentals',
          link: 'https://example.com/system-design-basics.pdf',
          document: 'Essential concepts for designing scalable software systems',
          createdAt: '2025-01-28T13:10:00Z'
        }
      ];

      // Load approved community items
      const approvedItems = JSON.parse(localStorage.getItem('approvedCommunityItems') || '[]');
      console.log('📊 Loading approved community items:', approvedItems.length);

      // Separate approved items by type
      const approvedAiTools = approvedItems.filter((item: any) => item.type === 'aiTool');
      const approvedJobs = approvedItems.filter((item: any) => item.type === 'job');
      const approvedInternships = approvedItems.filter((item: any) => item.type === 'internship');
      const approvedScholarships = approvedItems.filter((item: any) => item.type === 'scholarship');
      const approvedDocuments = approvedItems.filter((item: any) => item.type === 'document');

      // Combine with dummy data
      setAiTools([...approvedAiTools, ...dummyAiTools]);
      setJobs([...approvedJobs, ...dummyJobs]);
      setInternships([...approvedInternships, ...dummyInternships]);
      setScholarships([...approvedScholarships, ...dummyScholarships]);
      setDocuments([...approvedDocuments, ...dummyDocuments]);

      console.log('✅ Community data loaded with approved items');
    } finally {
      setCommunityLoading(false);
    }
  };

  // Get visible items (3 on desktop, 1 on mobile)
  const getVisibleItems = () => {
    if (newsData.length === 0) return [];
    const items = [];
    const itemsToShow = window.innerWidth >= 768 ? 3 : 1;

    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % newsData.length;
      items.push(newsData[index]);
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  // Navigation functions
  const goToPrevious = () => {
    if (newsData.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + newsData.length) % newsData.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    if (newsData.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % newsData.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    if (newsData.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Form submission handlers
   const handleAddAITool = async () => {
     if (!aiToolForm.title || !aiToolForm.description || !aiToolForm.website) {
       toast.error('Please fill in all required fields');
       return;
     }

     try {
       // Create submission for admin review
       const submission = {
         id: `sub-ai-${Date.now()}`,
         type: 'aiTool' as const,
         title: aiToolForm.title,
         description: aiToolForm.description,
         contributorName: profile?.display_name || 'Anonymous User',
         contributorEmail: profile?.email || 'unknown@example.com',
         timestamp: new Date().toISOString(),
         status: 'pending' as const,
         data: {
           website: aiToolForm.website,
           category: aiToolForm.category || 'other',
           pricing: aiToolForm.pricing || 'unknown',
           documentTitle: aiToolForm.documentTitle
         }
       };

       // Add to pending submissions for admin review
       const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
       const updatedSubmissions = [submission, ...existingSubmissions];
       localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

       // Update log file
       updateSubmissionLog(submission);
       
       // Clear form and close dialog
       setAiToolForm({ title: '', description: '', website: '', category: '', pricing: '', documentTitle: '' });
       setAiToolDialogOpen(false);
       
       toast.success('AI Tool submitted for admin review! You will be notified once it\'s approved.');
     } catch (err) {
       console.error('Failed to submit AI tool:', err);
       toast.error('Failed to submit AI tool. Please try again.');
     }
   };

  const handleAddJob = async () => {
    if (!jobForm.title || !jobForm.company || !jobForm.location || !jobForm.applicationLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create submission for admin review
      const submission = {
        id: `sub-job-${Date.now()}`,
        type: 'job' as const,
        title: jobForm.title,
        description: jobForm.description,
        contributorName: profile?.display_name || 'Anonymous User',
        contributorEmail: profile?.email || 'unknown@example.com',
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
        data: {
          company: jobForm.company,
          location: jobForm.location,
          type: jobForm.type || 'full-time',
          salary: jobForm.salary,
          applicationLink: jobForm.applicationLink,
          documentTitle: jobForm.documentTitle
        }
      };

      // Add to pending submissions for admin review
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
      const updatedSubmissions = [submission, ...existingSubmissions];
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Update log file
      updateSubmissionLog(submission);
      
      // Clear form and close dialog
      setJobForm({ title: '', company: '', location: '', type: '', salary: '', applicationLink: '', description: '', documentTitle: '' });
      setJobDialogOpen(false);
      
      toast.success('Job submitted for admin review! You will be notified once it\'s approved.');
    } catch (err) {
      console.error('Failed to submit job:', err);
      toast.error('Failed to submit job. Please try again.');
    }
  };

  const handleAddInternship = async () => {
    if (!internshipForm.title || !internshipForm.company || !internshipForm.applicationLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create submission for admin review
      const submission = {
        id: `sub-internship-${Date.now()}`,
        type: 'internship' as const,
        title: internshipForm.title,
        description: internshipForm.description,
        contributorName: profile?.display_name || 'Anonymous User',
        contributorEmail: profile?.email || 'unknown@example.com',
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
        data: {
          company: internshipForm.company,
          duration: internshipForm.duration,
          location: internshipForm.location,
          stipend: internshipForm.stipend,
          deadline: internshipForm.deadline,
          applicationLink: internshipForm.applicationLink,
          documentTitle: internshipForm.documentTitle
        }
      };

      // Add to pending submissions for admin review
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
      const updatedSubmissions = [submission, ...existingSubmissions];
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Update log file
      updateSubmissionLog(submission);
      
      // Clear form and close dialog
      setInternshipForm({ title: '', company: '', duration: '', location: '', stipend: '', deadline: '', applicationLink: '', description: '', documentTitle: '' });
      setInternshipDialogOpen(false);
      
      toast.success('Internship submitted for admin review! You will be notified once it\'s approved.');
    } catch (err) {
      console.error('Failed to submit internship:', err);
      toast.error('Failed to submit internship. Please try again.');
    }
  };

  const handleAddScholarship = async () => {
    if (!scholarshipForm.name || !scholarshipForm.provider || !scholarshipForm.applicationLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create submission for admin review
      const submission = {
        id: `sub-scholarship-${Date.now()}`,
        type: 'scholarship' as const,
        title: scholarshipForm.name,
        description: scholarshipForm.description,
        contributorName: profile?.display_name || 'Anonymous User',
        contributorEmail: profile?.email || 'unknown@example.com',
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
        data: {
          provider: scholarshipForm.provider,
          eligibility: scholarshipForm.eligibility,
          deadline: scholarshipForm.deadline,
          amount: scholarshipForm.amount,
          applicationLink: scholarshipForm.applicationLink,
          documentTitle: scholarshipForm.documentTitle
        }
      };

      // Add to pending submissions for admin review
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
      const updatedSubmissions = [submission, ...existingSubmissions];
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Update log file
      updateSubmissionLog(submission);
      
      // Clear form and close dialog
      setScholarshipForm({ name: '', provider: '', eligibility: '', deadline: '', amount: '', applicationLink: '', description: '', documentTitle: '' });
      setScholarshipDialogOpen(false);
      
      toast.success('Scholarship submitted for admin review! You will be notified once it\'s approved.');
    } catch (err) {
      console.error('Failed to submit scholarship:', err);
      toast.error('Failed to submit scholarship. Please try again.');
    }
  };

  const handleAddDocument = async () => {
    if (!documentForm.title || !documentForm.link) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create submission for admin review
      const submission = {
        id: `sub-document-${Date.now()}`,
        type: 'document' as const,
        title: documentForm.title,
        description: documentForm.document || 'Document resource',
        contributorName: profile?.display_name || 'Anonymous User',
        contributorEmail: profile?.email || 'unknown@example.com',
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
        data: {
          link: documentForm.link,
          document: documentForm.document
        }
      };

      // Add to pending submissions for admin review
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
      const updatedSubmissions = [submission, ...existingSubmissions];
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Update log file
      updateSubmissionLog(submission);
      
      // Clear form and close dialog
      setDocumentForm({ title: '', link: '', document: '' });
      setDocumentDialogOpen(false);
      
      toast.success('Document submitted for admin review! You will be notified once it\'s approved.');
    } catch (err) {
      console.error('Failed to submit document:', err);
      toast.error('Failed to submit document. Please try again.');
    }
  };

  // Helper function to update submission log
  const updateSubmissionLog = async (submission: any) => {
    const logEntry = `
[${new Date().toISOString()}] NEW SUBMISSION
Title: ${submission.title}
Type: ${submission.type}
Contributor: ${submission.contributorName} (${submission.contributorEmail})
Status: PENDING REVIEW
---`;
    
    console.log('Submission log updated:', logEntry);
    
    // In production, this would write to a .tex or .txt file
    // For now, we'll store it in localStorage as well
    const existingLogs = localStorage.getItem('submissionLogs') || '';
    localStorage.setItem('submissionLogs', existingLogs + logEntry);

    // Notify admin about new submission
    try {
      await sendNewSubmissionAlert('admin@vidhyadisha.com', submission);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Careers': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Skills': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Environment': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Education': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'Wellness': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Up to Date
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest trends, insights, and opportunities in education and career development
          </p>
        </div>

        {/* Loading State */}
        {loading &&
          <div className="flex items-center justify-center py-12 mb-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading latest news...</p>
            </div>
          </div>
        }

        {/* Development Data Notice */}
        {error && error.includes('development data') && !loading && newsData.length > 0 &&
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Development Mode</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{error}</p>
              </div>
            </div>
          </div>
        }

        {/* Error State */}
        {error && !error.includes('development data') && !loading && newsData.length === 0 &&
          <div className="flex items-center justify-center py-12 mb-12">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load News</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchNews} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        }


        {/* News Carousel */}
        {!loading && newsData.length > 0 &&
          <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            aria-label="Next news"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / visibleItems.length)}%`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {newsData.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full md:w-1/3"
                >
                  <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {item.trending && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {item.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {newsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </div>
        </div>
        }

        {/* Community Section */}
         <div className="mb-12">
           <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-foreground mb-4">Community Hub</h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
               Share opportunities and tools with the community. Add AI tools, jobs, internships, and scholarships.
             </p>
           </div>

           {communityLoading && (
             <div className="flex items-center justify-center py-8">
               <Loader2 className="w-6 h-6 animate-spin text-primary" />
               <span className="ml-2 text-muted-foreground">Loading community content...</span>
             </div>
           )}

          {/* Create Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {/* AI Tools Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">AI Tools</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">Share AI tools and resources</p>
                  <Dialog open={aiToolDialogOpen} onOpenChange={setAiToolDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add AI Tool</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Title / Tool Name"
                          value={aiToolForm.title}
                          onChange={(e) => setAiToolForm({...aiToolForm, title: e.target.value})}
                        />
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={aiToolForm.description}
                          onChange={(e) => setAiToolForm({...aiToolForm, description: e.target.value})}
                        />
                        <Input
                          placeholder="Website / Link"
                          value={aiToolForm.website}
                          onChange={(e) => setAiToolForm({...aiToolForm, website: e.target.value})}
                        />
                        <select
                          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={aiToolForm.category}
                          onChange={(e) => setAiToolForm({...aiToolForm, category: e.target.value})}
                        >
                          <option value="">Category / Type</option>
                          <option value="image">Image</option>
                          <option value="text">Text</option>
                          <option value="video">Video</option>
                          <option value="coding">Coding</option>
                          <option value="other">Other</option>
                        </select>
                        <select
                          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={aiToolForm.pricing}
                          onChange={(e) => setAiToolForm({...aiToolForm, pricing: e.target.value})}
                        >
                          <option value="">Pricing</option>
                          <option value="free">Free</option>
                          <option value="freemium">Freemium</option>
                          <option value="paid">Paid</option>
                          <option value="subscription">Subscription</option>
                        </select>
                        <Input
                          placeholder="Document Title (optional)"
                          value={aiToolForm.documentTitle}
                          onChange={(e) => setAiToolForm({...aiToolForm, documentTitle: e.target.value})}
                        />
                        <Button onClick={handleAddAITool} className="w-full">
                          Add AI Tool
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Jobs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-200 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Jobs</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-4">Share job opportunities</p>
                  <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Job</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Job Title"
                          value={jobForm.title}
                          onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                        />
                        <Input
                          placeholder="Company Name"
                          value={jobForm.company}
                          onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                        />
                        <Input
                          placeholder="Location"
                          value={jobForm.location}
                          onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        />
                        <select
                          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={jobForm.type}
                          onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                        >
                          <option value="">Job Type</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                        <Input
                          placeholder="Salary / Stipend (optional)"
                          value={jobForm.salary}
                          onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        />
                        <Input
                          placeholder="Application Link"
                          value={jobForm.applicationLink}
                          onChange={(e) => setJobForm({...jobForm, applicationLink: e.target.value})}
                        />
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={jobForm.description}
                          onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                        />
                        <Input
                          placeholder="Document Title (optional)"
                          value={jobForm.documentTitle}
                          onChange={(e) => setJobForm({...jobForm, documentTitle: e.target.value})}
                        />
                        <Button onClick={handleAddJob} className="w-full">
                          Add Job
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Internships Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-200 dark:bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-2">Internships</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">Share internship opportunities</p>
                  <Dialog open={internshipDialogOpen} onOpenChange={setInternshipDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Internship</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Internship Title"
                          value={internshipForm.title}
                          onChange={(e) => setInternshipForm({...internshipForm, title: e.target.value})}
                        />
                        <Input
                          placeholder="Company / Organization"
                          value={internshipForm.company}
                          onChange={(e) => setInternshipForm({...internshipForm, company: e.target.value})}
                        />
                        <Input
                          placeholder="Duration"
                          value={internshipForm.duration}
                          onChange={(e) => setInternshipForm({...internshipForm, duration: e.target.value})}
                        />
                        <select
                          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={internshipForm.location}
                          onChange={(e) => setInternshipForm({...internshipForm, location: e.target.value})}
                        >
                          <option value="">Location</option>
                          <option value="remote">Remote</option>
                          <option value="on-site">On-site</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                        <Input
                          placeholder="Stipend (optional)"
                          value={internshipForm.stipend}
                          onChange={(e) => setInternshipForm({...internshipForm, stipend: e.target.value})}
                        />
                        <Input
                          placeholder="Application Deadline"
                          type="date"
                          value={internshipForm.deadline}
                          onChange={(e) => setInternshipForm({...internshipForm, deadline: e.target.value})}
                        />
                        <Input
                          placeholder="Application Link"
                          value={internshipForm.applicationLink}
                          onChange={(e) => setInternshipForm({...internshipForm, applicationLink: e.target.value})}
                        />
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={internshipForm.description}
                          onChange={(e) => setInternshipForm({...internshipForm, description: e.target.value})}
                        />
                        <Input
                          placeholder="Document Title (optional)"
                          value={internshipForm.documentTitle}
                          onChange={(e) => setInternshipForm({...internshipForm, documentTitle: e.target.value})}
                        />
                        <Button onClick={handleAddInternship} className="w-full">
                          Add Internship
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Scholarships Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">🏅</span>
                  </div>
                  <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-2">Scholarships</h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">Share scholarship opportunities</p>
                  <Dialog open={scholarshipDialogOpen} onOpenChange={setScholarshipDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Scholarship</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Scholarship Name"
                          value={scholarshipForm.name}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, name: e.target.value})}
                        />
                        <Input
                          placeholder="Provider / Organization"
                          value={scholarshipForm.provider}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, provider: e.target.value})}
                        />
                        <Textarea
                          placeholder="Eligibility"
                          rows={2}
                          value={scholarshipForm.eligibility}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, eligibility: e.target.value})}
                        />
                        <Input
                          placeholder="Deadline"
                          type="date"
                          value={scholarshipForm.deadline}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, deadline: e.target.value})}
                        />
                        <Input
                          placeholder="Amount / Benefits"
                          value={scholarshipForm.amount}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, amount: e.target.value})}
                        />
                        <Input
                          placeholder="Application Link"
                          value={scholarshipForm.applicationLink}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, applicationLink: e.target.value})}
                        />
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={scholarshipForm.description}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, description: e.target.value})}
                        />
                        <Input
                          placeholder="Document Title (optional)"
                          value={scholarshipForm.documentTitle}
                          onChange={(e) => setScholarshipForm({...scholarshipForm, documentTitle: e.target.value})}
                        />
                        <Button onClick={handleAddScholarship} className="w-full">
                          Add Scholarship
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50 border-teal-200 dark:border-teal-800 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-teal-200 dark:bg-teal-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-300 mb-2">Documents</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-400 mb-4">Share documents and resources</p>
                  <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Document</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Document Title"
                          value={documentForm.title}
                          onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                        />
                        <Input
                          placeholder="Document Link"
                          value={documentForm.link}
                          onChange={(e) => setDocumentForm({...documentForm, link: e.target.value})}
                        />
                        <Input
                          placeholder="Document (optional)"
                          value={documentForm.document}
                          onChange={(e) => setDocumentForm({...documentForm, document: e.target.value})}
                        />
                        <Button onClick={handleAddDocument} className="w-full">
                          Add Document
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          </div>

        {/* Display Sections */}
          {aiTools.length > 0 &&
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🧠</span>
                AI Tools ({aiTools.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((tool) => (
                  <Card key={tool.id} className={`hover:shadow-md transition-shadow ${tool.id.startsWith('user-') ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{tool.title}</h4>
                        {(tool.id.startsWith('user-') || tool.status === 'approved') && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tool.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {tool.status === 'approved' ? '✅ Verified' : 'Community'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{tool.category} • {tool.pricing}</span>
                        <Button variant="outline" size="sm" onClick={() => window.open(tool.website, '_blank')}>
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }

          {jobs.length > 0 &&
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">💼</span>
                Jobs ({jobs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className={`hover:shadow-md transition-shadow ${job.id.startsWith('user-') ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        {job.id.startsWith('user-') && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                            Community
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.company} • {job.location}</p>
                      <p className="text-sm mb-2">{job.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{job.type} {job.salary && `• ${job.salary}`}</span>
                        <Button variant="outline" size="sm" onClick={() => window.open(job.applicationLink, '_blank')}>
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }

          {internships.length > 0 &&
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🎓</span>
                Internships ({internships.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internships.map((internship) => (
                  <Card key={internship.id} className={`hover:shadow-md transition-shadow ${internship.id.startsWith('user-') ? 'border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{internship.title}</h4>
                        {internship.id.startsWith('user-') && (
                          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full">
                            Community
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{internship.company} • {internship.location}</p>
                      <p className="text-sm mb-2">{internship.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{internship.duration} {internship.stipend && `• ${internship.stipend}`}</span>
                        <Button variant="outline" size="sm" onClick={() => window.open(internship.applicationLink, '_blank')}>
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }

          {scholarships.length > 0 &&
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🏅</span>
                Scholarships ({scholarships.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.id} className={`hover:shadow-md transition-shadow ${scholarship.id.startsWith('user-') ? 'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{scholarship.name}</h4>
                        {scholarship.id.startsWith('user-') && (
                          <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-full">
                            Community
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scholarship.provider}</p>
                      <p className="text-sm mb-2">{scholarship.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{scholarship.amount}</span>
                        <Button variant="outline" size="sm" onClick={() => window.open(scholarship.applicationLink, '_blank')}>
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }

          {documents.length > 0 &&
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">📄</span>
                Documents ({documents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((document) => (
                  <Card key={document.id} className={`hover:shadow-md transition-shadow ${document.id.startsWith('user-') ? 'border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{document.title}</h4>
                        {document.id.startsWith('user-') && (
                          <span className="text-xs bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-1 rounded-full">
                            Community
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{document.document || 'No description'}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Document</span>
                        <Button variant="outline" size="sm" onClick={() => window.open(document.link, '_blank')}>
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }

        {/* Additional Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Latest Updates */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Latest Updates</h3>
              <div className="space-y-3">
                {newsData.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Trending Topics</h3>
              <div className="space-y-3">
                {newsData.filter(item => item.trending).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Platform Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Articles This Month</span>
                  <span className="font-semibold text-foreground">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Readers</span>
                  <span className="font-semibold text-foreground">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Categories</span>
                  <span className="font-semibold text-foreground">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg. Read Time</span>
                  <span className="font-semibold text-foreground">6 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </Layout>
  );
}