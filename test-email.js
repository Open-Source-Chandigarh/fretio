// Test script to check if Supabase email is working
// Run this after configuring SMTP: node test-email.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gokuiwmiommnvexcckvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdva3Vpd21pb21tbnZleGNja3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTczNDgsImV4cCI6MjA3NjA3MzM0OH0.dZxThXl_Oc2y1oyWbzTaz3SVAN3_dUaOfa5jR6PKPok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmail() {
  const testEmail = `test${Date.now()}@example.com`;
  
  console.log('Testing email configuration...');
  console.log(`Creating test account with email: ${testEmail}`);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!',
  });
  
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  
  if (data.user) {
    console.log('✓ User created successfully!');
    console.log('✓ Check if email was sent');
    console.log('User ID:', data.user.id);
    console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    
    if (!data.user.email_confirmed_at) {
      console.log('\n📧 If SMTP is configured correctly, a verification email should be sent to:', testEmail);
      console.log('(This is a test email, so you won\'t actually receive it)');
    }
  }
}

testEmail();
