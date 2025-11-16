# EmailJS Configuration Guide

## Overview
The feedback system uses EmailJS to send emails directly from the frontend without requiring a backend email service.

## Setup Instructions

### 1. EmailJS Account Setup
1. Go to [emailjs.com](https://www.emailjs.com/) and create an account
2. Create a new email service (Gmail, Outlook, etc.)
3. Create a new email template
4. Get your Service ID, Template ID, and Public Key

### 2. Environment Configuration
Create a `.env.local` file in the project root with:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 3. Email Template Setup
Configure your EmailJS template with these variables:

**Template Settings:**
- **To Email**: `salmankhandwork@gmail.com` (or your admin email)
- **From Name**: `{{from_name}}`
- **From Email**: Use Default Email Address ✓
- **Reply To**: `{{reply_to}}`

**Template Variables:**
- `{{from_name}}` - User's name
- `{{reply_to}}` - User's email for replies
- `{{feedback_type}}` - Type of feedback (Bug Report, Feature Request, etc.)
- `{{rating}}` - Star rating (1-5 stars or "No rating")
- `{{message}}` - User's feedback message

### 4. Email Template HTML
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🍽️ New Feedback - Meal Plan Pro</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">{{from_name}} ({{reply_to}})</div>
            </div>
            <div class="field">
                <div class="label">Type:</div>
                <div class="value">{{feedback_type}}</div>
            </div>
            <div class="field">
                <div class="label">Rating:</div>
                <div class="value">{{rating}}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">{{message}}</div>
            </div>
        </div>
    </div>
</body>
</html>
```

### 5. Subject Line
```
[Meal Plan Pro] New {{feedback_type}} from {{from_name}}
```

## Testing
1. Start the development server: `npm run dev`
2. Navigate to More → Feedback
3. Fill out and submit a test feedback
4. Check your email for the feedback message

## Security Notes
- Environment variables are protected in `.gitignore`
- EmailJS public key is safe to use in frontend
- All emails are sent through EmailJS servers
- Reply-to functionality allows direct user communication

## Troubleshooting
- Verify all environment variables are set correctly
- Check EmailJS dashboard for service status
- Ensure template variables match exactly
- Test with a simple message first