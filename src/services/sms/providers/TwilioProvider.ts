import Twilio from 'twilio';
import { SMSProvider, SMSProviderConfig, SMSSendResult } from '../types';

export class TwilioProvider implements SMSProvider {
  private client: ReturnType<typeof Twilio> | null = null;
  private fromNumber: string;
  private accountSid: string;
  private authToken: string;

  constructor(config: SMSProviderConfig) {
    if (!config.accountSid || !config.authToken || !config.fromNumber) {
      throw new Error('Twilio configuration incomplete. Required: accountSid, authToken, fromNumber');
    }

    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.fromNumber = config.fromNumber;

    try {
      this.client = Twilio(this.accountSid, this.authToken);
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error);
      throw error;
    }
  }

  validateConfig(): boolean {
    return !!(this.accountSid && this.authToken && this.fromNumber && this.client);
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<SMSSendResult> {
    if (!this.client) {
      return {
        success: false,
        message: 'Twilio client not initialized',
        error: 'CLIENT_NOT_INITIALIZED'
      };
    }

    // Normalize phone number (ensure it has country code)
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

    try {
      const message = await this.client.messages.create({
        body: `Your Fretio verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
        from: this.fromNumber,
        to: normalizedPhone
      });

      console.log(`✅ SMS sent successfully via Twilio. SID: ${message.sid}`);

      return {
        success: true,
        message: `OTP sent to ${this.maskPhoneNumber(phoneNumber)}`,
        messageId: message.sid
      };
    } catch (error: any) {
      console.error('Twilio SMS sending error:', error);

      // Handle specific Twilio errors
      let errorMessage = 'Failed to send OTP. Please try again.';
      let errorCode = 'UNKNOWN_ERROR';

      if (error.code === 21211) {
        errorMessage = 'Invalid phone number format.';
        errorCode = 'INVALID_PHONE';
      } else if (error.code === 21608) {
        errorMessage = 'Phone number is not verified for trial accounts.';
        errorCode = 'UNVERIFIED_PHONE';
      } else if (error.code === 21614) {
        errorMessage = 'Invalid phone number.';
        errorCode = 'INVALID_PHONE';
      } else if (error.code === 20003) {
        errorMessage = 'Authentication error. Please contact support.';
        errorCode = 'AUTH_ERROR';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: errorCode
      };
    }
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let normalized = phoneNumber.replace(/\D/g, '');

    // If the number doesn't start with a country code, assume India (+91)
    if (!normalized.startsWith('91') && normalized.length === 10) {
      normalized = '91' + normalized;
    }

    // Add the '+' prefix
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }

  private maskPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length > 4) {
      return '***-***-' + cleaned.slice(-4);
    }
    return phoneNumber;
  }
}
