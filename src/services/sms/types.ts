// SMS Provider Types and Interfaces

export interface SMSProviderConfig {
  provider: 'twilio' | 'aws-sns' | 'mock';
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

export interface SMSSendResult {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

export interface SMSProvider {
  sendOTP(phoneNumber: string, otp: string): Promise<SMSSendResult>;
  validateConfig(): boolean;
}

export interface OTPStorageEntry {
  otp: string;
  expires: number;
  attempts: number;
  createdAt: number;
}
