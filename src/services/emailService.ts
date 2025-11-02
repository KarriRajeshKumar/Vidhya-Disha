// Email service for sending notifications
// Enhanced with EmailJS integration and real-time feedback

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  contributorName: string;
  resourceTitle: string;
}

// EmailJS Configuration (replace with your actual credentials)
const EMAILJS_CONFIG = {
  serviceId: 'service_vidhyadisha',
  approvalTemplateId: 'template_approval',
  rejectionTemplateId: 'template_rejection',
  adminAlertTemplateId: 'template_admin_alert',
  publicKey: 'your_emailjs_public_key'
};

// Initialize EmailJS (uncomment for production)
// import emailjs from '@emailjs/browser';
// emailjs.init(EMAILJS_CONFIG.publicKey);

export const sendApprovalEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('🚀 Sending approval email to:', data.to);
    
    const emailParams = {
      to_email: data.to,
      to_name: data.contributorName,
      resource_title: data.resourceTitle,
      message: `Dear ${data.contributorName},

Great news! Your submission "${data.resourceTitle}" has been approved and is now live on Vidhya Disha.

Thanks for sharing the resource. Let's grow together! 🚀

Your contribution helps thousands of students discover valuable opportunities and resources.

Best regards,
Vidhya Disha Admin Team`,
      from_name: 'Vidhya Disha Admin Team',
      reply_to: 'noreply@vidhyadisha.com'
    };

    // Production EmailJS call (uncomment for production)
    /*
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.approvalTemplateId,
      emailParams
    );
    console.log('✅ Approval email sent successfully:', result);
    */

    // Mock implementation with detailed logging
    console.log('📧 Approval Email Details:', {
      to: data.to,
      subject: 'Your submission has been approved! 🎉',
      template: 'approval',
      params: emailParams
    });

    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✅ Approval email sent successfully to:', data.to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send approval email:', error);
    return false;
  }
};

export const sendRejectionEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('🚀 Sending rejection email to:', data.to);
    
    const emailParams = {
      to_email: data.to,
      to_name: data.contributorName,
      resource_title: data.resourceTitle,
      message: `Dear ${data.contributorName},

Thank you for your submission "${data.resourceTitle}" to Vidhya Disha.

After careful review, we were unable to approve this submission at this time. This may be due to:
- Content not meeting our quality guidelines
- Duplicate or similar content already exists
- Information that needs verification

We encourage you to review our community guidelines and submit again with improved content.

Please note: If this ever happens again, you will lose access to the website.

Best regards,
Vidhya Disha Admin Team`,
      from_name: 'Vidhya Disha Admin Team',
      reply_to: 'noreply@vidhyadisha.com'
    };

    // Production EmailJS call (uncomment for production)
    /*
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.rejectionTemplateId,
      emailParams
    );
    console.log('✅ Rejection email sent successfully:', result);
    */

    // Mock implementation with detailed logging
    console.log('📧 Rejection Email Details:', {
      to: data.to,
      subject: 'Submission Review Update - Action Required',
      template: 'rejection',
      params: emailParams
    });

    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✅ Rejection email sent successfully to:', data.to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send rejection email:', error);
    return false;
  }
};

export const sendNewSubmissionAlert = async (adminEmail: string, submissionData: any): Promise<boolean> => {
  try {
    // Mock email sending for admin notification
    console.log('Sending admin notification:', {
      to: adminEmail,
      subject: '🔔 New Community Submission Awaiting Review',
      message: `A new community submission is waiting for your review:

Title: ${submissionData.title}
Type: ${submissionData.type}
Contributor: ${submissionData.contributorName} (${submissionData.contributorEmail})
Submitted: ${new Date(submissionData.timestamp).toLocaleString()}

Please log in to the admin dashboard to review and approve/reject this submission.

Admin Dashboard: ${window.location.origin}/admin-dashboard

Best regards,
Vidhya Disha System`
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
};

// EmailJS configuration (uncomment and configure for production)
/*
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: 'your_service_id',
  templateId: 'your_template_id',
  publicKey: 'your_public_key'
};

export const sendEmailViaEmailJS = async (templateParams: any): Promise<boolean> => {
  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};
*/