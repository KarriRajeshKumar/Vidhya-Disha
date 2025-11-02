import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  ExternalLink,
  LogOut,
  AlertTriangle,
  Trash2,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sendApprovalEmail, sendRejectionEmail } from "@/services/emailService";

interface PendingSubmission {
  id: string;
  type: 'aiTool' | 'job' | 'internship' | 'scholarship' | 'document';
  title: string;
  description: string;
  contributorName: string;
  contributorEmail: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  data: any; // Full submission data
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<PendingSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'aiTool' | 'job' | 'internship' | 'scholarship' | 'document'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAdminAuthenticated) {
      toast.error('Access denied. Please login as admin.');
      navigate('/admin-login');
      return;
    }
    
    // Load submissions
    loadSubmissions();
  }, [navigate]);

  // Filter submissions based on search and filters
  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.contributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.contributorEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(submission => submission.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(submission => submission.type === filterType);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, filterStatus, filterType]);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage (in production, this would be from a database)
      const storedSubmissions = localStorage.getItem('pendingSubmissions');
      if (storedSubmissions) {
        const parsed = JSON.parse(storedSubmissions);
        setSubmissions(parsed);
      } else {
        // Initialize with some mock data for demonstration
        const mockSubmissions: PendingSubmission[] = [
          {
            id: 'sub-1',
            type: 'aiTool',
            title: 'ChatGPT Plus',
            description: 'Advanced AI assistant with GPT-4 capabilities for coding and writing',
            contributorName: 'John Doe',
            contributorEmail: 'john.doe@example.com',
            timestamp: new Date().toISOString(),
            status: 'pending',
            data: {
              website: 'https://chat.openai.com',
              category: 'text',
              pricing: 'subscription'
            }
          },
          {
            id: 'sub-2',
            type: 'job',
            title: 'React Developer',
            description: 'Frontend developer position at a growing startup',
            contributorName: 'Jane Smith',
            contributorEmail: 'jane.smith@example.com',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending',
            data: {
              company: 'TechStart Inc',
              location: 'Remote',
              salary: '$80,000 - $120,000',
              applicationLink: 'https://techstart.com/careers'
            }
          }
        ];
        setSubmissions(mockSubmissions);
        localStorage.setItem('pendingSubmissions', JSON.stringify(mockSubmissions));
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      console.log('🔄 Starting approval process for:', submission.title);

      // Show loading state
      toast.loading(`Approving ${submission.title}...`, { id: submissionId });

      // Update submission status
      const updatedSubmissions = submissions.map(s =>
        s.id === submissionId ? { ...s, status: 'approved' as const } : s
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Move to verified collection (simulate database operation)
      const verifiedSubmissions = JSON.parse(localStorage.getItem('verifiedSubmissions') || '[]');
      const approvedSubmission = { ...submission, status: 'approved', approvedAt: new Date().toISOString() };
      verifiedSubmissions.unshift(approvedSubmission);
      localStorage.setItem('verifiedSubmissions', JSON.stringify(verifiedSubmissions));

      // Send approval email with loading feedback
      console.log('📧 Sending approval email...');
      const emailSent = await sendApprovalEmailToUser(submission);
      
      if (emailSent) {
        console.log('✅ Approval email sent successfully');
      } else {
        console.log('⚠️ Approval email failed to send');
      }

      // Update log file
      updateLogFile(submission, 'approved');

      // Trigger real-time update for community hub
      triggerCommunityHubUpdate(approvedSubmission, 'approved');

      // Send user notification about approval
      sendUserNotification(submission, 'approved');

      // Success feedback
      toast.success(`✅ ${submission.title} approved and published! ${emailSent ? 'Email sent.' : 'Email failed.'}`, { 
        id: submissionId,
        duration: 4000 
      });

      console.log('✅ Approval process completed for:', submission.title);
    } catch (error) {
      console.error('❌ Error approving submission:', error);
      toast.error('Failed to approve submission', { id: submissionId });
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      console.log('🔄 Starting rejection process for:', submission.title);

      // Show loading state
      toast.loading(`Rejecting ${submission.title}...`, { id: submissionId });

      // Update submission status
      const updatedSubmissions = submissions.map(s =>
        s.id === submissionId ? { ...s, status: 'rejected' as const } : s
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Remove from pending and don't add to verified (simulate database deletion)
      console.log('🗑️ Removing from database...');

      // Send rejection email with loading feedback
      console.log('📧 Sending rejection email...');
      const emailSent = await sendRejectionEmailToUser(submission);
      
      if (emailSent) {
        console.log('✅ Rejection email sent successfully');
      } else {
        console.log('⚠️ Rejection email failed to send');
      }

      // Update log file
      updateLogFile(submission, 'rejected');

      // Trigger real-time update for community hub (removal)
      triggerCommunityHubUpdate(submission, 'rejected');

      // Send user notification about rejection
      sendUserNotification(submission, 'rejected');

      // Success feedback
      toast.success(`❌ ${submission.title} rejected and removed. ${emailSent ? 'Warning email sent.' : 'Email failed.'}`, { 
        id: submissionId,
        duration: 4000 
      });

      console.log('✅ Rejection process completed for:', submission.title);
    } catch (error) {
      console.error('❌ Error rejecting submission:', error);
      toast.error('Failed to reject submission', { id: submissionId });
    }
  };

  const handleRemove = async (submissionId: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      console.log('🗑️ Starting removal process for approved item:', submission.title);

      // Show loading state
      toast.loading(`Removing ${submission.title}...`, { id: submissionId });

      // Remove from submissions list
      const updatedSubmissions = submissions.filter(s => s.id !== submissionId);
      setSubmissions(updatedSubmissions);
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Remove from approved community items
      const approvedItems = JSON.parse(localStorage.getItem('approvedCommunityItems') || '[]');
      const filteredApprovedItems = approvedItems.filter((item: any) => 
        !(item.title === submission.title && item.type === submission.type)
      );
      localStorage.setItem('approvedCommunityItems', JSON.stringify(filteredApprovedItems));

      // Update log file
      updateLogFile(submission, 'removed');

      // Trigger real-time update for community hub (removal)
      const updateEvent = new CustomEvent('adminAction', {
        detail: {
          submission,
          action: 'removed',
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(updateEvent);

      // Send user notification about removal
      sendUserNotification(submission, 'removed');

      // Success feedback
      toast.success(`🗑️ ${submission.title} removed from community hub successfully!`, { 
        id: submissionId,
        duration: 4000 
      });

      console.log('✅ Removal process completed for:', submission.title);
    } catch (error) {
      console.error('❌ Error removing submission:', error);
      toast.error('Failed to remove submission', { id: submissionId });
    }
  };

  const sendApprovalEmailToUser = async (submission: PendingSubmission) => {
    const emailData = {
      to: submission.contributorEmail,
      subject: 'Your submission has been approved!',
      message: 'Thanks for sharing the resource. Let\'s grow together.',
      contributorName: submission.contributorName,
      resourceTitle: submission.title
    };
    
    const success = await sendApprovalEmail(emailData);
    if (!success) {
      console.error('Failed to send approval email');
    }
  };

  const sendRejectionEmailToUser = async (submission: PendingSubmission) => {
    const emailData = {
      to: submission.contributorEmail,
      subject: 'Submission Review Update',
      message: 'If this ever happens again, you will lose access to the website.',
      contributorName: submission.contributorName,
      resourceTitle: submission.title
    };
    
    const success = await sendRejectionEmail(emailData);
    if (!success) {
      console.error('Failed to send rejection email');
    }
  };

  const updateLogFile = (submission: PendingSubmission, action: 'approved' | 'rejected' | 'removed') => {
    // Enhanced log file update with more details
    const logEntry = `
[${new Date().toISOString()}] ${action.toUpperCase()}
Title: ${submission.title}
Type: ${submission.type}
Contributor: ${submission.contributorName} (${submission.contributorEmail})
Action: ${action}
Admin: ${localStorage.getItem('adminEmail') || 'Unknown'}
Timestamp: ${new Date().toLocaleString()}
${action === 'removed' ? 'Note: Previously approved item removed from community hub' : ''}
---`;
    
    console.log('📝 Log file updated:', logEntry);
    
    // Store in localStorage for development (in production, write to .tex/.txt file)
    const existingLogs = localStorage.getItem('adminActionLogs') || '';
    localStorage.setItem('adminActionLogs', existingLogs + logEntry);
  };

  // Real-time update trigger for Community Hub
  const triggerCommunityHubUpdate = (submission: PendingSubmission, action: 'approved' | 'rejected') => {
    console.log('🔄 Triggering real-time update for Community Hub...');
    
    // Create custom event for real-time updates
    const updateEvent = new CustomEvent('adminAction', {
      detail: {
        submission,
        action,
        timestamp: new Date().toISOString()
      }
    });
    
    // Dispatch event for other components to listen
    window.dispatchEvent(updateEvent);
    
    // Update localStorage for immediate sync
    if (action === 'approved') {
      // Add to approved items that should appear in Community Hub
      const approvedItems = JSON.parse(localStorage.getItem('approvedCommunityItems') || '[]');
      
      // Transform submission data to match community hub format
      const approvedItem = {
        id: `approved-${submission.id}`,
        type: submission.type,
        title: submission.title,
        description: submission.description,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        createdAt: submission.timestamp,
        ...submission.data // Include all the original form data
      };
      
      approvedItems.unshift(approvedItem);
      localStorage.setItem('approvedCommunityItems', JSON.stringify(approvedItems));
      console.log('✅ Added to approved community items:', approvedItem.title);
    } else {
      // Remove from any community displays
      console.log('🗑️ Removed from community displays');
    }
  };

  // Send notification to user about admin action
  const sendUserNotification = (submission: PendingSubmission, action: 'approved' | 'rejected' | 'removed') => {
    console.log('🔔 Sending user notification...');
    
    // We'll use the contributor email to identify the user
    // In a real system, you'd have a proper user ID mapping
    const userId = submission.contributorEmail.replace('@', '_').replace('.', '_');
    
    let notification;
    
    switch (action) {
      case 'approved':
        notification = {
          id: `admin-action-${Date.now()}`,
          title: 'Submission Approved! 🎉',
          message: `Your submission "${submission.title}" has been approved and is now live on the community hub!`,
          type: 'success',
          read: false,
          created_at: new Date().toISOString()
        };
        break;
      case 'rejected':
        notification = {
          id: `admin-action-${Date.now()}`,
          title: 'Submission Rejected',
          message: `Your submission "${submission.title}" was not approved. Please review our community guidelines and try again.`,
          type: 'warning',
          read: false,
          created_at: new Date().toISOString()
        };
        break;
      case 'removed':
        notification = {
          id: `admin-action-${Date.now()}`,
          title: 'Content Removed 🗑️',
          message: `Your previously approved submission "${submission.title}" has been removed from the community hub by an administrator.`,
          type: 'warning',
          read: false,
          created_at: new Date().toISOString()
        };
        break;
      default:
        return;
    }

    // Add to user's notifications in localStorage
    const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    userNotifications.unshift(notification);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(userNotifications));
    
    console.log('✅ User notification sent:', notification.title);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aiTool': return '🧠';
      case 'job': return '💼';
      case 'internship': return '🎓';
      case 'scholarship': return '🏅';
      case 'document': return '📄';
      default: return '📝';
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E88E5]/30 border-t-[#1E88E5] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1E88E5] font-['Poppins']">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FF]">
      {/* Header */}
      <div className="bg-white border-b border-[#1E88E5]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1E88E5] to-[#FFB74D] rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1E88E5] font-['Montserrat'] flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 font-['Poppins']">
                  Community Verification & Management System
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#1E88E5]/30 text-[#1E88E5] hover:bg-[#1E88E5]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-[#1E88E5]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Poppins']">Total Submissions</p>
                  <p className="text-3xl font-bold text-[#1E88E5] font-['Montserrat']">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#1E88E5]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Poppins']">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600 font-['Montserrat']">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Poppins']">Approved</p>
                  <p className="text-3xl font-bold text-green-600 font-['Montserrat']">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-['Poppins']">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 font-['Montserrat']">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-[#1E88E5]/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#1E88E5]/30 focus:border-[#1E88E5]"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-[#1E88E5]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 font-['Poppins']"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-[#1E88E5]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 font-['Poppins']"
              >
                <option value="all">All Types</option>
                <option value="aiTool">AI Tools</option>
                <option value="job">Jobs</option>
                <option value="internship">Internships</option>
                <option value="scholarship">Scholarships</option>
                <option value="document">Documents</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white border-[#1E88E5]/20">
              <CardContent className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 font-['Montserrat'] mb-2">
                  No submissions found
                </h3>
                <p className="text-gray-500 font-['Poppins']">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No community submissions yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-[#1E88E5]/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getTypeIcon(submission.type)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-[#1E88E5] font-['Montserrat'] mb-2">
                            {submission.title}
                          </h3>
                          <p className="text-gray-600 font-['Poppins'] mb-3">
                            {submission.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{submission.contributorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{submission.contributorEmail}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(submission.status)} font-['Poppins']`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Additional Data */}
                    {submission.data && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-700 font-['Poppins'] mb-2">Additional Details:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="text-gray-800 font-medium">
                                {key.includes('Link') || key.includes('website') ? (
                                  <a 
                                    href={value as string} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#1E88E5] hover:underline flex items-center gap-1"
                                  >
                                    Link <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  value as string
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {submission.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(submission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-['Poppins'] transition-all duration-200 hover:scale-105"
                          disabled={isLoading}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Publish
                        </Button>
                        <Button
                          onClick={() => handleReject(submission.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 font-['Poppins'] transition-all duration-200 hover:scale-105"
                          disabled={isLoading}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject & Remove
                        </Button>
                      </div>
                    )}

                    {/* Status Display and Actions for Processed Items */}
                    {submission.status !== 'pending' && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          {submission.status === 'approved' ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">Approved & Published</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="w-5 h-5" />
                              <span className="font-semibold">Rejected & Removed</span>
                            </div>
                          )}
                        </div>

                        {/* Additional Actions for Approved Items */}
                        {submission.status === 'approved' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRemove(submission.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50 font-['Poppins'] transition-all duration-200 hover:scale-105"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove from Hub
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}