const nodemailer = require('nodemailer');
const { mail } = require('../config/env');

let transporter = null;

function getTransporter() {
  if (!mail.enabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.port === 465,
      auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
    });
  }
  return transporter;
}

async function sendMail({ subject, text, html }) {
  if (!mail.enabled || !mail.notifyTo) {
    console.log('[email:skipped]', subject);
    console.log(text);
    return { skipped: true };
  }

  const transport = getTransporter();
  await transport.sendMail({
    from: mail.from,
    to: mail.notifyTo,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
  });
  return { sent: true };
}

async function notifyInquiry(inquiry) {
  const subject = `New inquiry from ${inquiry.name}`;
  const lines = [
    `Name: ${inquiry.name}`,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    `Type: ${inquiry.inquiry_type}`,
    inquiry.property_name ? `Property: ${inquiry.property_name}` : null,
    inquiry.message ? `\nMessage:\n${inquiry.message}` : null,
  ].filter(Boolean);

  return sendMail({ subject, text: lines.join('\n') });
}

async function notifyLead(lead) {
  const subject = `New ${lead.type} lead: ${lead.email}`;
  const lines = [
    `Type: ${lead.type}`,
    lead.name ? `Name: ${lead.name}` : null,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.income_range ? `Income: ${lead.income_range}` : null,
    lead.credit_range ? `Credit: ${lead.credit_range}` : null,
    lead.desired_price ? `Desired price: $${lead.desired_price}` : null,
  ].filter(Boolean);

  return sendMail({ subject, text: lines.join('\n') });
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = 'Reset your admin password';
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'We received a request to reset your admin password.',
    `Reset your password using this link (expires in 1 hour):`,
    resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  if (!mail.enabled) {
    console.log('[email:password-reset]', subject);
    console.log(`To: ${to}`);
    console.log(text);
    return { skipped: true };
  }

  const transport = getTransporter();
  await transport.sendMail({
    from: mail.from,
    to,
    subject,
    text,
    html: text.replace(/\n/g, '<br>'),
  });
  return { sent: true };
}

module.exports = { sendMail, notifyInquiry, notifyLead, sendPasswordResetEmail };
