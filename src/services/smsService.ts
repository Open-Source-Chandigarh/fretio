// SMS Service for OTP verification with real provider integration

import { SMSProvider } from './sms/types';
import { SMSProviderFactory } from './sms/SMSProviderFactory';
import { OTPStorageEntry } from './sms/types';

class SMSService {
  private static instance: SMSService;
  private otpStore = new Map<string, OTPStorageEntry>();
  private provider: SMSProvider | null = null;
  private providerPromise: Promise<SMSProvider>;

  private constructor() {
    // Initialize SMS provider from environment variables asynchronously
    this.providerPromise = this.initializeProvider();
  }

  private async initializeProvider(): Promise<SMSProvider> {
    try {
      const validation = SMSProviderFactory.validateEnvConfig();
      if (!validation.valid) {
        console.warn('⚠️ SMS Configuration Warning:', validation.error);
        console.warn('⚠️ Falling back to mock provider');
      }
      
      this.provider = await SMSProviderFactory.createFromEnv();
      console.log('✅ SMS Service initialized successfully');
      return this.provider;
    } catch (error) {
      console.error('❌ Failed to initialize SMS provider:', error);
      console.log('📱 Using mock provider as fallback');
      this.provider = await SMSProviderFactory.createProvider({ provider: 'mock' });
      return this.provider;
    }
  }

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  /**
   * Generates a 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Sends an OTP to the specified phone number
   * @param phoneNumber The phone number to send OTP to
   * @returns Promise with success status and message
   */
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; messageId?: string }> {
    // Wait for provider to be initialized
    const provider = await this.providerPromise;
    
    const otp = this.generateOTP();
    const now = Date.now();
    const expires = now + 5 * 60 * 1000; // 5 minutes
    
    // Store OTP with expiry and attempt counter
    this.otpStore.set(phoneNumber, { 
      otp, 
      expires, 
      attempts: 0,
      createdAt: now
    });

    try {
      // Use the configured provider to send SMS
      const result = await provider.sendOTP(phoneNumber, otp);
      
      if (!result.success) {
        // If sending failed, clean up the stored OTP
        this.otpStore.delete(phoneNumber);
      }
      
      return {
        success: result.success,
        message: result.message,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      // Clean up on error
      this.otpStore.delete(phoneNumber);
      
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  /**
   * Verifies an OTP for a phone number
   * @param phoneNumber The phone number to verify
   * @param userOTP The OTP code provided by the user
   * @returns Promise with success status and message
   */
  async verifyOTP(phoneNumber: string, userOTP: string): Promise<{ success: boolean; message: string }> {
    const stored = this.otpStore.get(phoneNumber);
    
    if (!stored) {
      return {
        success: false,
        message: 'OTP not found. Please request a new one.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > stored.expires) {
      this.otpStore.delete(phoneNumber);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }

    // Check attempt limit (max 3 attempts)
    if (stored.attempts >= 3) {
      this.otpStore.delete(phoneNumber);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      };
    }

    // Verify OTP
    if (stored.otp === userOTP) {
      this.otpStore.delete(phoneNumber);
      return {
        success: true,
        message: 'Phone number verified successfully!'
      };
    } else {
      // Increment attempts
      stored.attempts++;
      this.otpStore.set(phoneNumber, stored);
      
      return {
        success: false,
        message: `Invalid OTP. ${3 - stored.attempts} attempts remaining.`
      };
    }
  }

  /**
   * Gets the current SMS provider (useful for debugging)
   */
  async getProviderInfo(): Promise<string> {
    const provider = await this.providerPromise;
    return provider.constructor.name;
  }

  /**
   * Clears expired OTPs from storage (cleanup utility)
   */
  clearExpiredOTPs(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [phoneNumber, entry] of this.otpStore.entries()) {
      if (now > entry.expires) {
        this.otpStore.delete(phoneNumber);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} expired OTP(s)`);
    }
    
    return cleared;
  }
}

export const smsService = SMSService.getInstance();