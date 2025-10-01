import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import Header from '@/components/Header';
import { 
  User, 
  Phone, 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Camera,
  Loader2,
  Shield
} from 'lucide-react';

interface University {
  id: string;
  name: string;
}

interface Hostel {
  id: string;
  name: string;
}

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone_number: '',
    university_id: '',
    hostel_id: '',
    room_number: '',
    student_id: ''
  });

  const { toast } = useToast();
  const phoneVerification = usePhoneVerification();

  useEffect(() => {
    fetchUniversities();
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        university_id: profile.university_id || '',
        hostel_id: profile.hostel_id || '',
        room_number: profile.room_number || '',
        student_id: profile.student_id || ''
      });
      phoneVerification.setPhoneNumber(profile.phone_number || '');
    }
  }, [profile]);

  useEffect(() => {
    if (profileData.university_id) {
      fetchHostels(profileData.university_id);
    }
  }, [profileData.university_id]);

  const fetchUniversities = async () => {
    const { data } = await supabase.from('universities').select('id, name');
    if (data) setUniversities(data);
  };

  const fetchHostels = async (universityId: string) => {
    const { data } = await supabase
      .from('hostels')
      .select('id, name')
      .eq('university_id', universityId);
    if (data) setHostels(data);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    setLoading(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setAvatarFile(null);

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to update avatar. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = async () => {
    // Update phone number in profile first
    if (profileData.phone_number !== profile?.phone_number) {
      await handleProfileUpdate();
    }
    
    const success = await phoneVerification.requestOTP(profileData.phone_number);
    if (success) {
      // Phone verification OTP sent successfully
    }
  };

  const handleOTPVerification = async () => {
    const success = await phoneVerification.verifyOTP();
    if (success && user) {
      // Update profile to mark phone as verified
      const { error } = await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('user_id', user.id);

      if (!error) {
        await refreshProfile();
        phoneVerification.reset();
      }
    }
  };

  const getVerificationStatusIcon = () => {
    switch (profile?.verification_status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                    <AvatarFallback className="text-xl">
                      {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    {getVerificationStatusIcon()}
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{profile.full_name || 'User'}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{user.email}</span>
                    <Badge variant={profile.verification_status === 'verified' ? 'default' : 'secondary'}>
                      {profile.verification_status?.charAt(0).toUpperCase() + profile.verification_status?.slice(1)}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and hostel details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={profileData.student_id}
                        onChange={(e) => setProfileData({ ...profileData, student_id: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Select
                        value={profileData.university_id}
                        onValueChange={(value) => setProfileData({ ...profileData, university_id: value, hostel_id: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostel">Hostel</Label>
                      <Select
                        value={profileData.hostel_id}
                        onValueChange={(value) => setProfileData({ ...profileData, hostel_id: value })}
                        disabled={!profileData.university_id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hostels.map((hostel) => (
                            <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        value={profileData.room_number}
                        onChange={(e) => setProfileData({ ...profileData, room_number: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone_number}
                        onChange={(e) => {
                          setProfileData({ ...profileData, phone_number: e.target.value });
                          phoneVerification.setPhoneNumber(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phone Verification</CardTitle>
                  <CardDescription>
                    Verify your phone number for secure communication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{profileData.phone_number || 'No phone number'}</span>
                    {profile.phone_verified && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {!profile.phone_verified && profileData.phone_number && (
                    <div className="space-y-3">
                      {!phoneVerification.otpSent ? (
                        <Button
                          onClick={handlePhoneVerification}
                          disabled={phoneVerification.isRequesting}
                          variant="outline"
                        >
                          {phoneVerification.isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Send OTP
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Enter the 6-digit code sent to your phone
                          </p>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter OTP"
                              value={phoneVerification.otp}
                              onChange={(e) => phoneVerification.setOTP(e.target.value)}
                              maxLength={6}
                              className="font-mono text-center"
                            />
                            <Button
                              onClick={handleOTPVerification}
                              disabled={phoneVerification.isVerifying || !phoneVerification.otp || phoneVerification.otp.length !== 6}
                            >
                              {phoneVerification.isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Verify
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => phoneVerification.requestOTP()}
                            disabled={phoneVerification.isRequesting}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Verification</CardTitle>
                  <CardDescription>
                    Your student ID verification status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {getVerificationStatusIcon()}
                    <div>
                      <p className="font-medium">
                        Status: {profile.verification_status?.charAt(0).toUpperCase() + profile.verification_status?.slice(1)}
                      </p>
                      {profile.verification_status === 'pending' && (
                        <p className="text-sm text-muted-foreground">
                          Your documents are being reviewed by our admin team
                        </p>
                      )}
                      {profile.verification_status === 'rejected' && (
                        <p className="text-sm text-destructive">
                          Please upload a clearer student ID document
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Upload a profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      />
                      {avatarFile && (
                        <Button onClick={handleAvatarUpload} disabled={loading} size="sm">
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Avatar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;