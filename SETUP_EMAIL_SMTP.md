# Setting Up Email Verification for Fretio

## Option 1: Gmail SMTP (Easiest)

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Fretio" as the name
   - Copy the generated password

3. **Configure in Supabase Dashboard**
   - Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/auth
   - Scroll to "SMTP Settings"
   - Enable "Custom SMTP"
   - Enter these settings:
     - Host: smtp.gmail.com
     - Port: 587
     - Username: your-email@gmail.com
     - Password: [The app password you generated]
     - Sender email: your-email@gmail.com
     - Sender name: Fretio

## Option 2: SendGrid (Free tier - 100 emails/day)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com/free/
   - Sign up for free account

2. **Create API Key**
   - Go to Settings → API Keys
   - Create a new API key with "Full Access"
   - Copy the API key

3. **Configure in Supabase**
   - Host: smtp.sendgrid.net
   - Port: 587
   - Username: apikey
   - Password: [Your SendGrid API key]
   - Sender email: noreply@yourdomain.com
   - Sender name: Fretio

## Option 3: Brevo (formerly Sendinblue) - 300 emails/day free

1. **Create Brevo Account**
   - Go to https://www.brevo.com/
   - Sign up for free

2. **Get SMTP Credentials**
   - Go to SMTP & API
   - Get your SMTP credentials

3. **Configure in Supabase**
   - Host: smtp-relay.brevo.com
   - Port: 587
   - Username: [Your Brevo email]
   - Password: [Your SMTP password]
   - Sender email: [Your verified sender email]
   - Sender name: Fretio

## After Configuration

1. Save the settings in Supabase
2. Test by creating a new account
3. Check your email for the verification link

## Reverting the Auto-Login Workaround

Once email is working, remove the auto-login code from `AuthContext.tsx`:
- Remove lines 140-156 (the auto sign-in after signup code)
