import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MapPin, Briefcase, ExternalLink, GraduationCap, Award, DollarSign, Clock, Users, Star, Target, Lightbulb, Calculator, Code, Palette, Microscope, TrendingUp } from 'lucide-react';

interface DegreeBranchContentProps {
  selectedBranch: string;
}

const degreeBranchData = {
  computerScience: {
    name: 'Computer Science',
    icon: '💻',
    description: 'Study algorithms, programming, software development, AI, and computer systems',
    syllabus: [
      'Programming Fundamentals (Python, Java, C++)',
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'Artificial Intelligence & Machine Learning',
      'Web Development (Full Stack)',
      'Mobile App Development',
      'Cybersecurity'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Programming basics, mathematics, and computer fundamentals',
        skills: ['Basic Programming', 'Mathematics', 'Logic Building']
      },
      {
        stage: 'Core CS Subjects',
        duration: '2 years',
        description: 'Data structures, algorithms, databases, and system design',
        skills: ['DSA', 'System Design', 'Database Design']
      },
      {
        stage: 'Specialization',
        duration: '1 year',
        description: 'Choose AI/ML, Web Dev, Cybersecurity, or Data Science',
        skills: ['Specialized Skills', 'Advanced Programming', 'Industry Tools']
      },
      {
        stage: 'Projects & Internships',
        duration: '6 months',
        description: 'Real-world projects and industry experience',
        skills: ['Project Management', 'Industry Experience', 'Portfolio Building']
      }
    ],
    opportunities: [
      'Software Engineer (₹6-15 LPA)',
      'Data Scientist (₹8-20 LPA)',
      'AI/ML Engineer (₹10-25 LPA)',
      'Full Stack Developer (₹5-12 LPA)',
      'DevOps Engineer (₹7-18 LPA)',
      'Product Manager (₹12-30 LPA)',
      'Tech Entrepreneur (Variable)'
    ],
    resources: [
      { type: 'Courses', items: ['CS50 (Harvard)', 'Coursera CS Specialization', 'Udemy Web Development', 'freeCodeCamp'] },
      { type: 'Books', items: ['Clean Code', 'Introduction to Algorithms', 'Design Patterns', 'Computer Networking'] },
      { type: 'Websites', items: ['GeeksforGeeks', 'LeetCode', 'HackerRank', 'Stack Overflow', 'GitHub'] },
      { type: 'YouTube Channels', items: ['freeCodeCamp', 'Traversy Media', 'The Net Ninja', 'Academind', 'CS Dojo'] }
    ],
    exams: [
      'JEE Main/Advanced (for IITs/NITs)',
      'BITSAT (for BITS Pilani)',
      'VITEEE (for VIT)',
      'State Engineering Entrance Exams',
      'CUET (for Central Universities)'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'KVPY Fellowship (₹5000-7000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'Merit-cum-Means Scholarship',
      'State Government Scholarships'
    ]
  },
  engineering: {
    name: 'Engineering',
    icon: '⚙️',
    description: 'Study mechanical, electrical, civil, or chemical engineering principles and applications',
    syllabus: [
      'Engineering Mathematics',
      'Engineering Physics',
      'Engineering Chemistry',
      'Engineering Drawing & Graphics',
      'Basic Electrical & Electronics',
      'Thermodynamics & Heat Transfer',
      'Fluid Mechanics',
      'Manufacturing Processes',
      'Control Systems',
      'Project Management'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Mathematics, physics, chemistry, and basic engineering concepts',
        skills: ['Engineering Basics', 'Technical Drawing', 'Problem Solving']
      },
      {
        stage: 'Core Engineering',
        duration: '2 years',
        description: 'Specialized engineering subjects and laboratory work',
        skills: ['Technical Analysis', 'Design Skills', 'Lab Experience']
      },
      {
        stage: 'Specialization & Projects',
        duration: '1 year',
        description: 'Advanced topics, capstone projects, and industry exposure',
        skills: ['Advanced Engineering', 'Project Design', 'Industry Knowledge']
      },
      {
        stage: 'Internship & Training',
        duration: '6 months',
        description: 'Industry internships and practical training',
        skills: ['Industry Experience', 'Professional Skills', 'Team Work']
      }
    ],
    opportunities: [
      'Mechanical Engineer (₹4-10 LPA)',
      'Electrical Engineer (₹4-12 LPA)',
      'Civil Engineer (₹3-8 LPA)',
      'Chemical Engineer (₹5-15 LPA)',
      'Design Engineer (₹5-12 LPA)',
      'Project Manager (₹8-20 LPA)',
      'Engineering Consultant (₹6-18 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['MIT OpenCourseWare', 'Coursera Engineering', 'edX Engineering', 'NPTEL Engineering'] },
      { type: 'Books', items: ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials'] },
      { type: 'Websites', items: ['Engineers Academy', 'IES Master', 'Made Easy', 'ACE Engineering', 'Gradeup'] },
      { type: 'YouTube Channels', items: ['Ekeeda', 'Unacademy Engineering', 'Engineers Academy', 'IES GS', 'Made Easy'] }
    ],
    exams: [
      'JEE Main/Advanced (for IITs/NITs)',
      'BITSAT (for BITS Pilani)',
      'VITEEE (for VIT)',
      'State Engineering Entrance Exams',
      'COMEDK (for Karnataka)',
      'WBJEE (for West Bengal)'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'KVPY Fellowship (₹5000-7000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'AICTE Scholarships',
      'State Technical Education Scholarships'
    ]
  },
  medicine: {
    name: 'Medicine (MBBS)',
    icon: '🏥',
    description: 'Study human anatomy, diseases, medical diagnosis, and patient care',
    syllabus: [
      'Human Anatomy & Physiology',
      'Biochemistry',
      'Pathology',
      'Pharmacology',
      'Microbiology',
      'Forensic Medicine',
      'Community Medicine',
      'General Medicine',
      'General Surgery',
      'Obstetrics & Gynecology'
    ],
    roadmap: [
      {
        stage: 'Pre-Medical (11th-12th)',
        duration: '2 years',
        description: 'Biology, Chemistry, Physics with NEET preparation',
        skills: ['Medical Sciences', 'NEET Preparation', 'Biology Fundamentals']
      },
      {
        stage: 'MBBS (4.5 years)',
        duration: '4.5 years',
        description: 'Medical education with clinical rotations',
        skills: ['Clinical Skills', 'Patient Care', 'Medical Knowledge']
      },
      {
        stage: 'Internship (1 year)',
        duration: '1 year',
        description: 'Compulsory rotating internship in hospitals',
        skills: ['Hospital Experience', 'Specialty Exposure', 'Professional Practice']
      },
      {
        stage: 'Post-Graduation (Optional)',
        duration: '3 years',
        description: 'MD/MS specialization in chosen field',
        skills: ['Specialized Knowledge', 'Research Skills', 'Advanced Practice']
      }
    ],
    opportunities: [
      'General Physician (₹8-15 LPA)',
      'Surgeon (₹15-40 LPA)',
      'Pediatrician (₹10-25 LPA)',
      'Gynecologist (₹12-30 LPA)',
      'Cardiologist (₹20-50 LPA)',
      'Medical Researcher (₹8-20 LPA)',
      'Hospital Administrator (₹10-25 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['NEET Preparation Courses', 'Medical Biology', 'Anatomy Courses', 'Medical Terminology'] },
      { type: 'Books', items: ['Gray\'s Anatomy', 'Harrison\'s Medicine', 'Robbins Pathology', 'Guyton Physiology'] },
      { type: 'Websites', items: ['NEETprep.com', 'Aakash Institute', 'Allen Career Institute', 'Medical Dialogues', 'Medscape'] },
      { type: 'YouTube Channels', items: ['NEETprep', 'Aakash Institute', 'Unacademy NEET', 'Medical Academy', 'Dr. Najeeb Lectures'] }
    ],
    exams: [
      'NEET UG (for MBBS/BDS)',
      'AIIMS MBBS',
      'JIPMER MBBS',
      'State Medical Entrance Exams',
      'AFMC (Armed Forces Medical College)'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'Pragati Scholarship (for girls)',
      'AIIMS Scholarships',
      'State Medical Scholarships'
    ]
  },
  business: {
    name: 'Business & Management',
    icon: '📊',
    description: 'Study business administration, management, finance, marketing, and entrepreneurship',
    syllabus: [
      'Business Mathematics & Statistics',
      'Financial Accounting',
      'Business Economics',
      'Marketing Management',
      'Human Resource Management',
      'Operations Management',
      'Strategic Management',
      'Business Law',
      'Entrepreneurship',
      'International Business'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Business basics, mathematics, and communication skills',
        skills: ['Business Fundamentals', 'Communication', 'Basic Accounting']
      },
      {
        stage: 'Core Business Subjects',
        duration: '2 years',
        description: 'Marketing, finance, HR, and operations management',
        skills: ['Management Skills', 'Financial Analysis', 'Marketing Strategy']
      },
      {
        stage: 'Specialization',
        duration: '1 year',
        description: 'Choose Finance, Marketing, HR, or Entrepreneurship',
        skills: ['Specialized Knowledge', 'Industry Skills', 'Leadership']
      },
      {
        stage: 'Internship & Projects',
        duration: '6 months',
        description: 'Corporate internships and business projects',
        skills: ['Corporate Experience', 'Project Management', 'Professional Networking']
      }
    ],
    opportunities: [
      'Business Analyst (₹6-15 LPA)',
      'Marketing Manager (₹8-20 LPA)',
      'Financial Analyst (₹5-12 LPA)',
      'HR Manager (₹7-18 LPA)',
      'Operations Manager (₹8-22 LPA)',
      'Management Consultant (₹10-25 LPA)',
      'Entrepreneur (Variable)'
    ],
    resources: [
      { type: 'Courses', items: ['MBA Programs', 'Business Analytics', 'Digital Marketing', 'Financial Modeling'] },
      { type: 'Books', items: ['Business Communication', 'Financial Management', 'Marketing Management', 'Organizational Behavior'] },
      { type: 'Websites', items: ['MBA Crystal Ball', 'PaGaLGuY', 'CAT Preparation', 'Business Standard', 'Economic Times'] },
      { type: 'YouTube Channels', items: ['MBA Crystal Ball', 'Unacademy Business', 'CAT King', 'MBA Wallah', 'Business Case Studies'] }
    ],
    exams: [
      'CAT (for IIMs)',
      'MAT (Management Aptitude Test)',
      'XAT (for XLRI)',
      'CMAT (Common Management Admission Test)',
      'ATMA (AIMS Test for Management Admissions)'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'Merit-cum-Means Scholarship',
      'State Government Scholarships',
      'Minority Community Scholarships'
    ]
  },
  arts: {
    name: 'Arts & Humanities',
    icon: '🎨',
    description: 'Study literature, history, philosophy, languages, and social sciences',
    syllabus: [
      'English Literature',
      'History & Civilization',
      'Political Science',
      'Sociology',
      'Psychology',
      'Philosophy',
      'Economics',
      'Journalism & Mass Communication',
      'Fine Arts',
      'Foreign Languages'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Basic subjects, communication skills, and general knowledge',
        skills: ['Communication', 'Critical Thinking', 'General Knowledge']
      },
      {
        stage: 'Core Subjects',
        duration: '2 years',
        description: 'Specialized study in chosen humanities field',
        skills: ['Subject Expertise', 'Research Skills', 'Analytical Thinking']
      },
      {
        stage: 'Specialization & Research',
        duration: '1 year',
        description: 'Advanced topics, research projects, and internships',
        skills: ['Research Methodology', 'Specialized Knowledge', 'Professional Skills']
      },
      {
        stage: 'Career Preparation',
        duration: '6 months',
        description: 'Internships, certifications, and career planning',
        skills: ['Industry Experience', 'Professional Development', 'Career Planning']
      }
    ],
    opportunities: [
      'Content Writer (₹3-8 LPA)',
      'Journalist (₹4-10 LPA)',
      'Teacher/Professor (₹4-12 LPA)',
      'Social Worker (₹3-7 LPA)',
      'Public Relations (₹4-9 LPA)',
      'Research Analyst (₹5-11 LPA)',
      'Creative Writer (₹3-15 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['Creative Writing', 'Journalism', 'Public Speaking', 'Research Methodology'] },
      { type: 'Books', items: ['Literature Classics', 'History Books', 'Psychology Texts', 'Philosophy Works'] },
      { type: 'Websites', items: ['DU SOL', 'IGNOU', 'Coursera Arts', 'edX Humanities', 'Khan Academy'] },
      { type: 'YouTube Channels', items: ['TED-Ed', 'Crash Course', 'Lindsay Ellis', 'Three Minute Philosophy', 'Literature Videos'] }
    ],
    exams: [
      'CUET (Central Universities)',
      'State University Entrance Exams',
      'JNUEE (JNU Entrance)',
      'BHU UET (Banaras Hindu University)',
      'DUET (Delhi University Entrance Test)'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'Merit-cum-Means Scholarship',
      'State Government Scholarships',
      'Minority Community Scholarships'
    ]
  },
  science: {
    name: 'Pure Sciences',
    icon: '🔬',
    description: 'Study physics, chemistry, mathematics, biology, and other pure sciences',
    syllabus: [
      'Advanced Mathematics',
      'Physics (Classical & Modern)',
      'Chemistry (Organic, Inorganic, Physical)',
      'Biology (Botany, Zoology, Biotechnology)',
      'Computer Science Fundamentals',
      'Statistics & Probability',
      'Research Methodology',
      'Scientific Computing',
      'Environmental Science',
      'Astronomy & Astrophysics'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Basic sciences, mathematics, and research fundamentals',
        skills: ['Scientific Method', 'Mathematical Skills', 'Basic Research']
      },
      {
        stage: 'Core Science Subjects',
        duration: '2 years',
        description: 'Advanced study in chosen science field',
        skills: ['Advanced Science', 'Laboratory Skills', 'Data Analysis']
      },
      {
        stage: 'Research & Specialization',
        duration: '1 year',
        description: 'Research projects and specialized topics',
        skills: ['Research Skills', 'Specialized Knowledge', 'Scientific Writing']
      },
      {
        stage: 'Advanced Training',
        duration: '6 months',
        description: 'Internships, workshops, and advanced training',
        skills: ['Professional Skills', 'Industry Experience', 'Scientific Communication']
      }
    ],
    opportunities: [
      'Research Scientist (₹5-12 LPA)',
      'Professor/Lecturer (₹6-15 LPA)',
      'Data Analyst (₹4-10 LPA)',
      'Lab Technician (₹3-6 LPA)',
      'Science Writer (₹4-9 LPA)',
      'Environmental Consultant (₹5-11 LPA)',
      'Quality Control Analyst (₹4-8 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['Coursera Science', 'edX Research Methods', 'Khan Academy Science', 'MIT OpenCourseWare'] },
      { type: 'Books', items: ['University Physics', 'Organic Chemistry', 'Calculus', 'Biology Textbooks'] },
      { type: 'Websites', items: ['ResearchGate', 'ScienceDirect', 'PubMed', 'NASA Education', 'NOAA Education'] },
      { type: 'YouTube Channels', items: ['Vsauce', 'SciShow', 'PBS Space Time', 'MinutePhysics', 'Smarter Every Day'] }
    ],
    exams: [
      'IIT JAM (for MSc in IITs)',
      'CSIR NET (for Research)',
      'GATE (for M.Tech/MS)',
      'CUET (Central Universities)',
      'State MSc Entrance Exams'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'KVPY Fellowship (₹5000-7000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'DST Scholarships',
      'CSIR Fellowships'
    ]
  },
  law: {
    name: 'Law & Justice',
    icon: '⚖️',
    description: 'Study legal principles, constitutional law, criminal law, and justice system',
    syllabus: [
      'Legal and Constitutional History',
      'Jurisprudence',
      'Constitutional Law',
      'Criminal Law',
      'Civil Law',
      'Company Law',
      'Environmental Law',
      'Human Rights Law',
      'International Law',
      'Legal Research & Writing'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Legal history, basic laws, and legal reasoning',
        skills: ['Legal Knowledge', 'Critical Thinking', 'Research Skills']
      },
      {
        stage: 'Core Law Subjects',
        duration: '2 years',
        description: 'Constitutional, criminal, and civil law studies',
        skills: ['Legal Analysis', 'Case Study', 'Legal Writing']
      },
      {
        stage: 'Specialization',
        duration: '1 year',
        description: 'Choose Criminal, Corporate, or Constitutional Law',
        skills: ['Specialized Law', 'Court Procedures', 'Legal Practice']
      },
      {
        stage: 'Internship & Bar Council',
        duration: '6 months',
        description: 'Law firm internships and Bar Council exam preparation',
        skills: ['Practical Law', 'Court Experience', 'Professional Ethics']
      }
    ],
    opportunities: [
      'Lawyer (₹5-15 LPA)',
      'Legal Consultant (₹6-18 LPA)',
      'Corporate Lawyer (₹8-25 LPA)',
      'Judge (₹8-20 LPA)',
      'Legal Researcher (₹4-10 LPA)',
      'Legal Journalist (₹4-9 LPA)',
      'Policy Analyst (₹6-14 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['Legal Research', 'Contract Law', 'Criminal Law', 'Constitutional Law'] },
      { type: 'Books', items: ['Constitution of India', 'IPC & CrPC', 'Contract Law', 'Company Law'] },
      { type: 'Websites', items: ['Bar Council of India', 'Supreme Court of India', 'Legal Services India', 'Manupatra', 'SCC Online'] },
      { type: 'YouTube Channels', items: ['Legal Aid', 'Lawctopus', 'iPleaders', 'LawSikho', 'LegalEdge Tutorials'] }
    ],
    exams: [
      'CLAT (Common Law Admission Test)',
      'LSAT (Law School Admission Test)',
      'AILET (All India Law Entrance Test)',
      'MH CET Law',
      'DU LLB Entrance'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'Merit-cum-Means Scholarship',
      'State Government Law Scholarships',
      'Minority Community Scholarships'
    ]
  },
  design: {
    name: 'Design & Creative',
    icon: '🎨',
    description: 'Study visual design, UX/UI, fashion design, and creative industries',
    syllabus: [
      'Design Principles & Theory',
      'Visual Communication',
      'Digital Design Tools',
      'UX/UI Design',
      'Graphic Design',
      'Typography & Layout',
      'Color Theory',
      'Branding & Identity',
      'Web Design',
      'Design Research & Methodology'
    ],
    roadmap: [
      {
        stage: 'Foundation Year',
        duration: '1 year',
        description: 'Design basics, software tools, and creative fundamentals',
        skills: ['Design Software', 'Creative Thinking', 'Visual Communication']
      },
      {
        stage: 'Core Design Subjects',
        duration: '2 years',
        description: 'Advanced design techniques and specialization',
        skills: ['Advanced Design', 'Portfolio Development', 'Industry Tools']
      },
      {
        stage: 'Specialization & Projects',
        duration: '1 year',
        description: 'Specialized design field and major projects',
        skills: ['Specialized Skills', 'Project Management', 'Client Presentation']
      },
      {
        stage: 'Internship & Portfolio',
        duration: '6 months',
        description: 'Industry internships and portfolio development',
        skills: ['Industry Experience', 'Professional Portfolio', 'Networking']
      }
    ],
    opportunities: [
      'UX/UI Designer (₹4-12 LPA)',
      'Graphic Designer (₹3-8 LPA)',
      'Product Designer (₹6-15 LPA)',
      'Creative Director (₹10-25 LPA)',
      'Brand Designer (₹5-14 LPA)',
      'Web Designer (₹4-10 LPA)',
      'Design Consultant (₹6-18 LPA)'
    ],
    resources: [
      { type: 'Courses', items: ['Adobe Creative Suite', 'UX Design', 'Graphic Design', 'Figma & Design Tools'] },
      { type: 'Books', items: ['The Non-Designer\'s Design Book', 'Don\'t Make Me Think', 'Color Psychology', 'Typography'] },
      { type: 'Websites', items: ['Behance', 'Dribbble', 'AIGA', 'Designmodo', 'Smashing Magazine'] },
      { type: 'YouTube Channels', items: ['The Futur', 'Will Paterson', 'Will Harris', 'Design Theory', 'Creative Bloq'] }
    ],
    exams: [
      'NID Entrance Exam',
      'NIFT Entrance Exam',
      'UCEED (for IIT Design)',
      'MIT ID DAT',
      'Srishti Entrance Exam'
    ],
    scholarships: [
      'NTSE Scholarship (₹500-2000/month)',
      'INSPIRE Scholarship (₹80000/year)',
      'NID Scholarships',
      'NIFT Scholarships',
      'State Design Scholarships'
    ]
  }
};

