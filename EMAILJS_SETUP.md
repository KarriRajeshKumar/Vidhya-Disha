# 📧 EmailJS Setup Instructions for Admin Verification System

## Overview
This guide will help you set up EmailJS to send real emails for admin approval/rejection notifications.

## 🚀 Quick Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the setup wizard to connect your email account
5. Note down your **Service ID** (e.g., `service_vidhyadisha`)

### 3. Create Email Templates

#### Approval Template
1. Go to **Email Templates** → **Create New Template**
2. **Template ID**: `template_approval`
3. **Template Content**:
```html
Subject: Your submission has been approved! 🎉

Dear {{to_name}},

Great news! Your submission "{{resource_title}}" has been approved and is now live on Vidhya Disha.

Thanks for sharing the resource. Let's grow together! 🚀

Your contribution helps thousands of students discover valuable opportunities and resources.

Best regards,
{{from_name}}

---
This is an automated message. Please do not reply to this email.
```

#### Rejection Template
1. Create another template with **Template ID**: `template_rejection`
2. **Template Content**:
```html
Subject: Submission Review Update - Action Required

Dear {{to_name}},

Thank you for your submission "{{resource_title}}" to Vidhya Disha.

After careful review, we were unable to approve this submission at this time. This may be due to:
- Content not meeting our quality guidelines
- Duplicate or similar content already exists
- Information that needs verification

We encourage you to review our community guidelines and submit again with improved content.

Please note: If this ever happens again, you will lose access to the website.

Best regards,
{{from_name}}

---
This is an automated message. Please do not reply to this email.
```

### 4. Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `your_emailjs_public_key`)

### 5. Update Configuration
Replace the placeholder values in `src/services/emailService.ts`:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'your_actual_service_id',        // Replace with your Service ID
  approvalTemplateId: 'template_approval',    // Your approval template ID
  rejectionTemplateId: 'template_rejection',  // Your rejection template ID
  adminAlertTemplateId: 'template_admin_alert', // Optional: admin notification template
  publicKey: 'your_actual_public_key'         // Replace with your Public Key
};
```

### 6. Install EmailJS Package
```bash
npm install @emailjs/browser
```

### 7. Enable Production Code
In `src/services/emailService.ts`, uncomment these lines:

```typescript
// Uncomment these lines:
import emailjs from '@emailjs/browser';
emailjs.init(EMAILJS_CONFIG.publicKey);

// And uncomment the actual EmailJS calls in sendApprovalEmail and sendRejectionEmail functions
```

## 🔧 Configuration Example

### Complete emailService.ts Configuration
```typescript
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: 'service_abc123',
  approvalTemplateId: 'template_approval',
  rejectionTemplateId: 'template_rejection',
  publicKey: 'xyz789_your_public_key'
};

emailjs.init(EMAILJS_CONFIG.publicKey);

export const sendApprovalEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.approvalTemplateId,
      {
        to_email: data.to,
        to_name: data.contributorName,
        resource_title: data.resourceTitle,
        from_name: 'Vidhya Disha Admin Team',
        reply_to: 'noreply@vidhyadisha.com'
      }
    );
    
    console.log('✅ Approval email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Failed to send approval email:', error);
    return false;
  }
};
```

## 🧪 Testing

### Test Email Sending
1. Go to admin dashboard
2. Approve or reject a test submission
3. Check the recipient's email inbox
4. Verify email content and formatting

### Debug Issues
- Check browser console for EmailJS errors
- Verify all template variables are correctly mapped
- Ensure email service is properly connected
- Check EmailJS dashboard for delivery status

## 📊 Email Templates Variables

### Available Variables
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Contributor name
- `{{resource_title}}` - Submission title
- `{{from_name}}` - Sender name (Vidhya Disha Admin Team)
- `{{reply_to}}` - Reply-to email address

### Custom Variables
You can add more variables by updating the `emailParams` object in the service functions.

## 🔒 Security Best Practices

### Environment Variables (Recommended)
Store sensitive data in environment variables:

```typescript
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  approvalTemplateId: import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE,
  rejectionTemplateId: import.meta.env.VITE_EMAILJS_REJECTION_TEMPLATE,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};
```

Create `.env` file:
```
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_APPROVAL_TEMPLATE=template_approval
VITE_EMAILJS_REJECTION_TEMPLATE=template_rejection
VITE_EMAILJS_PUBLIC_KEY=xyz789_your_public_key
```

## 📈 Monitoring

### EmailJS Dashboard
- Monitor email delivery rates
- Check for failed sends
- View usage statistics
- Manage templates and services

### Application Logs
- Check browser console for send confirmations
- Monitor success/failure rates
- Debug template variable issues

## 🎯 Current Status

### Development Mode
- ✅ Mock email sending with detailed console logs
- ✅ All email logic implemented and ready
- ✅ Template structure prepared
- ✅ Error handling in place

### Production Ready
- 🔄 Requires EmailJS account setup
- 🔄 Needs actual service configuration
- 🔄 Template creation required
- 🔄 Code uncommentation needed

## 🆘 Troubleshooting

### Common Issues
1. **Emails not sending**: Check service configuration and public key
2. **Template errors**: Verify template IDs and variable names
3. **Rate limiting**: EmailJS has monthly limits on free accounts
4. **Spam folder**: Check recipient's spam/junk folder

### Support Resources
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Templates Guide](https://www.emailjs.com/docs/tutorial/creating-email-template/)
- [EmailJS React Integration](https://www.emailjs.com/docs/sdk/installation/)

---

## 🎉 Ready to Go!

Once configured, the admin verification system will automatically send professional emails for all approval and rejection actions, providing a complete workflow for community content management.

**Current Implementation**: Mock emails with detailed logging  
**Production Ready**: Full EmailJS integration prepared  
**Setup Time**: ~15 minutes with EmailJS account