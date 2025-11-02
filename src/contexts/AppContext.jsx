import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { profile } = useProfile();
  const [aiTools, setAiTools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from localStorage (approved items from admin system)
  const fetchUpdates = async () => {
    try {
      console.log('🔄 Fetching approved community items...');
      
      // Get approved items from admin system
      const approvedItems = JSON.parse(localStorage.getItem('approvedCommunityItems') || '[]');
      console.log('📊 Found approved items:', approvedItems.length);

      // Separate by category
      const approvedAiTools = approvedItems.filter(item => item.type === 'aiTool');
      const approvedJobs = approvedItems.filter(item => item.type === 'job');
      const approvedInternships = approvedItems.filter(item => item.type === 'internship');
      const approvedScholarships = approvedItems.filter(item => item.type === 'scholarship');

      // Update state with approved items
      setAiTools(approvedAiTools);
      setJobs(approvedJobs);
      setInternships(approvedInternships);
      setScholarships(approvedScholarships);

      console.log('✅ Community data loaded:', {
        aiTools: approvedAiTools.length,
        jobs: approvedJobs.length,
        internships: approvedInternships.length,
        scholarships: approvedScholarships.length
      });
    } catch (error) {
      console.error('❌ Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications (localStorage-based)
  const fetchNotifications = async () => {
    try {
      console.log('🔔 Loading notifications...');
      
      // Get user-specific notifications from localStorage
      const userNotifications = JSON.parse(localStorage.getItem(`notifications_${profile?.user_id || 'guest'}`) || '[]');
      
      // Get static notifications
      const staticNotifications = getStaticNotifications();
      
      // Combine notifications
      const allNotifications = [...userNotifications, ...staticNotifications];
      setNotifications(allNotifications);
      
      console.log('✅ Notifications loaded:', allNotifications.length);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Fallback to static notifications only
      const staticNotifications = getStaticNotifications();
      setNotifications(staticNotifications);
    }
  };

  // Static notifications for colleges, GATE, and NEAT exams
  const getStaticNotifications = () => {
    return [
      {
        id: 'college-admissions-2025',
        title: 'College Admissions 2025',
        message: 'Applications are now open for undergraduate admissions in various government colleges across Jammu & Kashmir. Last date to apply: December 31, 2025.',
        read: false,
        created_at: new Date('2025-09-15').toISOString(),
        type: 'college'
      },
      {
        id: 'gate-exam-2026',
        title: 'GATE 2026 Registration Open',
        message: 'Graduate Aptitude Test in Engineering (GATE) 2026 registration has started. Exam dates: February 7-8, 2026 and February 14-15, 2026.',
        read: false,
        created_at: new Date('2025-09-10').toISOString(),
        type: 'exam'
      },
      {
        id: 'neat-exam-2025',
        title: 'NEAT 2025 Results',
        message: 'National Eligibility cum Entrance Test (NEAT) 2025 results have been declared. Check your results on the official website.',
        read: false,
        created_at: new Date('2025-09-05').toISOString(),
        type: 'exam'
      },
      {
        id: 'jk-govt-colleges-info-2025',
        title: 'Government Colleges in J&K 2025',
        message: '148 government colleges are now available on our platform. Explore college details, courses, and admission information for 2025.',
        read: false,
        created_at: new Date('2025-08-20').toISOString(),
        type: 'college'
      },
      {
        id: 'scholarship-opportunities-2025',
        title: 'Scholarship Opportunities 2025',
        message: 'Multiple scholarship programs are available for meritorious students in 2025. Apply before the deadline approaches.',
        read: false,
        created_at: new Date('2025-08-15').toISOString(),
        type: 'scholarship'
      },
      {
        id: 'ai-career-workshop-2025',
        title: 'AI Career Development Workshop 2025',
        message: 'Join our free AI career workshop on December 15, 2025. Learn about AI job opportunities and skill development.',
        read: false,
        created_at: new Date('2025-11-01').toISOString(),
        type: 'exam'
      },
      {
        id: 'internship-drive-2025',
        title: 'Tech Internship Drive 2025',
        message: 'Major tech companies are conducting internship drives. Register now for opportunities at Google, Microsoft, and Amazon.',
        read: false,
        created_at: new Date('2025-10-15').toISOString(),
        type: 'exam'
      }
    ];
  };

  // Load data on mount and when profile changes
  useEffect(() => {
    fetchUpdates();
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [profile?.user_id]);

  // Listen for admin actions to update data in real-time
  useEffect(() => {
    const handleAdminAction = (event) => {
      console.log('🔄 AppContext received admin action:', event.detail);
      // Refresh data when admin approves/rejects items
      fetchUpdates();
      
      // Add notification for user about their submission
      if (event.detail.action === 'approved') {
        addUserNotification({
          title: 'Submission Approved! 🎉',
          message: `Your submission "${event.detail.submission.title}" has been approved and is now live!`,
          type: 'success'
        });
      } else if (event.detail.action === 'rejected') {
        addUserNotification({
          title: 'Submission Rejected',
          message: `Your submission "${event.detail.submission.title}" was not approved. Please review our guidelines.`,
          type: 'warning'
        });
      }
    };

    window.addEventListener('adminAction', handleAdminAction);
    
    return () => {
      window.removeEventListener('adminAction', handleAdminAction);
    };
  }, [profile?.user_id]);

  // Poll for updates every 30 seconds (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUpdates();
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addEntry = async (category, entry) => {
    console.log('📝 Adding entry to pending submissions for admin review...');
    
    // This function now adds entries to pending submissions for admin review
    // It no longer directly adds to the community hub
    const userId = profile?.user_id || 'guest-user';
    
    const newSubmission = {
      id: `sub-${category}-${Date.now()}`,
      type: category,
      title: entry.title || entry.name || 'Untitled',
      description: entry.description || 'No description provided',
      contributorName: profile?.display_name || 'Anonymous User',
      contributorEmail: profile?.email || 'unknown@example.com',
      timestamp: new Date().toISOString(),
      status: 'pending',
      data: entry
    };

    try {
      // Add to pending submissions for admin review
      const existingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
      const updatedSubmissions = [newSubmission, ...existingSubmissions];
      localStorage.setItem('pendingSubmissions', JSON.stringify(updatedSubmissions));

      // Add notification for user
      addUserNotification({
        title: 'Submission Received! 📝',
        message: `Your ${category} submission "${newSubmission.title}" is now under admin review.`,
        type: 'info'
      });

      console.log('✅ Entry added to pending submissions:', newSubmission.title);
      return true;
    } catch (error) {
      console.error('❌ Error adding entry:', error);
      return false;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      // Update localStorage
      const userId = profile?.user_id || 'guest';
      const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
      const updatedNotifications = userNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
      
      console.log('✅ Notification marked as read:', notificationId);
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  // Add user notification (for admin actions)
  const addUserNotification = (notification) => {
    const userId = profile?.user_id || 'guest';
    const newNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      read: false,
      created_at: new Date().toISOString()
    };

    // Add to state
    setNotifications(prev => [newNotification, ...prev]);

    // Save to localStorage
    const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    userNotifications.unshift(newNotification);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(userNotifications));

    console.log('✅ User notification added:', newNotification.title);
  };

  const getCategoryData = (category) => {
    switch (category) {
      case 'aiTools':
        return aiTools;
      case 'jobs':
        return jobs;
      case 'internships':
        return internships;
      case 'scholarships':
        return scholarships;
      default:
        return [];
    }
  };

  const getCategoryCount = (category) => {
    return getCategoryData(category).length;
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const value = {
    aiTools,
    jobs,
    internships,
    scholarships,
    notifications,
    loading,
    addEntry,
    getCategoryData,
    getCategoryCount,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    addUserNotification,
    refreshData: fetchUpdates
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};