export const DegreeBranchContent: React.FC<DegreeBranchContentProps> = ({ selectedBranch }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const branchData = degreeBranchData[selectedBranch as keyof typeof degreeBranchData];

  if (!branchData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Branch data not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Branch Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{branchData.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{branchData.name}</h1>
              <p className="text-muted-foreground text-lg">{branchData.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <GraduationCap className="w-4 h-4 mr-1" />
              3-4 Year Degree
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <DollarSign className="w-4 h-4 mr-1" />
              ₹3-25 LPA Salary Range
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              High Growth Potential
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Free Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branchData.resources.map((resource, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-2">{resource.type}</h4>
                      <ul className="space-y-1">
                        {resource.items.map((item, i) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Entrance Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {branchData.exams.map((exam, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {exam}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Scholarships & Financial Aid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchData.scholarships.map((scholarship, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm">{scholarship}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Degree Syllabus Overview</CardTitle>
              <p className="text-muted-foreground">Core subjects and topics you'll study</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchData.syllabus.map((subject, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <span className="font-medium">{subject}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Roadmap</CardTitle>
              <p className="text-muted-foreground">Your journey from student to professional</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {branchData.roadmap.map((stage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{index + 1}</span>
                      </div>
                      {index < branchData.roadmap.length - 1 && (
                        <div className="w-0.5 h-16 bg-border mt-4"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{stage.stage}</h3>
                        <Badge variant="outline">{stage.duration}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{stage.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Career Opportunities
              </CardTitle>
              <p className="text-muted-foreground">Job roles and salary expectations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchData.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{opportunity.split(' (')[0]}</h4>
                      <Badge variant="secondary">{opportunity.split(' (')[1]?.replace(')', '')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.includes('LPA') ? 'Competitive salary with growth potential' : 'Variable compensation based on success'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};