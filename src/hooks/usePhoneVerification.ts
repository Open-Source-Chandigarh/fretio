import { useState } from 'react';
import { smsService } from '@/services/smsService';
import { useToast } from '@/hooks/use-toast';

interface PhoneVerificationState {
  isRequesting: boolean;
  isVerifying: boolean;
  otpSent: boolean;
  phoneNumber: string;
  otp: string;
}

export const usePhoneVerification = () => {
  const [state, setState] = useState<PhoneVerificationState>({
    isRequesting: false,
    isVerifying: false,
    otpSent: false,
    phoneNumber: '',
    otp: ''
  });

  const { toast } = useToast();

  const setPhoneNumber = (phoneNumber: string) => {
    setState(prev => ({ ...prev, phoneNumber }));
  };

  const setOTP = (otp: string) => {
    setState(prev => ({ ...prev, otp }));
  };

  const requestOTP = async (phoneNumber?: string) => {
    const phone = phoneNumber || state.phoneNumber;
    
    if (!phone) {
      toast({
        variant: "destructive",
        title: "Phone Required",
        description: "Please enter your phone number first.",
      });
      return false;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
      });
      return false;
    }

    setState(prev => ({ ...prev, isRequesting: true }));

    try {
      const result = await smsService.sendOTP(phone);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isRequesting: false, 
          otpSent: true,
          phoneNumber: phone,
          otp: ''
        }));
        
        toast({
          title: "OTP Sent",
          description: result.message,
        });
        
        return true;
      } else {
        setState(prev => ({ ...prev, isRequesting: false }));
        
        toast({
          variant: "destructive",
          title: "Failed to Send OTP",
          description: result.message,
        });
        
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isRequesting: false }));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      
      return false;
    }
  };

  const verifyOTP = async (otp?: string) => {
    const otpCode = otp || state.otp;
    
    if (!otpCode) {
      toast({
        variant: "destructive",
        title: "OTP Required",
        description: "Please enter the verification code.",
      });
      return false;
    }

    if (!state.phoneNumber) {
      toast({
        variant: "destructive",
        title: "Phone Number Missing",
        description: "Please request a new OTP.",
      });
      return false;
    }

    setState(prev => ({ ...prev, isVerifying: true }));

    try {
      const result = await smsService.verifyOTP(state.phoneNumber, otpCode);
      
      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        ...(result.success ? { otpSent: false, otp: '' } : {})
      }));

      if (result.success) {
        toast({
          title: "Phone Verified",
          description: result.message,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed", 
          description: result.message,
        });
        
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isVerifying: false }));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      
      return false;
    }
  };

  const reset = () => {
    setState({
      isRequesting: false,
      isVerifying: false,
      otpSent: false,
      phoneNumber: '',
      otp: ''
    });
  };

  return {
    ...state,
    setPhoneNumber,
    setOTP,
    requestOTP,
    verifyOTP,
    reset
  };
};