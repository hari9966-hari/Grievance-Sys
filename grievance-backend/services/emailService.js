const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send Email Notification
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Grievance System'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    // For ethereal mock accounts, provide a preview URL
    if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email send failure:', error);
    // Don't throw error to prevent breaking the main request flow
    return null;
  }
};

/**
 * Common Email Templates
 */
const templates = {
  COMPLAINT_CREATED: (complaint) => ({
    subject: `Complaint Filed: ${complaint.title}`,
    message: `Your complaint has been successfully filed with ID: ${complaint._id}. You can track its progress on the dashboard.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Complaint Filed Successfully</h2>
        <p>Hello,</p>
        <p>Your complaint <strong>"${complaint.title}"</strong> has been registered.</p>
        <p><strong>Complaint ID:</strong> ${complaint._id}</p>
        <p><strong>Category:</strong> ${complaint.category}</p>
        <p><strong>SLA Deadline:</strong> ${new Date(complaint.slaDeadline).toLocaleDateString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
      </div>
    `
  }),
  
  RESOLUTION_VERIFICATION: (complaint) => ({
    subject: `Action Required: Verify Resolution for ${complaint.title}`,
    message: `An officer has marked your complaint as resolved. Please log in to verify if the issue is solved.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981;">Resolution Verification Required</h2>
        <p>Hello,</p>
        <p>Your complaint <strong>"${complaint.title}"</strong> has been marked as resolved by the assigned officer.</p>
        <p><strong>Officer's Notes:</strong> ${complaint.resolutionNotes || 'No notes provided.'}</p>
        <p>Please log in to your dashboard to confirm if the resolution is satisfactory or reopen the complaint.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/citizen/complaints/${complaint._id}" 
           style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; border-radius: 5px; text-decoration: none;">
          Verify Resolution
        </a>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">If you do not take action within 48 hours, the system may automatically close the complaint.</p>
      </div>
    `
  }),

  COMPLAINT_REOPENED: (complaint) => ({
    subject: `Complaint Reopened: ${complaint.title}`,
    message: `The citizen has reopened the complaint. Immediate attention is required.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ef4444;">Complaint Reopened</h2>
        <p>A citizen was not satisfied with the resolution for complaint <strong>"${complaint.title}"</strong>.</p>
        <p><strong>Reason/Feedback:</strong> ${complaint.feedback || 'No specific feedback provided.'}</p>
        <p>Please review the case and resolve it as soon as possible.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
      </div>
    `
  }),

  COMPLAINT_ESCALATED: (complaint) => ({
    subject: `Urgent: Complaint Escalated to Level ${complaint.escalationLevel}`,
    message: `Complaint "${complaint.title}" has been escalated due to SLA breach.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ef4444;">Complaint Escalated</h2>
        <p>Complaint <strong>"${complaint.title}"</strong> has exceeded its SLA deadline and has been escalated.</p>
        <p><strong>New Escalation Level:</strong> ${complaint.escalationLevel}</p>
        <p><strong>New Deadline:</strong> ${new Date(complaint.slaDeadline).toLocaleString()}</p>
        <p><strong>Priority:</strong> ${complaint.priority}</p>
        <p>Please take immediate action to resolve this grievance.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">This is an automated escalation alert.</p>
      </div>
    `
  })
};

module.exports = { sendEmail, templates };
