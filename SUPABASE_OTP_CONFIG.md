# Supabase OTP Configuration Guide

## Configure Email OTP (Verification Codes)

To enable 6-digit verification codes instead of magic links:

### 1. Configure Email Templates

Go to: https://app.supabase.com/project/jryjpjkutwrieneuaoxv/auth/templates

#### For Signup Confirmation:

**Subject**: `Your IELTSinAja verification code`

**Body**:
```html
<h2>Verify your email</h2>
<p>Hello!</p>
<p>Your verification code for IELTSinAja is:</p>
<h1 style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: #0EA5E9;">{{ .Token }}</h1>
<p>This code expires in 1 hour.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
<br>
<p>Best regards,<br>IELTSinAja Team</p>
```

### 2. Email Settings

Go to: https://app.supabase.com/project/jryjpjkutwrieneuaoxv/auth/providers

Find **Email** provider and configure:

- ✅ **Enable email provider**: ON
- ✅ **Enable signup**: ON
- ⚠️ **Confirm email**: ON (Required for OTP flow)
- **Mailer**: Use default Supabase or configure custom SMTP

### 3. Token Settings

Go to: https://app.supabase.com/project/jryjpjkutwrieneuaoxv/auth/url-configuration

Configure:
- **Email token length**: 6 (default)
- **Email token validity**: 3600 seconds (1 hour)

### 4. Test the Flow

1. Sign up with email + password
2. User receives email with 6-digit code
3. User enters code on `/verify-email` page
4. Account is confirmed and user can log in

## Current Implementation

### Frontend Files Created/Updated:
- ✅ `/src/pages/VerifyEmail.tsx` - Code verification page
- ✅ `/src/pages/Auth.tsx` - Updated to redirect to verification
- ✅ `/src/App.tsx` - Added `/verify-email` route

### API Endpoints Used:
- `supabase.auth.signUp()` - Creates user and sends OTP
- `supabase.auth.verifyOtp()` - Verifies the code
- `supabase.auth.resend()` - Resends verification code

## Benefits of OTP vs Magic Links

✅ **User-friendly**: No need to switch between email and browser
✅ **Faster**: Just copy-paste a code
✅ **Mobile-friendly**: Works great on phones
✅ **Modern**: Used by Slack, Discord, etc.
✅ **Secure**: Codes expire in 1 hour

## Fallback to Magic Links

If you prefer magic links instead, you can keep the old behavior by:
1. Not redirecting to `/verify-email` after signup
2. Let users click the link in their email
3. Configure the email template to include a clickable link

## For Production

Make sure to:
1. ✅ Configure custom SMTP (not Supabase default)
2. ✅ Use your domain for sender email
3. ✅ Customize email templates with your branding
4. ✅ Test with real email addresses
5. ✅ Monitor email delivery rates
