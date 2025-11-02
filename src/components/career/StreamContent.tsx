import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  MapPin,
  Trophy,
  Gift,
  FileText,
  GraduationCap,
  ExternalLink,
  Download,
  Play,
  Star,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

interface StreamContentProps {
  selectedStream: string;
}

export const StreamContent: React.FC<StreamContentProps> = ({ selectedStream }) => {
  const [activeTab, setActiveTab] = useState('syllabus');

  // Dynamic content based on stream
  const getStreamData = (stream: string) => {
    const streamData = {
      mpc: {
        name: 'MPC (Mathematics, Physics, Chemistry)',
        color: 'blue',
        syllabus: [
          { subject: 'Mathematics', topics: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'] },
          { subject: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics'] },
          { subject: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Build strong basics in Math, Physics, Chemistry' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and competitive exam preparation' },
          { phase: 'Entrance Exams', duration: '6-12 months', focus: 'JEE Main, JEE Advanced, BITSAT preparation' },
          { phase: 'Engineering Degree', duration: '4 years', focus: 'Specialization in chosen engineering branch' }
        ],
        opportunities: [
          { title: 'Engineering', description: 'B.Tech in CSE, Mechanical, Civil, Electrical, etc.', salary: '₹3-15 LPA' },
          { title: 'Architecture', description: 'B.Arch degree programs', salary: '₹4-12 LPA' },
          { title: 'Pure Sciences', description: 'B.Sc in Physics, Mathematics, Chemistry', salary: '₹2-8 LPA' },
          { title: 'Research', description: 'M.Sc, PhD in scientific research', salary: '₹4-20 LPA' }
        ],
        resources: [
          { title: 'NCERT Books', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Official textbooks for Class 11-12' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Video tutorials for Math & Science' },
          { title: 'Physics Wallah', type: 'Free/Paid', link: 'https://www.pw.live', description: 'Comprehensive JEE preparation' },
          { title: 'Vedantu', type: 'Free/Paid', link: 'https://www.vedantu.com', description: 'Live classes and study materials' }
        ],
        exams: [
          { name: 'JEE Main', description: 'Gateway to NITs, IIITs, GFTIs', frequency: 'Twice a year' },
          { name: 'JEE Advanced', description: 'For IIT admissions', frequency: 'Once a year' },
          { name: 'BITSAT', description: 'For BITS Pilani admissions', frequency: 'Once a year' },
          { name: 'VITEEE', description: 'For VIT University', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'KVPY', amount: '₹5,000-10,000/month', eligibility: 'Science stream students' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Pragati Scholarship', amount: '₹30,000/year', eligibility: 'Girl students in engineering' }
        ]
      },
      bipc: {
        name: 'BiPC (Biology, Physics, Chemistry)',
        color: 'green',
        syllabus: [
          { subject: 'Biology', topics: ['Botany', 'Zoology', 'Genetics', 'Ecology', 'Biotechnology'] },
          { subject: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics'] },
          { subject: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Strong foundation in Biology, Physics, Chemistry' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'NEET preparation and advanced concepts' },
          { phase: 'Medical Entrance', duration: '6-12 months', focus: 'NEET UG, AIIMS, JIPMER preparation' },
          { phase: 'Medical Degree', duration: '5.5 years', focus: 'MBBS or BDS degree program' }
        ],
        opportunities: [
          { title: 'Medicine', description: 'MBBS, BDS, BAMS, BHMS degrees', salary: '₹6-25 LPA' },
          { title: 'Pharmacy', description: 'B.Pharm, M.Pharm programs', salary: '₹3-12 LPA' },
          { title: 'Biotechnology', description: 'B.Tech/M.Tech in Biotechnology', salary: '₹4-15 LPA' },
          { title: 'Research', description: 'M.Sc, PhD in Life Sciences', salary: '₹4-20 LPA' }
        ],
        resources: [
          { title: 'NCERT Biology', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Comprehensive biology textbook' },
          { title: 'Aakash Institute', type: 'Free/Paid', link: 'https://www.aakash.ac.in', description: 'NEET coaching materials' },
          { title: 'Allen Career Institute', type: 'Free/Paid', link: 'https://www.allen.ac.in', description: 'Medical entrance preparation' },
          { title: 'Unacademy', type: 'Free/Paid', link: 'https://unacademy.com', description: 'NEET specific courses' }
        ],
        exams: [
          { name: 'NEET UG', description: 'For MBBS/BDS admissions', frequency: 'Once a year' },
          { name: 'AIIMS MBBS', description: 'For AIIMS medical colleges', frequency: 'Once a year' },
          { name: 'JIPMER MBBS', description: 'For JIPMER Puducherry', frequency: 'Once a year' },
          { name: 'CET', description: 'State-level medical entrance exams', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Pragati Scholarship', amount: '₹30,000/year', eligibility: 'Girl students in medical courses' },
          { name: 'AICTE Pragati Saksham', amount: '₹50,000/year', eligibility: 'Girl students in technical courses' }
        ]
      },
      cec: {
        name: 'CEC (Civics, Economics, Commerce)',
        color: 'purple',
        syllabus: [
          { subject: 'Economics', topics: ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Statistics'] },
          { subject: 'Business Studies', topics: ['Business Environment', 'Management', 'Marketing', 'Finance'] },
          { subject: 'Accountancy', topics: ['Financial Accounting', 'Cost Accounting', 'Management Accounting'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Commerce basics and accounting principles' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced commerce and CA foundation prep' },
          { phase: 'Undergraduate', duration: '3 years', focus: 'B.Com, BBA, or CA foundation' },
          { phase: 'Professional', duration: '3-5 years', focus: 'CA, CS, MBA or specialized courses' }
        ],
        opportunities: [
          { title: 'Chartered Accountancy', description: 'CA qualification', salary: '₹5-20 LPA' },
          { title: 'Company Secretary', description: 'CS qualification', salary: '₹4-15 LPA' },
          { title: 'Business Administration', description: 'MBA, BBA programs', salary: '₹4-18 LPA' },
          { title: 'Finance', description: 'Banking, Investment, Financial Planning', salary: '₹3-15 LPA' }
        ],
        resources: [
          { title: 'NCERT Business Studies', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Commerce textbook' },
          { title: 'ICAI Materials', type: 'Free', link: 'https://www.icai.org', description: 'CA study materials' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Economics and finance basics' },
          { title: 'Commerce Adda', type: 'Free', link: 'https://www.commerceadda.com', description: 'Commerce exam preparation' }
        ],
        exams: [
          { name: 'CA Foundation', description: 'Entry level for CA course', frequency: 'Twice a year' },
          { name: 'CS Foundation', description: 'Entry level for CS course', frequency: 'Twice a year' },
          { name: 'CUET', description: 'For DU and other central universities', frequency: 'Once a year' },
          { name: 'IPMAT', description: 'For IIM Indore, Rohtak', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Merit-cum-Means', amount: '₹12,000/year', eligibility: 'Economically weaker students' },
          { name: 'Post Matric Scholarship', amount: '₹230-1,200/month', eligibility: 'SC/ST/OBC students' }
        ]
      },
      hec: {
        name: 'HEC (History, Economics, Civics)',
        color: 'orange',
        syllabus: [
          { subject: 'History', topics: ['Ancient History', 'Medieval History', 'Modern History', 'World History'] },
          { subject: 'Economics', topics: ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Statistics'] },
          { subject: 'Civics', topics: ['Political Science', 'Constitution', 'Governance', 'International Relations'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Build knowledge in History, Economics, Civics' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and competitive exam preparation' },
          { phase: 'Undergraduate', duration: '3 years', focus: 'BA in History, Economics, Political Science' },
          { phase: 'Higher Studies', duration: '2 years', focus: 'MA, MPhil, PhD in Humanities/Social Sciences' }
        ],
        opportunities: [
          { title: 'Civil Services', description: 'IAS, IPS, IFS through UPSC', salary: '₹5-15 LPA' },
          { title: 'Teaching', description: 'School/College teaching positions', salary: '₹3-8 LPA' },
          { title: 'Research', description: 'Research positions in think tanks', salary: '₹4-12 LPA' },
          { title: 'Journalism', description: 'Media and journalism careers', salary: '₹3-10 LPA' }
        ],
        resources: [
          { title: 'NCERT History', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'History textbooks' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Social sciences basics' },
          { title: 'Unacademy', type: 'Free/Paid', link: 'https://unacademy.com', description: 'UPSC preparation' },
          { title: 'BYJU\'S', type: 'Free/Paid', link: 'https://byjus.com', description: 'Comprehensive study materials' }
        ],
        exams: [
          { name: 'UPSC Civil Services', description: 'For IAS, IPS, IFS', frequency: 'Once a year' },
          { name: 'CUET', description: 'For central universities', frequency: 'Once a year' },
          { name: 'State PSC Exams', description: 'State civil services', frequency: 'Once a year' },
          { name: 'NET/JRF', description: 'For teaching/research positions', frequency: 'Twice a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Post Matric Scholarship', amount: '₹230-1,200/month', eligibility: 'SC/ST/OBC students' },
          { name: 'National Scholarship', amount: '₹1,000/month', eligibility: 'Meritorious students' }
        ]
      },
      mec: {
        name: 'MEC (Math, Economics, Commerce)',
        color: 'indigo',
        syllabus: [
          { subject: 'Mathematics', topics: ['Calculus', 'Statistics', 'Probability', 'Linear Algebra'] },
          { subject: 'Economics', topics: ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Statistics'] },
          { subject: 'Commerce', topics: ['Business Studies', 'Accountancy', 'Management', 'Finance'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Math, Economics, Commerce basics' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and entrance prep' },
          { phase: 'Undergraduate', duration: '3 years', focus: 'B.Com, BBA, BSc Economics' },
          { phase: 'Professional', duration: '2 years', focus: 'MBA, M.Com, CFA, or specialized courses' }
        ],
        opportunities: [
          { title: 'Investment Banking', description: 'Financial analysis and investment', salary: '₹6-20 LPA' },
          { title: 'Data Analytics', description: 'Business intelligence and analytics', salary: '₹4-15 LPA' },
          { title: 'Actuarial Science', description: 'Risk assessment and insurance', salary: '₹5-18 LPA' },
          { title: 'Business Consulting', description: 'Management consulting', salary: '₹5-16 LPA' }
        ],
        resources: [
          { title: 'NCERT Economics', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Economics textbook' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Math and Economics' },
          { title: 'Coursera', type: 'Free/Paid', link: 'https://www.coursera.org', description: 'Business and Finance courses' },
          { title: 'edX', type: 'Free/Paid', link: 'https://www.edx.org', description: 'Online learning platform' }
        ],
        exams: [
          { name: 'CUET', description: 'For central universities', frequency: 'Once a year' },
          { name: 'IPMAT', description: 'For IIM Indore, Rohtak', frequency: 'Once a year' },
          { name: 'NPAT', description: 'For NMIMS Mumbai', frequency: 'Once a year' },
          { name: 'SET', description: 'For Symbiosis institutes', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Merit-cum-Means', amount: '₹12,000/year', eligibility: 'Economically weaker students' },
          { name: 'Post Matric Scholarship', amount: '₹230-1,200/month', eligibility: 'SC/ST/OBC students' }
        ]
      },
      mbipc: {
        name: 'MBiPC (Math, Biology, Physics, Chemistry)',
        color: 'teal',
        syllabus: [
          { subject: 'Mathematics', topics: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'] },
          { subject: 'Biology', topics: ['Botany', 'Zoology', 'Genetics', 'Ecology', 'Biotechnology'] },
          { subject: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics'] },
          { subject: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Build strong foundation in Math, Biology, Physics, Chemistry' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and competitive exam preparation' },
          { phase: 'Entrance Exams', duration: '6-12 months', focus: 'NEET, JEE Main, or other relevant entrance exams' },
          { phase: 'Higher Education', duration: '4-5.5 years', focus: 'MBBS, B.Tech Biotechnology, or related degree programs' }
        ],
        opportunities: [
          { title: 'Medical Sciences', description: 'MBBS, BDS, BAMS, BHMS degrees', salary: '₹6-25 LPA' },
          { title: 'Biotechnology', description: 'B.Tech/M.Tech in Biotechnology', salary: '₹4-15 LPA' },
          { title: 'Bioinformatics', description: 'B.Tech/M.Tech in Bioinformatics', salary: '₹4-16 LPA' },
          { title: 'Research', description: 'M.Sc, PhD in Life Sciences', salary: '₹4-20 LPA' }
        ],
        resources: [
          { title: 'NCERT Books', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Official textbooks for all subjects' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Video tutorials for Math & Science' },
          { title: 'Aakash Institute', type: 'Free/Paid', link: 'https://www.aakash.ac.in', description: 'NEET preparation materials' },
          { title: 'Vedantu', type: 'Free/Paid', link: 'https://www.vedantu.com', description: 'Live classes for all subjects' }
        ],
        exams: [
          { name: 'NEET UG', description: 'For MBBS/BDS admissions', frequency: 'Once a year' },
          { name: 'JEE Main', description: 'For engineering admissions', frequency: 'Twice a year' },
          { name: 'CET', description: 'State-level medical entrance exams', frequency: 'Once a year' },
          { name: 'AIIMS MBBS', description: 'For AIIMS medical colleges', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Pragati Scholarship', amount: '₹30,000/year', eligibility: 'Girl students in medical courses' },
          { name: 'KVPY', amount: '₹5,000-10,000/month', eligibility: 'Science stream students' }
        ]
      },
      hpc: {
        name: 'HPC (History, Political Science, Civics)',
        color: 'amber',
        syllabus: [
          { subject: 'History', topics: ['Ancient History', 'Medieval History', 'Modern History', 'World History'] },
          { subject: 'Political Science', topics: ['Political Theory', 'Indian Constitution', 'International Relations', 'Public Administration'] },
          { subject: 'Civics', topics: ['Political Science', 'Constitution', 'Governance', 'International Relations'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Build knowledge in History, Political Science, Civics' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and competitive exam preparation' },
          { phase: 'Undergraduate', duration: '3 years', focus: 'BA in History, Political Science, Public Administration' },
          { phase: 'Higher Studies', duration: '2 years', focus: 'MA, MPhil, PhD in Social Sciences or Law' }
        ],
        opportunities: [
          { title: 'Civil Services', description: 'IAS, IPS, IFS through UPSC', salary: '₹5-15 LPA' },
          { title: 'Law', description: 'LLB, LLM degrees for legal careers', salary: '₹4-12 LPA' },
          { title: 'Public Administration', description: 'Government and administrative roles', salary: '₹4-10 LPA' },
          { title: 'Journalism', description: 'Media and journalism careers', salary: '₹3-10 LPA' }
        ],
        resources: [
          { title: 'NCERT History', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'History and Political Science textbooks' },
          { title: 'Unacademy', type: 'Free/Paid', link: 'https://unacademy.com', description: 'UPSC and competitive exam preparation' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Social sciences basics' },
          { title: 'BYJU\'S', type: 'Free/Paid', link: 'https://byjus.com', description: 'Comprehensive study materials' }
        ],
        exams: [
          { name: 'UPSC Civil Services', description: 'For IAS, IPS, IFS', frequency: 'Once a year' },
          { name: 'CLAT', description: 'For National Law Universities', frequency: 'Once a year' },
          { name: 'CUET', description: 'For central universities', frequency: 'Once a year' },
          { name: 'State PSC Exams', description: 'State civil services', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Post Matric Scholarship', amount: '₹230-1,200/month', eligibility: 'SC/ST/OBC students' },
          { name: 'National Scholarship', amount: '₹1,000/month', eligibility: 'Meritorious students' }
        ]
      },
      hpp: {
        name: 'HPP (History, Political Science, Psychology)',
        color: 'rose',
        syllabus: [
          { subject: 'History', topics: ['Ancient History', 'Medieval History', 'Modern History', 'World History'] },
          { subject: 'Political Science', topics: ['Political Theory', 'Indian Constitution', 'International Relations', 'Public Administration'] },
          { subject: 'Psychology', topics: ['General Psychology', 'Developmental Psychology', 'Social Psychology', 'Abnormal Psychology'] }
        ],
        roadmap: [
          { phase: 'Foundation (Class 11)', duration: '1 year', focus: 'Build knowledge in History, Political Science, Psychology' },
          { phase: 'Intermediate (Class 12)', duration: '1 year', focus: 'Advanced concepts and career exploration' },
          { phase: 'Undergraduate', duration: '3 years', focus: 'BA in Psychology, Sociology, Public Administration' },
          { phase: 'Higher Studies', duration: '2 years', focus: 'MA, MPhil in Psychology or Social Sciences' }
        ],
        opportunities: [
          { title: 'Clinical Psychology', description: 'Mental health counseling and therapy', salary: '₹4-12 LPA' },
          { title: 'Human Resources', description: 'HR management and organizational psychology', salary: '₹4-10 LPA' },
          { title: 'Social Work', description: 'Community development and social services', salary: '₹3-8 LPA' },
          { title: 'Research', description: 'Psychological research and academia', salary: '₹4-12 LPA' }
        ],
        resources: [
          { title: 'NCERT Psychology', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Psychology textbook' },
          { title: 'Coursera', type: 'Free/Paid', link: 'https://www.coursera.org', description: 'Psychology and social sciences courses' },
          { title: 'edX', type: 'Free/Paid', link: 'https://www.edx.org', description: 'Online learning platform' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Social sciences basics' }
        ],
        exams: [
          { name: 'CUET', description: 'For central universities', frequency: 'Once a year' },
          { name: 'TISSNET', description: 'For Tata Institute of Social Sciences', frequency: 'Once a year' },
          { name: 'IPU CET', description: 'For Guru Gobind Singh Indraprastha University', frequency: 'Once a year' },
          { name: 'State University Exams', description: 'Various state university entrance exams', frequency: 'Once a year' }
        ],
        scholarships: [
          { name: 'NTSE', amount: '₹1,250/month', eligibility: 'Class 10 students with 80%+ marks' },
          { name: 'INSPIRE Scholarship', amount: '₹80,000/year', eligibility: 'Top 1% in Class 12' },
          { name: 'Post Matric Scholarship', amount: '₹230-1,200/month', eligibility: 'SC/ST/OBC students' },
          { name: 'Psychology Research Grants', amount: 'Varies', eligibility: 'Research-oriented students' }
        ]
      },
      other: {
        name: 'Other Streams',
        color: 'gray',
        syllabus: [
          { subject: 'General Subjects', topics: ['Language', 'Arts', 'Vocational Skills', 'General Knowledge'] }
        ],
        roadmap: [
          { phase: 'Foundation', duration: '1 year', focus: 'Build foundation in chosen subjects' },
          { phase: 'Intermediate', duration: '1 year', focus: 'Advanced learning and skill development' },
          { phase: 'Higher Education', duration: '3-4 years', focus: 'Degree in chosen field' },
          { phase: 'Career Development', duration: 'Ongoing', focus: 'Skill enhancement and career growth' }
        ],
        opportunities: [
          { title: 'Various Fields', description: 'Depending on your interests and skills', salary: '₹2-10 LPA' }
        ],
        resources: [
          { title: 'NCERT Books', type: 'Free', link: 'https://ncert.nic.in/textbook.php', description: 'Standard textbooks' },
          { title: 'Coursera', type: 'Free/Paid', link: 'https://www.coursera.org', description: 'Various online courses' },
          { title: 'edX', type: 'Free/Paid', link: 'https://www.edx.org', description: 'Online learning platform' },
          { title: 'Khan Academy', type: 'Free', link: 'https://www.khanacademy.org', description: 'Free educational content' }
        ],
        exams: [
          { name: 'General Entrance', description: 'Various entrance exams', frequency: 'Varies' }
        ],
        scholarships: [
          { name: 'General Scholarships', amount: 'Varies', eligibility: 'Based on merit and need' }
        ]
      }
    };

    return streamData[stream as keyof typeof streamData] || streamData.mpc;
  };

  const streamData = getStreamData(selectedStream);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-700 dark:text-indigo-400',
        button: 'bg-indigo-600 hover:bg-indigo-700'
      },
      teal: {
        bg: 'bg-teal-50 dark:bg-teal-950/20',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-700 dark:text-teal-400',
        button: 'bg-teal-600 hover:bg-teal-700'
      },
      amber: {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-400',
        button: 'bg-amber-600 hover:bg-amber-700'
      },
      rose: {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        border: 'border-rose-200 dark:border-rose-800',
        text: 'text-rose-700 dark:text-rose-400',
        button: 'bg-rose-600 hover:bg-rose-700'
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-950/20',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-700 dark:text-gray-400',
        button: 'bg-gray-600 hover:bg-gray-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const colors = getColorClasses(streamData.color);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold mb-2">{streamData.name} Study Guide</h2>
        <p className="text-muted-foreground">
          Comprehensive resources and guidance for your {streamData.name} journey
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="syllabus" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Syllabus</span>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Roadmap</span>
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Opportunities</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Exams</span>
          </TabsTrigger>
          <TabsTrigger value="scholarships" className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Scholarships</span>
          </TabsTrigger>
        </TabsList>

        {/* Syllabus Tab */}
        <TabsContent value="syllabus" className="mt-6">
          <div className="grid gap-4">
            {streamData.syllabus.map((subject, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
                    <BookOpen className="w-5 h-5" />
                    {subject.subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="mt-6">
          <div className="space-y-4">
            {streamData.roadmap.map((phase, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${colors.button} text-white flex items-center justify-center font-bold text-lg`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{phase.phase}</h3>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {phase.duration}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{phase.focus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="mt-6">
          <div className="grid gap-4">
            {streamData.opportunities.map((opportunity, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{opportunity.title}</h3>
                      <p className="text-muted-foreground mb-3">{opportunity.description}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">{opportunity.salary}</span>
                      </div>
                    </div>
                    <Button
                      className={`${colors.button} text-white`}
                      onClick={() => {
                        const careerLinks = {
                          'Engineering': 'https://www.jeeadv.ac.in/',
                          'Architecture': 'https://www.nata.in/',
                          'Pure Sciences': 'https://www.iisc.ac.in/',
                          'Research': 'https://www.science.org/',
                          'Medicine': 'https://www.mciindia.org/',
                          'Pharmacy': 'https://www.pci.nic.in/',
                          'Biotechnology': 'https://www.dbtindia.gov.in/',
                          'Chartered Accountancy': 'https://www.icai.org/',
                          'Company Secretary': 'https://www.icsi.edu/',
                          'Business Administration': 'https://www.cat.ac.in/',
                          'Finance': 'https://www.nism.ac.in/',
                          'Civil Services': 'https://www.upsc.gov.in/',
                          'Teaching': 'https://www.cbse.gov.in/',
                          'Social Research': 'https://www.icssr.org/',
                          'Journalism': 'https://www.pib.gov.in/',
                          'Investment Banking': 'https://www.sebi.gov.in/',
                          'Data Analytics': 'https://www.nasscom.in/',
                          'Actuarial Science': 'https://www.actuariesindia.org/',
                          'Business Consulting': 'https://www.bcg.com/',
                          'Various Fields': 'https://www.careers360.com/'
                        };
                        window.open(careerLinks[opportunity.title as keyof typeof careerLinks] || 'https://www.careers360.com/', '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <div className="grid gap-4">
            {streamData.resources.map((resource, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground mb-3">{resource.description}</p>
                      <Badge variant={resource.type === 'Free' ? 'default' : 'secondary'}>
                        {resource.type}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => window.open(resource.link, '_blank')}
                    >
                      {resource.type === 'Free' ? (
                        <Download className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="mt-6">
          <div className="grid gap-4">
            {streamData.exams.map((exam, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{exam.name}</h3>
                      <p className="text-muted-foreground mb-3">{exam.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">{exam.frequency}</span>
                      </div>
                    </div>
                    <Button
                      className={`${colors.button} text-white`}
                      onClick={() => {
                        const examLinks = {
                          'JEE Main': 'https://jeemain.nta.nic.in/',
                          'JEE Advanced': 'https://jeeadv.ac.in/',
                          'BITSAT': 'https://www.bitsadmission.com/',
                          'VITEEE': 'https://www.vit.ac.in/',
                          'NEET UG': 'https://neet.nta.nic.in/',
                          'AIIMS MBBS': 'https://www.aiimsexams.org/',
                          'JIPMER MBBS': 'https://www.jipmer.edu.in/',
                          'CET': 'https://cetonline.karnataka.gov.in/',
                          'CA Foundation': 'https://www.icai.org/',
                          'CS Foundation': 'https://www.icsi.edu/',
                          'CUET': 'https://cuet.nta.nic.in/',
                          'IPMAT': 'https://www.ipmat.iimidr.ac.in/',
                          'UPSC Civil Services': 'https://www.upsc.gov.in/',
                          'State PSC Exams': 'https://www.upsc.gov.in/',
                          'NET/JRF': 'https://www.ugc.ac.in/',
                          'NPAT': 'https://www.nmims.edu/',
                          'SET': 'https://www.set-test.org/',
                          'General Entrance': 'https://www.nta.ac.in/'
                        };
                        window.open(examLinks[exam.name as keyof typeof examLinks] || 'https://www.nta.ac.in/', '_blank');
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Prepare
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scholarships Tab */}
        <TabsContent value="scholarships" className="mt-6">
          <div className="grid gap-4">
            {streamData.scholarships.map((scholarship, index) => (
              <Card key={index} className={`${colors.bg} ${colors.border} border`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{scholarship.name}</h3>
                      <p className="text-muted-foreground mb-3">{scholarship.eligibility}</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-600">{scholarship.amount}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        const scholarshipLinks = {
                          'NTSE': 'https://ncert.nic.in/national-talent-examination.php',
                          'KVPY': 'https://www.kvpy.iisc.ernet.in/',
                          'INSPIRE Scholarship': 'https://www.online-inspire.gov.in/',
                          'Pragati Scholarship': 'https://www.aicte-india.org/pragati',
                          'AICTE Pragati Saksham': 'https://www.aicte-india.org/pragati',
                          'Merit-cum-Means': 'https://scholarships.gov.in/',
                          'Post Matric Scholarship': 'https://scholarships.gov.in/',
                          'National Scholarship': 'https://scholarships.gov.in/',
                          'General Scholarships': 'https://scholarships.gov.in/'
                        };
                        window.open(scholarshipLinks[scholarship.name as keyof typeof scholarshipLinks] || 'https://scholarships.gov.in/', '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};