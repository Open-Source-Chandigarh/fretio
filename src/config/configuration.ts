const configuration = {
  supabase_url: String(import.meta.env.VITE_SUPABASE_URL!),
  supabase_publishable_key: String(
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  ),
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  fromNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
  awsRegion: import.meta.env.VITE_AWS_REGION,
  awsAccessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
};
export default configuration;
