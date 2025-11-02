import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Briefcase, DollarSign, Clock, Users, Star, Target, Download, CheckCircle, TrendingUp, Award, GraduationCap, MapPin, Calendar, Globe, Zap, Heart, Lightbulb, Calculator, Code, Palette, Microscope, Building, UserCheck, Quote, ChevronRight, Play, ExternalLink, FileText, Trophy, BarChart3, HelpCircle } from "lucide-react";

export default function DegreeDetailPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const degreeDetailData = {
    computerScience: {
      name: 'Computer Science',
      icon: '💻',
      tagline: 'Master algorithms, programming, AI, and computer systems',
      description: 'Study algorithms, programming, software development, AI, and computer systems',
      heroStats: {
        duration: '4 Years',
        avgSalary: '₹12 LPA',
        growthRate: '+28%',
        jobOpenings: '2M+',
        topSkills: ['Python', 'JavaScript', 'AI/ML', 'Data Structures']
      },
      overview: {
        duration: '4 Years',
        salaryRange: '₹6-25 LPA',
        growthPotential: 'Very High',
        jobOpenings: '2M+ annually',
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'],
        marketDemand: 'Critical',
        futureOutlook: 'Excellent'
      },
      syllabus: [
        { semester: 1, subjects: ['Programming Fundamentals (Python)', 'Mathematics I', 'Digital Logic', 'Communication Skills'] },
        { semester: 2, subjects: ['Data Structures', 'Mathematics II', 'Computer Organization', 'Discrete Mathematics'] },
        { semester: 3, subjects: ['Algorithms', 'Database Management', 'Operating Systems', 'Object Oriented Programming'] },
        { semester: 4, subjects: ['Computer Networks', 'Software Engineering', 'Web Development', 'Theory of Computation'] },
        { semester: 5, subjects: ['Artificial Intelligence', 'Machine Learning', 'Mobile Computing', 'Compiler Design'] },
        { semester: 6, subjects: ['Cloud Computing', 'Cybersecurity', 'Big Data Analytics', 'Project Work'] },
        { semester: 7, subjects: ['Advanced Topics', 'Research Methodology', 'Elective I', 'Seminar'] },
        { semester: 8, subjects: ['Capstone Project', 'Internship', 'Elective II', 'Final Thesis'] }
      ],
      roadmap: [
        {
          stage: 'Foundation (Year 1-2)',
          duration: '2 years',
          description: 'Master programming fundamentals, data structures, and core computer science concepts',
          skills: ['Programming', 'Data Structures', 'Algorithms', 'Mathematics'],
          milestones: ['First program', 'Basic algorithms', 'Database design', 'Web development basics']
        },
        {
          stage: 'Core CS (Year 3)',
          duration: '1 year',
          description: 'Deep dive into advanced computer science topics and system design',
          skills: ['System Design', 'Advanced Algorithms', 'Networking', 'Security'],
          milestones: ['Complex projects', 'System architecture', 'Security fundamentals', 'Research papers']
        },
        {
          stage: 'Specialization (Year 4)',
          duration: '1 year',
          description: 'Choose your path: AI/ML, Web Dev, Cybersecurity, or Data Science',
          skills: ['Specialized Skills', 'Industry Tools', 'Advanced Frameworks', 'Research'],
          milestones: ['Specialized projects', 'Industry certifications', 'Research publications', 'Internship experience']
        }
      ],
      opportunities: [
        {
          role: 'Software Engineer',
          salary: '₹6-15 LPA',
          company: 'Tech Giants',
          growth: 'High',
          skills: ['JavaScript', 'React', 'Node.js'],
          description: 'Develop scalable software solutions and web applications'
        },
        {
          role: 'Data Scientist',
          salary: '₹8-20 LPA',
          company: 'Analytics Firms',
          growth: 'Very High',
          skills: ['Python', 'Machine Learning', 'SQL'],
          description: 'Analyze complex datasets and build predictive models'
        },
        {
          role: 'AI/ML Engineer',
          salary: '₹10-25 LPA',
          company: 'AI Companies',
          growth: 'Very High',
          skills: ['TensorFlow', 'PyTorch', 'Deep Learning'],
          description: 'Build intelligent systems and machine learning models'
        },
        {
          role: 'Full Stack Developer',
          salary: '₹5-12 LPA',
          company: 'Product Companies',
          growth: 'High',
          skills: ['React', 'Node.js', 'MongoDB'],
          description: 'Develop complete web applications from frontend to backend'
        },
        {
          role: 'DevOps Engineer',
          salary: '₹7-18 LPA',
          company: 'Cloud Companies',
          growth: 'High',
          skills: ['AWS', 'Docker', 'Kubernetes'],
          description: 'Manage deployment pipelines and cloud infrastructure'
        },
        {
          role: 'Product Manager',
          salary: '₹12-30 LPA',
          company: 'Tech Startups',
          growth: 'High',
          skills: ['Product Strategy', 'Analytics', 'Leadership'],
          description: 'Lead product development and drive business growth'
        }
      ],
      resources: {
        courses: [
          { name: 'CS50\'s Introduction to Computer Science', provider: 'Harvard University', rating: 4.8, students: '4M+', link: '#' },
          { name: 'Algorithms Specialization', provider: 'Stanford University', rating: 4.9, students: '500K+', link: '#' },
          { name: 'Machine Learning by Andrew Ng', provider: 'Coursera', rating: 4.9, students: '5M+', link: '#' },
          { name: 'Full Stack Web Development', provider: 'freeCodeCamp', rating: 4.7, students: '2M+', link: '#' }
        ],
        books: [
          { name: 'Clean Code', author: 'Robert C. Martin', rating: 4.6, pages: 464, link: '#' },
          { name: 'Introduction to Algorithms', author: 'CLRS', rating: 4.8, pages: 1312, link: '#' },
          { name: 'Design Patterns', author: 'Gang of Four', rating: 4.7, pages: 395, link: '#' },
          { name: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross', rating: 4.5, pages: 864, link: '#' }
        ],
        websites: [
          { name: 'LeetCode', description: 'Coding problems & interviews', users: '10M+', link: '#' },
          { name: 'GitHub', description: 'Code repository & collaboration', users: '100M+', link: '#' },
          { name: 'Stack Overflow', description: 'Programming Q&A', users: '18M+', link: '#' },
          { name: 'HackerRank', description: 'Skill assessment platform', users: '8M+', link: '#' },
          { name: 'freeCodeCamp', description: 'Free coding education', users: '6M+', link: '#' }
        ],
        youtube: [
          { name: 'freeCodeCamp', subscribers: '8M+', focus: 'Full programming curriculum', link: '#' },
          { name: 'Traversy Media', subscribers: '2M+', focus: 'Web development tutorials', link: '#' },
          { name: 'The Net Ninja', subscribers: '1M+', focus: 'Modern web technologies', link: '#' },
          { name: 'Academind', subscribers: '900K+', focus: 'In-depth programming courses', link: '#' },
          { name: 'CS Dojo', subscribers: '2M+', focus: 'Algorithms & interviews', link: '#' }
        ]
      },
      portfolio: [
        {
          title: 'E-commerce Platform',
          tech: 'React, Node.js, MongoDB, Stripe',
          description: 'Full-stack e-commerce solution with payment integration',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'AI Chat Application',
          tech: 'Python, TensorFlow, React, WebSocket',
          description: 'Real-time chat app with AI-powered responses',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Data Visualization Dashboard',
          tech: 'D3.js, Python, Flask, PostgreSQL',
          description: 'Interactive dashboard for business analytics',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Mobile Task Manager',
          tech: 'React Native, Firebase, Redux',
          description: 'Cross-platform productivity app',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        }
      ],
      exams: [
        { name: 'JEE Main/Advanced', description: 'For IITs/NITs admission', difficulty: 'High', cutoff: 'Top 2%', link: '#' },
        { name: 'BITSAT', description: 'For BITS Pilani', difficulty: 'Medium-High', cutoff: 'Top 5%', link: '#' },
        { name: 'VITEEE', description: 'For VIT University', difficulty: 'Medium', cutoff: 'Top 10%', link: '#' },
        { name: 'COMEDK UGET', description: 'For Karnataka colleges', difficulty: 'Medium', cutoff: 'Top 15%', link: '#' },
        { name: 'IPU CET', description: 'For Delhi colleges', difficulty: 'Medium', cutoff: 'Top 20%', link: '#' }
      ],
      scholarships: [
        { name: 'NTSE Scholarship', amount: '₹500-2000/month', eligibility: 'Class 10 toppers', deadline: 'August 2025', link: '#' },
        { name: 'KVPY Fellowship', amount: '₹5000-7000/month', eligibility: 'Science stream students', deadline: 'September 2025', link: '#' },
        { name: 'INSPIRE Scholarship', amount: '₹80000/year', eligibility: 'Science inclination', deadline: 'October 2025', link: '#' },
        { name: 'Merit-cum-Means', amount: '₹12000/year', eligibility: 'Merit + financial need', deadline: 'December 2025', link: '#' },
        { name: 'State Government Scholarships', amount: 'Variable', eligibility: 'State-specific criteria', deadline: 'Varies', link: '#' }
      ],
      testimonials: [
        {
          name: 'Rahul Sharma',
          role: 'Software Engineer at Google',
          image: '/api/placeholder/60/60',
          quote: 'Computer Science degree opened doors to incredible opportunities. The problem-solving skills I learned are invaluable in my daily work.',
          rating: 5
        },
        {
          name: 'Priya Patel',
          role: 'AI Researcher at Microsoft',
          image: '/api/placeholder/60/60',
          quote: 'The foundation in algorithms and data structures prepared me perfectly for advanced AI research. Best decision of my life!',
          rating: 5
        },
        {
          name: 'Arun Kumar',
          role: 'Startup Founder',
          image: '/api/placeholder/60/60',
          quote: 'CS degree gave me both technical skills and entrepreneurial mindset. Now running a successful tech startup.',
          rating: 5
        }
      ],
      faq: [
        {
          question: 'Is Computer Science difficult?',
          answer: 'CS requires logical thinking and consistent practice. While challenging, it\'s rewarding and opens excellent career opportunities. Success depends on dedication and problem-solving approach.'
        },
        {
          question: 'Which programming language should I learn first?',
          answer: 'Start with Python - it\'s beginner-friendly, versatile, and widely used. Then learn JavaScript for web development and Java/C++ for system programming.'
        },
        {
          question: 'Do I need to be good at mathematics?',
          answer: 'Yes, discrete mathematics, calculus, and statistics are crucial. However, you don\'t need to be a math genius - consistent practice and understanding concepts is key.'
        },
        {
          question: 'What\'s the difference between CS and IT engineering?',
          answer: 'CS focuses on theoretical foundations, algorithms, and software development. IT focuses on practical applications, networking, and system administration.'
        },
        {
          question: 'Can I start my own company after CS?',
          answer: 'Absolutely! Many successful entrepreneurs like Mark Zuckerberg, Sundar Pichai, and Satya Nadella have CS backgrounds. CS provides perfect foundation for innovation.'
        },
        {
          question: 'What are the highest paying CS jobs?',
          answer: 'AI/ML Engineer (₹10-25 LPA), Data Scientist (₹8-20 LPA), Solutions Architect (₹15-30 LPA), and Tech Lead positions offer the highest salaries.'
        }
      ]
    },
    engineering: {
      name: 'Engineering',
      icon: '⚙️',
      tagline: 'Design, build, and innovate solutions for the modern world',
      description: 'Study mechanical, electrical, civil, or chemical engineering principles and applications',
      overview: {
        duration: '4 Years',
        salaryRange: '₹5-20 LPA',
        growthPotential: 'High',
        jobOpenings: '1.5M+ annually',
        topCompanies: ['TCS', 'L&T', 'Reliance', 'Adani', 'DRDO']
      },
      syllabus: [
        'Engineering Mathematics',
        'Engineering Physics',
        'Engineering Chemistry',
        'Engineering Drawing',
        'Thermodynamics',
        'Fluid Mechanics',
        'Heat Transfer',
        'Manufacturing Processes',
        'CAD/CAM',
        'Control Systems'
      ],
      opportunities: [
        { role: 'Design Engineer', salary: '₹5-12 LPA', company: 'Manufacturing', growth: 'Medium' },
        { role: 'Project Engineer', salary: '₹6-15 LPA', company: 'Construction', growth: 'High' },
        { role: 'R&D Engineer', salary: '₹7-18 LPA', company: 'R&D Labs', growth: 'High' },
        { role: 'Production Engineer', salary: '₹6-14 LPA', company: 'Manufacturing', growth: 'Medium' },
        { role: 'Consulting Engineer', salary: '₹8-20 LPA', company: 'Consulting', growth: 'High' }
      ],
      resources: [
        { name: 'Engineering Mechanics', provider: 'MIT OpenCourseWare', type: 'Course' },
        { name: 'Thermodynamics', provider: 'Coursera', type: 'Course' },
        { name: 'ASME', provider: 'Professional Society', type: 'Organization' },
        { name: 'Engineering.com', provider: 'Resources', type: 'Website' }
      ]
    },
    medicine: {
      name: 'Medicine (MBBS)',
      icon: '🏥',
      tagline: 'Heal, care, and save lives through medical science',
      description: 'Study human anatomy, diseases, medical diagnosis, and patient care',
      overview: {
        duration: '5.5 Years',
        salaryRange: '₹8-30 LPA',
        growthPotential: 'Very High',
        jobOpenings: '500K+ annually',
        topCompanies: ['AIIMS', 'Apollo', 'Max Healthcare', 'Fortis', 'Medanta']
      },
      syllabus: [
        'Anatomy',
        'Physiology',
        'Biochemistry',
        'Pathology',
        'Pharmacology',
        'Microbiology',
        'Forensic Medicine',
        'Community Medicine',
        'Medicine',
        'Surgery',
        'Obstetrics & Gynecology',
        'Pediatrics'
      ],
      opportunities: [
        { role: 'Medical Officer', salary: '₹8-15 LPA', company: 'Government Hospitals', growth: 'Medium' },
        { role: 'Surgeon', salary: '₹15-30 LPA', company: 'Private Hospitals', growth: 'High' },
        { role: 'Physician', salary: '₹10-20 LPA', company: 'Clinics/Hospitals', growth: 'High' },
        { role: 'Pediatrician', salary: '₹12-25 LPA', company: 'Children Hospitals', growth: 'High' },
        { role: 'Radiologist', salary: '₹18-35 LPA', company: 'Diagnostic Centers', growth: 'Very High' }
      ],
      resources: [
        { name: 'Anatomy & Physiology', provider: 'Coursera', type: 'Course' },
        { name: 'Gray\'s Anatomy', provider: 'Henry Gray', type: 'Book' },
        { name: 'NEJM', provider: 'Medical Journal', type: 'Publication' },
        { name: 'Osmosis', provider: 'Medical Education', type: 'Platform' }
      ]
    },
    business: {
      name: 'Business & Management',
      icon: '📊',
      tagline: 'Lead, innovate, and drive business success',
      description: 'Study business administration, management, finance, marketing, and entrepreneurship',
      overview: {
        duration: '3 Years',
        salaryRange: '₹4-15 LPA',
        growthPotential: 'High',
        jobOpenings: '800K+ annually',
        topCompanies: ['TCS', 'Infosys', 'HCL', 'Wipro', 'Accenture']
      },
      syllabus: [
        'Business Mathematics & Statistics',
        'Financial Accounting',
        'Business Economics',
        'Management Principles',
        'Marketing Management',
        'Financial Management',
        'Human Resource Management',
        'Operations Management',
        'Business Law',
        'Strategic Management'
      ],
      opportunities: [
        { role: 'Business Analyst', salary: '₹6-12 LPA', company: 'Consulting Firms', growth: 'High' },
        { role: 'Marketing Manager', salary: '₹7-15 LPA', company: 'Marketing Agencies', growth: 'High' },
        { role: 'Financial Analyst', salary: '₹5-11 LPA', company: 'Financial Services', growth: 'Medium' },
        { role: 'HR Manager', salary: '₹6-13 LPA', company: 'Corporations', growth: 'Medium' },
        { role: 'Management Consultant', salary: '₹8-18 LPA', company: 'Consulting', growth: 'Very High' }
      ],
      resources: [
        { name: 'Business Fundamentals', provider: 'Coursera', type: 'Course' },
        { name: 'Principles of Management', provider: 'Koontz & Weihrich', type: 'Book' },
        { name: 'Harvard Business Review', provider: 'Business Insights', type: 'Publication' },
        { name: 'LinkedIn Learning', provider: 'Professional Development', type: 'Platform' }
      ]
    },
    arts: {
      name: 'Arts & Humanities',
      icon: '🎨',
      tagline: 'Explore human creativity, culture, and society',
      description: 'Study literature, history, philosophy, languages, and social sciences',
      heroStats: {
        duration: '3 Years',
        avgSalary: '₹6 LPA',
        growthRate: '+15%',
        jobOpenings: '600K+',
        topSkills: ['Communication', 'Critical Thinking', 'Research', 'Cultural Analysis']
      },
      overview: {
        duration: '3 Years',
        salaryRange: '₹3-12 LPA',
        growthPotential: 'Medium',
        jobOpenings: '600K+ annually',
        topCompanies: ['Education', 'Media', 'Government', 'NGOs', 'Publishing'],
        marketDemand: 'Growing',
        futureOutlook: 'Stable'
      },
      syllabus: [
        { semester: 1, subjects: ['English Literature', 'History', 'Political Science', 'Sociology', 'Communication Skills'] },
        { semester: 2, subjects: ['Psychology', 'Philosophy', 'Economics', 'Fine Arts', 'Environmental Studies'] },
        { semester: 3, subjects: ['Journalism & Mass Communication', 'Cultural Studies', 'Gender Studies', 'Elective I', 'Research Methodology'] },
        { semester: 4, subjects: ['Literature Analysis', 'Social Anthropology', 'Media Studies', 'Elective II', 'Field Work'] },
        { semester: 5, subjects: ['Advanced Literary Theory', 'Public Policy', 'Digital Humanities', 'Elective III', 'Project Work'] },
        { semester: 6, subjects: ['Capstone Research', 'Internship', 'Elective IV', 'Elective V', 'Dissertation'] }
      ],
      roadmap: [
        {
          stage: 'Foundation (Year 1)',
          duration: '1 year',
          description: 'Build foundational knowledge in literature, history, social sciences, and communication',
          skills: ['Critical Reading', 'Historical Analysis', 'Basic Research', 'Communication'],
          milestones: ['Literature analysis', 'Historical research', 'Social science concepts', 'Academic writing']
        },
        {
          stage: 'Core Arts (Year 2)',
          duration: '1 year',
          description: 'Deep dive into specialized areas like psychology, philosophy, and cultural studies',
          skills: ['Analytical Thinking', 'Cultural Analysis', 'Research Methods', 'Creative Expression'],
          milestones: ['Research projects', 'Cultural analysis', 'Philosophy debates', 'Creative writing']
        },
        {
          stage: 'Specialization (Year 3)',
          duration: '1 year',
          description: 'Choose your path: Literature, Journalism, Psychology, Sociology, or International Relations',
          skills: ['Specialized Knowledge', 'Professional Skills', 'Research Expertise', 'Industry Applications'],
          milestones: ['Specialized projects', 'Industry internships', 'Research publications', 'Career preparation']
        }
      ],
      opportunities: [
        {
          role: 'Content Writer',
          salary: '₹3-8 LPA',
          company: 'Media/Digital',
          growth: 'Medium',
          skills: ['Creative Writing', 'SEO', 'Content Strategy'],
          description: 'Create engaging content for digital platforms and publications'
        },
        {
          role: 'Teacher/Lecturer',
          salary: '₹4-10 LPA',
          company: 'Education',
          growth: 'Medium',
          skills: ['Subject Expertise', 'Teaching', 'Curriculum Development'],
          description: 'Educate and mentor students in academic institutions'
        },
        {
          role: 'Journalist',
          salary: '₹4-9 LPA',
          company: 'Media',
          growth: 'Medium',
          skills: ['Research', 'Interviewing', 'News Writing'],
          description: 'Investigate and report news stories for media organizations'
        },
        {
          role: 'Social Worker',
          salary: '₹3-7 LPA',
          company: 'NGOs',
          growth: 'Medium',
          skills: ['Counseling', 'Community Development', 'Policy Analysis'],
          description: 'Support communities and individuals facing social challenges'
        },
        {
          role: 'Research Analyst',
          salary: '₹5-12 LPA',
          company: 'Research Firms',
          growth: 'High',
          skills: ['Data Analysis', 'Research Methodology', 'Report Writing'],
          description: 'Conduct research and provide insights for organizations'
        }
      ],
      resources: {
        courses: [
          { name: 'The Modern World', provider: 'University of Edinburgh', rating: 4.7, students: '50K+', link: '#' },
          { name: 'Introduction to Psychology', provider: 'Coursera', rating: 4.8, students: '200K+', link: '#' },
          { name: 'Creative Writing', provider: 'Wesleyan University', rating: 4.6, students: '80K+', link: '#' },
          { name: 'The Ancient Greeks', provider: 'Wesleyan University', rating: 4.5, students: '60K+', link: '#' }
        ],
        books: [
          { name: 'Psychology', author: 'David Myers', rating: 4.6, pages: 928, link: '#' },
          { name: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', rating: 4.7, pages: 443, link: '#' },
          { name: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 4.5, pages: 499, link: '#' },
          { name: 'The Elements of Style', author: 'Strunk & White', rating: 4.4, pages: 105, link: '#' }
        ],
        websites: [
          { name: 'JSTOR', description: 'Academic research database', users: '10M+', link: '#' },
          { name: 'TED Talks', description: 'Ideas worth spreading', users: '100M+', link: '#' },
          { name: 'Khan Academy Humanities', description: 'Free humanities education', users: '50M+', link: '#' },
          { name: 'Project Gutenberg', description: 'Free eBooks', users: '5M+', link: '#' },
          { name: 'Coursera Arts', description: 'Online arts courses', users: '20M+', link: '#' }
        ],
        youtube: [
          { name: 'Crash Course Philosophy', subscribers: '1M+', focus: 'Philosophy explained simply', link: '#' },
          { name: 'Crash Course Psychology', subscribers: '2M+', focus: 'Psychology fundamentals', link: '#' },
          { name: 'Three Minute Theory', subscribers: '500K+', focus: 'Literary theory and analysis', link: '#' },
          { name: 'Lindsay Ellis', subscribers: '300K+', focus: 'Literature and media studies', link: '#' },
          { name: 'Vsauce', subscribers: '18M+', focus: 'Philosophy and science of everyday life', link: '#' }
        ]
      },
      portfolio: [
        {
          title: 'Literary Analysis Publication',
          tech: 'Research, Academic Writing, Literary Criticism',
          description: 'Published analysis of contemporary literature in academic journal',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Digital Media Campaign',
          tech: 'Content Creation, Social Media, Digital Storytelling',
          description: 'Created viral social media campaign for cultural awareness',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Community Research Project',
          tech: 'Field Research, Data Analysis, Report Writing',
          description: 'Comprehensive study of local community development needs',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        }
      ],
      exams: [
        { name: 'CUET', description: 'Common University Entrance Test', difficulty: 'Medium', cutoff: 'Top 30%', link: '#' },
        { name: 'IPU CET', description: 'Indraprastha University CET', difficulty: 'Medium', cutoff: 'Top 25%', link: '#' },
        { name: 'DUET', description: 'Delhi University Entrance Test', difficulty: 'Medium-High', cutoff: 'Top 20%', link: '#' },
        { name: 'JNU Entrance', description: 'Jawaharlal Nehru University', difficulty: 'High', cutoff: 'Top 5%', link: '#' }
      ],
      scholarships: [
        { name: 'NTSE Scholarship', amount: '₹500-2000/month', eligibility: 'Class 10 toppers', deadline: 'August 2025', link: '#' },
        { name: 'Central Sector Scholarship', amount: '₹10000-20000/year', eligibility: 'Merit-based for arts students', deadline: 'October 2025', link: '#' },
        { name: 'State Arts Scholarships', amount: 'Variable', eligibility: 'Arts stream students', deadline: 'Varies', link: '#' },
        { name: 'Minority Community Scholarships', amount: '₹15000-30000/year', eligibility: 'Minority community students', deadline: 'December 2025', link: '#' }
      ],
      testimonials: [
        {
          name: 'Maya Sharma',
          role: 'Senior Content Strategist at BuzzFeed',
          image: '/api/placeholder/60/60',
          quote: 'Arts education developed my creative thinking and communication skills, which are invaluable in the digital content world.',
          rating: 5
        },
        {
          name: 'Dr. Rajan Gupta',
          role: 'Professor at JNU',
          image: '/api/placeholder/60/60',
          quote: 'The critical thinking and research skills from humanities education opened doors to academic excellence and global opportunities.',
          rating: 5
        },
        {
          name: 'Priya Singh',
          role: 'Social Impact Consultant at UNDP',
          image: '/api/placeholder/60/60',
          quote: 'Arts background gave me the cultural sensitivity and analytical skills needed for international development work.',
          rating: 5
        }
      ],
      faq: [
        {
          question: 'Are arts degrees worthless?',
          answer: 'Absolutely not! Arts graduates develop critical thinking, communication, and creative skills highly valued by employers. Many successful leaders have arts backgrounds.'
        },
        {
          question: 'What are the highest paying arts jobs?',
          answer: 'Management Consultant (₹8-15 LPA), Content Director (₹10-20 LPA), UX Designer (₹6-12 LPA), and Corporate Communications (₹7-14 LPA) offer good salaries.'
        },
        {
          question: 'Can arts graduates get government jobs?',
          answer: 'Yes! UPSC Civil Services, Indian Foreign Service, teaching positions, research roles, and various government organizations actively recruit arts graduates.'
        },
        {
          question: 'Is it difficult to find jobs after arts?',
          answer: 'Not at all! Arts graduates work in diverse fields: content creation, research, consulting, HR, marketing, journalism, and international organizations.'
        },
        {
          question: 'Should I pursue masters after BA?',
          answer: 'It depends on your goals. For academic careers, research, or specialized roles, MA/MPhil/PhD is beneficial. For industry roles, relevant certifications often suffice.'
        },
        {
          question: 'Can arts students become entrepreneurs?',
          answer: 'Definitely! Arts education fosters creativity and problem-solving skills perfect for entrepreneurship. Many successful startups are founded by arts graduates.'
        }
      ]
    },
    science: {
      name: 'Pure Sciences',
      icon: '🔬',
      tagline: 'Discover the laws of nature and advance human knowledge',
      description: 'Study physics, chemistry, mathematics, biology, and other pure sciences',
      heroStats: {
        duration: '3 Years',
        avgSalary: '₹7 LPA',
        growthRate: '+18%',
        jobOpenings: '500K+',
        topSkills: ['Research', 'Data Analysis', 'Laboratory Skills', 'Scientific Computing']
      },
      overview: {
        duration: '3 Years',
        salaryRange: '₹4-15 LPA',
        growthPotential: 'Medium-High',
        jobOpenings: '500K+ annually',
        topCompanies: ['ISRO', 'DRDO', 'Research Institutes', 'Pharma', 'Academia'],
        marketDemand: 'Growing',
        futureOutlook: 'Strong'
      },
      syllabus: [
        { semester: 1, subjects: ['Mathematics I', 'Physics I', 'Chemistry I', 'Biology I', 'Computer Fundamentals'] },
        { semester: 2, subjects: ['Mathematics II', 'Physics II', 'Chemistry II', 'Biology II', 'Environmental Science'] },
        { semester: 3, subjects: ['Advanced Mathematics', 'Quantum Physics', 'Organic Chemistry', 'Genetics', 'Statistics'] },
        { semester: 4, subjects: ['Differential Equations', 'Electromagnetism', 'Inorganic Chemistry', 'Microbiology', 'Research Methodology'] },
        { semester: 5, subjects: ['Numerical Methods', 'Nuclear Physics', 'Physical Chemistry', 'Biotechnology', 'Elective I'] },
        { semester: 6, subjects: ['Scientific Computing', 'Astrophysics', 'Analytical Chemistry', 'Immunology', 'Project Work'] }
      ],
      roadmap: [
        {
          stage: 'Foundation (Year 1)',
          duration: '1 year',
          description: 'Master basic concepts in mathematics, physics, chemistry, and biology',
          skills: ['Mathematical Reasoning', 'Basic Laboratory Skills', 'Scientific Method', 'Data Analysis'],
          milestones: ['Fundamental concepts', 'Basic experiments', 'Mathematical problem-solving', 'Scientific writing']
        },
        {
          stage: 'Core Sciences (Year 2)',
          duration: '1 year',
          description: 'Deep dive into advanced topics and specialized scientific disciplines',
          skills: ['Advanced Mathematics', 'Research Techniques', 'Specialized Knowledge', 'Critical Analysis'],
          milestones: ['Complex experiments', 'Research projects', 'Advanced calculations', 'Scientific presentations']
        },
        {
          stage: 'Research & Specialization (Year 3)',
          duration: '1 year',
          description: 'Choose your scientific path: Research, Teaching, Industry, or Applied Sciences',
          skills: ['Research Methodology', 'Scientific Computing', 'Specialized Techniques', 'Project Management'],
          milestones: ['Research thesis', 'Industry projects', 'Scientific publications', 'Career specialization']
        }
      ],
      opportunities: [
        {
          role: 'Research Scientist',
          salary: '₹5-12 LPA',
          company: 'Research Labs',
          growth: 'Medium',
          skills: ['Research Methodology', 'Data Analysis', 'Scientific Writing'],
          description: 'Conduct scientific research and develop new knowledge'
        },
        {
          role: 'Professor/Lecturer',
          salary: '₹6-15 LPA',
          company: 'Universities',
          growth: 'Medium',
          skills: ['Teaching', 'Research', 'Subject Expertise'],
          description: 'Educate students and conduct academic research'
        },
        {
          role: 'Data Analyst',
          salary: '₹4-10 LPA',
          company: 'Analytics Firms',
          growth: 'High',
          skills: ['Statistical Analysis', 'Data Visualization', 'Programming'],
          description: 'Analyze scientific and business data for insights'
        },
        {
          role: 'Environmental Consultant',
          salary: '₹5-11 LPA',
          company: 'Consulting',
          growth: 'Medium',
          skills: ['Environmental Assessment', 'Regulatory Compliance', 'Report Writing'],
          description: 'Provide environmental impact assessments and consulting'
        },
        {
          role: 'Quality Control Analyst',
          salary: '₹4-8 LPA',
          company: 'Manufacturing',
          growth: 'Medium',
          skills: ['Quality Testing', 'Laboratory Techniques', 'Regulatory Compliance'],
          description: 'Ensure product quality and regulatory compliance'
        }
      ],
      resources: {
        courses: [
          { name: 'Introduction to Calculus', provider: 'Coursera', rating: 4.8, students: '150K+', link: '#' },
          { name: 'General Chemistry', provider: 'Duke University', rating: 4.7, students: '100K+', link: '#' },
          { name: 'Introduction to Biology', provider: 'Coursera', rating: 4.6, students: '200K+', link: '#' },
          { name: 'Classical Mechanics', provider: 'MIT OpenCourseWare', rating: 4.9, students: '80K+', link: '#' }
        ],
        books: [
          { name: 'University Physics', author: 'Young & Freedman', rating: 4.7, pages: 1600, link: '#' },
          { name: 'Organic Chemistry', author: 'Clayden et al.', rating: 4.6, pages: 1264, link: '#' },
          { name: 'Biology', author: 'Campbell & Reece', rating: 4.8, pages: 1488, link: '#' },
          { name: 'Introduction to Algorithms', author: 'CLRS', rating: 4.8, pages: 1312, link: '#' }
        ],
        websites: [
          { name: 'Khan Academy Science', description: 'Free science education', users: '50M+', link: '#' },
          { name: 'ScienceDirect', description: 'Scientific research articles', users: '20M+', link: '#' },
          { name: 'ResearchGate', description: 'Research collaboration platform', users: '20M+', link: '#' },
          { name: 'PubMed', description: 'Medical and life sciences literature', users: '15M+', link: '#' },
          { name: 'NASA Education', description: 'Space science resources', users: '5M+', link: '#' }
        ],
        youtube: [
          { name: 'Khan Academy', subscribers: '7M+', focus: 'Comprehensive science education', link: '#' },
          { name: 'Amoeba Sisters', subscribers: '5M+', focus: 'Biology and science concepts', link: '#' },
          { name: 'Physics Girl', subscribers: '2M+', focus: 'Physics demonstrations and explanations', link: '#' },
          { name: 'SciShow', subscribers: '7M+', focus: 'Science news and explanations', link: '#' },
          { name: 'Vsauce', subscribers: '18M+', focus: 'Science and philosophy', link: '#' }
        ]
      },
      portfolio: [
        {
          title: 'Research Publication',
          tech: 'Laboratory Research, Data Analysis, Scientific Writing',
          description: 'Published research on environmental pollution in peer-reviewed journal',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Data Analysis Project',
          tech: 'Python, R, Statistical Analysis, Data Visualization',
          description: 'Comprehensive analysis of climate change data with predictive modeling',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        },
        {
          title: 'Laboratory Management System',
          tech: 'Database Design, Web Development, Laboratory Automation',
          description: 'Developed system for managing laboratory resources and experiments',
          image: '/api/placeholder/400/300',
          github: '#',
          demo: '#'
        }
      ],
      exams: [
        { name: 'CUET', description: 'Common University Entrance Test', difficulty: 'Medium', cutoff: 'Top 30%', link: '#' },
        { name: 'IIT JAM', description: 'Joint Admission Test for MSc', difficulty: 'High', cutoff: 'Top 5%', link: '#' },
        { name: 'JEST', description: 'Joint Entrance Screening Test', difficulty: 'High', cutoff: 'Top 3%', link: '#' },
        { name: 'TIFR GS', description: 'Tata Institute PhD Entrance', difficulty: 'Very High', cutoff: 'Top 1%', link: '#' }
      ],
      scholarships: [
        { name: 'NTSE Scholarship', amount: '₹500-2000/month', eligibility: 'Class 10 toppers', deadline: 'August 2025', link: '#' },
        { name: 'KVPY Fellowship', amount: '₹5000-7000/month', eligibility: 'Science stream students', deadline: 'September 2025', link: '#' },
        { name: 'INSPIRE Scholarship', amount: '₹80000/year', eligibility: 'Science inclination', deadline: 'October 2025', link: '#' },
        { name: 'DST Inspire Faculty Award', amount: '₹50000-70000/month', eligibility: 'PhD in basic sciences', deadline: 'Varies', link: '#' }
      ],
      testimonials: [
        {
          name: 'Dr. Amit Kumar',
          role: 'Research Scientist at ISRO',
          image: '/api/placeholder/60/60',
          quote: 'Pure sciences education gave me the analytical thinking and research skills essential for space research and innovation.',
          rating: 5
        },
        {
          name: 'Dr. Priya Singh',
          role: 'Professor at IIT Delhi',
          image: '/api/placeholder/60/60',
          quote: 'The rigorous scientific training and mathematical foundation opened doors to teaching and research at premier institutions.',
          rating: 5
        },
        {
          name: 'Rahul Mehta',
          role: 'Data Scientist at Google',
          image: '/api/placeholder/60/60',
          quote: 'Mathematics and statistics from pure sciences degree were perfect preparation for advanced data science and machine learning.',
          rating: 5
        }
      ],
      faq: [
        {
          question: 'Are pure sciences degrees difficult?',
          answer: 'Pure sciences require strong mathematical and analytical skills. While challenging, they develop critical thinking and problem-solving abilities highly valued in research and industry.'
        },
        {
          question: 'What are career options after BSc?',
          answer: 'Research, teaching, data analysis, quality control, environmental consulting, pharmaceutical industry, government research labs, and further studies (MSc/PhD).'
        },
        {
          question: 'Is MSc necessary after BSc?',
          answer: 'For research and academic careers, MSc/PhD is essential. For industry roles, relevant certifications and experience can sometimes compensate, but MSc significantly improves prospects.'
        },
        {
          question: 'Can science graduates work in IT?',
          answer: 'Yes! Mathematics and logical thinking skills are excellent for software development, data analysis, and quantitative roles. Many science graduates transition to tech careers.'
        },
        {
          question: 'What are the highest paying science jobs?',
          answer: 'Data Scientist (₹8-15 LPA), Research Scientist in Pharma (₹6-12 LPA), Quantitative Analyst (₹10-20 LPA), and Management Consultant (₹8-15 LPA).'
        },
        {
          question: 'Can science graduates become entrepreneurs?',
          answer: 'Absolutely! Scientific knowledge combined with analytical skills is perfect for biotech startups, environmental consulting firms, and research-based companies.'
        }
      ]
    }
  };

  const branchData = branchId ? degreeDetailData[branchId as keyof typeof degreeDetailData] : null;

  if (!branchData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Branch not found</h1>
            <Button onClick={() => navigate('/career-paths')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Career Paths
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <Button
                variant="outline"
                onClick={() => navigate('/career-paths')}
                className="mb-8 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Career Paths
              </Button>

              <div className="text-9xl mb-8 animate-bounce">{branchData.icon}</div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {branchData.name}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium mb-4 max-w-4xl mx-auto">
                {branchData.tagline}
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {branchData.description}
              </p>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-card">
                <Clock className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{(branchData as any).heroStats ? (branchData as any).heroStats.duration : branchData.overview.duration}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-card">
                <DollarSign className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{(branchData as any).heroStats ? (branchData as any).heroStats.avgSalary : branchData.overview.salaryRange.split('-')[0] + ' LPA'}</div>
                <div className="text-sm text-muted-foreground">Avg Salary</div>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-card">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{(branchData as any).heroStats ? (branchData as any).heroStats.growthRate : '+20%'}</div>
                <div className="text-sm text-muted-foreground">Growth Rate</div>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-card">
                <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{(branchData as any).heroStats ? (branchData as any).heroStats.jobOpenings : branchData.overview.jobOpenings.split(' ')[0]}</div>
                <div className="text-sm text-muted-foreground">Job Openings</div>
              </div>
            </div>

            {/* Top Skills */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Skills You'll Master</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {((branchData as any).heroStats ? (branchData as any).heroStats.topSkills : ['Programming', 'Problem Solving', 'Communication', 'Leadership']).map((skill: string, index: number) => (
                  <Badge key={index} className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-12 h-12">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="syllabus" className="text-sm">Syllabus</TabsTrigger>
              <TabsTrigger value="roadmap" className="text-sm">Roadmap</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-sm">Careers</TabsTrigger>
              <TabsTrigger value="resources" className="text-sm">Resources</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-sm">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="shadow-card hover:shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold text-primary mb-2">{(branchData as any).overview.marketDemand || 'High'}</h3>
                    <p className="text-muted-foreground">Market Demand</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card hover:shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold text-primary mb-2">{(branchData as any).overview.futureOutlook || 'Strong'}</h3>
                    <p className="text-muted-foreground">Future Outlook</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card hover:shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-2xl font-bold text-primary mb-2">{branchData.overview.jobOpenings}</h3>
                    <p className="text-muted-foreground">Annual Openings</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Companies */}
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-primary" />
                    Top Companies Hiring {branchData.name} Graduates
                  </CardTitle>
                  <p className="text-muted-foreground">Leading organizations actively recruiting fresh talent</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {branchData.overview.topCompanies.map((company, index) => (
                      <div key={index} className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
                        <div className="text-2xl font-bold text-primary mb-2">{company[0]}</div>
                        <div className="text-sm font-medium text-foreground">{company}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              {(branchData as any).testimonials && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center text-foreground">Success Stories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(branchData as any).testimonials.map((testimonial: any, index: number) => (
                      <Card key={index} className="shadow-card hover:shadow-card border-primary/10">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                              <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                          <Quote className="w-8 h-8 text-primary/30 mb-3" />
                          <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                          <div className="flex text-primary">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="syllabus" className="space-y-8">
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Complete 4-Year Syllabus Breakdown
                  </CardTitle>
                  <p className="text-muted-foreground">Semester-wise subjects and learning progression</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {branchData.syllabus.map((semester, index) => (
                      <div key={index} className="border border-primary/10 rounded-xl p-6 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-primary">Semester {semester.semester}</h3>
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            {semester.subjects.length} Subjects
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {semester.subjects.map((subject, subIndex) => (
                            <div key={subIndex} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                {subIndex + 1}
                              </div>
                              <span className="text-sm font-medium text-foreground">{subject}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button className="bg-primary hover:bg-primary/90 shadow-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Complete Syllabus PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-8">
              {(branchData as any).roadmap ? (
                <Card className="shadow-card border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      4-Year Learning Roadmap
                    </CardTitle>
                    <p className="text-muted-foreground">Your journey from beginner to industry-ready professional</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {(branchData as any).roadmap.map((stage: any, index: number) => (
                        <div key={index} className="relative">
                          {index < (branchData as any).roadmap.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-20 bg-primary/20"></div>
                          )}
                          <div className="flex gap-6">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-primary">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-foreground">{stage.stage}</h3>
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  {stage.duration}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-4">{stage.description}</p>
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">Key Skills:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {stage.skills.map((skill: string, skillIndex: number) => (
                                      <Badge key={skillIndex} variant="outline" className="border-primary/20 text-primary">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground mb-2">Milestones:</h4>
                                  <ul className="space-y-1">
                                    {stage.milestones.map((milestone: string, milestoneIndex: number) => (
                                      <li key={milestoneIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                        {milestone}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Learning Roadmap</h3>
                    <p className="text-muted-foreground">Detailed roadmap coming soon for this degree branch.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-8">
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Career Opportunities & Roles
                  </CardTitle>
                  <p className="text-muted-foreground">Explore diverse career paths and salary expectations</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {branchData.opportunities.map((opportunity, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{opportunity.role}</h3>
                            <p className="text-primary font-medium">{opportunity.company}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {opportunity.growth}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground text-sm mb-4">{opportunity.description}</p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-primary">{opportunity.salary}</span>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-2">Required Skills:</h4>
                            <div className="flex flex-wrap gap-1">
                              {opportunity.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs border-primary/20 text-primary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-8">
              {(branchData as any).resources && (branchData as any).resources.courses ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Courses */}
                  <Card className="shadow-card border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Play className="w-5 h-5 text-primary" />
                        Recommended Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(branchData as any).resources.courses.map((course: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{course.name}</h4>
                            <p className="text-muted-foreground text-xs">{course.provider}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{course.rating}</span>
                              <span className="text-xs text-muted-foreground">• {course.students}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Books */}
                  <Card className="shadow-card border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        Essential Books
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(branchData as any).resources.books.map((book: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{book.name}</h4>
                            <p className="text-muted-foreground text-xs">by {book.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(book.rating) ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{book.rating} • {book.pages} pages</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Learning Resources</h3>
                    <p className="text-muted-foreground">Comprehensive resource list coming soon for this degree branch.</p>
                  </CardContent>
                </Card>
              )}

              {/* Websites & YouTube */}
              {(branchData as any).resources && (branchData as any).resources.websites ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="shadow-card border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        Essential Websites
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(branchData as any).resources.websites.map((site: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{site.name}</h4>
                            <p className="text-muted-foreground text-xs">{site.description}</p>
                            <p className="text-primary text-xs font-medium mt-1">{site.users} users</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Play className="w-5 h-5 text-primary" />
                        YouTube Channels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(branchData as any).resources.youtube.map((channel: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{channel.name}</h4>
                            <p className="text-muted-foreground text-xs">{channel.focus}</p>
                            <p className="text-primary text-xs font-medium mt-1">{channel.subscribers} subscribers</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-8">
              {(branchData as any).portfolio ? (
                <Card className="shadow-card border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-primary" />
                      Portfolio Projects & Examples
                    </CardTitle>
                    <p className="text-muted-foreground">Build an impressive portfolio with these project ideas</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(branchData as any).portfolio.map((project: any, index: number) => (
                        <div key={index} className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-lg text-foreground mb-2">{project.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                            <div className="mb-4">
                              <h4 className="font-semibold text-foreground text-sm mb-2">Technologies:</h4>
                              <div className="flex flex-wrap gap-1">
                                {project.tech.split(', ').map((tech: string, techIndex: number) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs border-primary/20 text-primary">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Demo
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                                GitHub
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-card border-primary/10">
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Portfolio Projects</h3>
                    <p className="text-muted-foreground">Project examples and portfolio ideas coming soon for this degree branch.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Additional Sections */}
          <div className="space-y-12">
            {/* Entrance Exams */}
            {(branchData as any).exams && (
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Entrance Exams & Admission
                  </CardTitle>
                  <p className="text-muted-foreground">Exams to secure admission in top colleges</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(branchData as any).exams.map((exam: any, index: number) => (
                      <div key={index} className="p-6 border border-primary/10 rounded-xl bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg text-foreground">{exam.name}</h3>
                          <Badge className={`${
                            exam.difficulty === 'Very High' ? 'bg-red-100 text-red-700 border-red-200' :
                            exam.difficulty === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}>
                            {exam.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
                        <p className="text-primary font-medium text-sm">Cutoff: {exam.cutoff}</p>
                        <Button size="sm" variant="outline" className="w-full mt-4 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scholarships */}
            {(branchData as any).scholarships && (
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Scholarships & Financial Aid
                  </CardTitle>
                  <p className="text-muted-foreground">Available scholarships to support your education</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(branchData as any).scholarships.map((scholarship: any, index: number) => (
                      <div key={index} className="p-6 border border-primary/10 rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-foreground mb-1">{scholarship.name}</h3>
                            <p className="text-primary font-semibold">{scholarship.amount}</p>
                          </div>
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            {scholarship.deadline}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{scholarship.eligibility}</p>
                        <Button size="sm" variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                          Apply Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {(branchData as any).faq && (
              <Card className="shadow-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                  <p className="text-muted-foreground">Common questions about {branchData.name}</p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {(branchData as any).faq.map((item: any, index: number) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-primary/10 rounded-lg px-6">
                        <AccordionTrigger className="text-left hover:text-primary transition-colors">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Final Call to Action */}
          <div className="text-center py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/10">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Start Your {branchData.name} Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of successful graduates who transformed their careers through {branchData.name}.
              Your future in tech starts here!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-primary text-lg px-8 py-4">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Learning Path
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Download Career Guide
              </Button>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              🎯 <strong>Pro Tip:</strong> Start with the fundamentals and build projects to strengthen your portfolio
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}