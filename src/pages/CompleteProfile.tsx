import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Upload } from 'lucide-react';

interface University {
  id: string;
  name: string;
}

interface Hostel {
  id: string;
  name: string;
}

const CompleteProfile = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [profileData, setProfileData] = useState({
    phone_number: '',
    university_id: '',
    hostel_id: '',
    room_number: '',
    student_id: ''
  });
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);

  const { profile, refreshProfile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
  }, []);

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
      setStep(2);
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

  const handleDocumentUpload = async () => {
    if (!user || !verificationDoc) return;

    setLoading(true);
    try {
      const fileExt = verificationDoc.name.split('.').pop();
      const fileName = `${user.id}/student-id.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, verificationDoc, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          document_url: publicUrl,
          document_type: 'student_id'
        });

      if (dbError) throw dbError;

      toast({
        title: "Document Uploaded",
        description: "Your student ID has been submitted for verification.",
      });

      navigate('/');
    } catch (error) {
      console.error('Document upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profile?.verification_status === 'verified') {
    navigate('/');
    return null;
  }

  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Help us verify your identity and connect you with your hostel community
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={profileData.phone_number}
                  onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input
                    id="room"
                    placeholder="A-204"
                    value={profileData.room_number}
                    onChange={(e) => setProfileData({ ...profileData, room_number: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="2021CS101"
                    value={profileData.student_id}
                    onChange={(e) => setProfileData({ ...profileData, student_id: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleProfileUpdate} 
                className="w-full" 
                disabled={loading || !profileData.university_id || !profileData.hostel_id}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Verification
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Student ID</h3>
                <p className="text-muted-foreground">
                  Please upload a clear photo of your student ID card for verification
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setVerificationDoc(e.target.files?.[0] || null)}
                    className="mb-2"
                  />
                  {verificationDoc && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      {verificationDoc.name}
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleDocumentUpload} 
                  className="w-full" 
                  disabled={loading || !verificationDoc}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Verification
                </Button>

                <p className="text-sm text-muted-foreground">
                  Your document will be reviewed by our admin team within 24-48 hours
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;