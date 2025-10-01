import { SMSProvider, SMSProviderConfig, SMSSendResult } from '../types';

/**
 * Mock SMS Provider for Development and Testing
 * Logs OTP to console instead of sending real SMS
 */
export class MockProvider implements SMSProvider {
  private config: SMSProviderConfig;

  constructor(config: SMSProviderConfig) {
    this.config = config;
    console.log('📱 Mock SMS Provider initialized - OTPs will be logged to console');
  }

  validateConfig(): boolean {
    return this.config.provider === 'mock';
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<SMSSendResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Log OTP to console for development
    console.log('\n' + '='.repeat(60));
    console.log('🔐 MOCK SMS SERVICE - OTP Generated');
    console.log('='.repeat(60));
    console.log(`📱 Phone Number: ${phoneNumber}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`⏰ Valid for: 5 minutes`);
    console.log('='.repeat(60) + '\n');

    return {
      success: true,
      message: `OTP sent to ${this.maskPhoneNumber(phoneNumber)}`,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  private maskPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length > 4) {
      return '***-***-' + cleaned.slice(-4);
    }
    return phoneNumber;
  }
}
