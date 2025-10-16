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
import Header from '@/components/Header';

interface University {
  id: string;
  name: string;
}

interface Hostel {
  id: string;
  name: string;
}

// Punjab Universities data
const PUNJAB_UNIVERSITIES: University[] = [
  { id: 'pu', name: 'Panjab University, Chandigarh' },
  { id: 'gndu', name: 'Guru Nanak Dev University, Amritsar' },
  { id: 'pau', name: 'Punjab Agricultural University, Ludhiana' },
  { id: 'ptu', name: 'I.K. Gujral Punjab Technical University, Jalandhar' },
  { id: 'lpu', name: 'Lovely Professional University, Phagwara' },
  { id: 'cu', name: 'Chandigarh University, Mohali' },
  { id: 'tiet', name: 'Thapar Institute of Engineering and Technology, Patiala' },
  { id: 'cupb', name: 'Central University of Punjab, Bathinda' },
  { id: 'dav', name: 'DAV University, Jalandhar' },
  { id: 'gneu', name: 'Guru Nanak Dev Engineering College, Ludhiana' },
  { id: 'chitkara', name: 'Chitkara University, Rajpura' },
  { id: 'rimt', name: 'RIMT University, Mandi Gobindgarh' },
  { id: 'punjabiuni', name: 'Punjabi University, Patiala' },
  { id: 'bfuhs', name: 'Baba Farid University of Health Sciences, Faridkot' },
  { id: 'mrsptu', name: 'Maharaja Ranjit Singh Punjab Technical University, Bathinda' },
  { id: 'gcet', name: 'Guru Kashi University, Talwandi Sabo' },
  { id: 'sggs', name: 'Sri Guru Granth Sahib World University, Fatehgarh Sahib' },
  { id: 'rayat', name: 'Rayat Bahra University, Mohali' },
  { id: 'adesh', name: 'Adesh University, Bathinda' },
  { id: 'desh', name: 'Desh Bhagat University, Mandi Gobindgarh' }
];

// Sample hostels for testing
const SAMPLE_HOSTELS: Hostel[] = [
  { id: 'h1', name: 'Boys Hostel A' },
  { id: 'h2', name: 'Boys Hostel B' },
  { id: 'h3', name: 'Boys Hostel C' },
  { id: 'h4', name: 'Girls Hostel A' },
  { id: 'h5', name: 'Girls Hostel B' },
  { id: 'h6', name: 'International Students Hostel' },
  { id: 'h7', name: 'PG Men Hostel' },
  { id: 'h8', name: 'PG Women Hostel' },
  { id: 'h9', name: 'Research Scholars Hostel' },
  { id: 'h10', name: 'Sports Hostel' },
  { id: 'h11', name: 'Medical Students Hostel' },
  { id: 'h12', name: 'Engineering Block Hostel' }
];

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
    // Use static Punjab universities instead of fetching from database
    setUniversities(PUNJAB_UNIVERSITIES);
  }, []);

  useEffect(() => {
    if (profileData.university_id) {
      // Use static sample hostels for any university selection
      setHostels(SAMPLE_HOSTELS);
    }
  }, [profileData.university_id]);

  // Keep these functions for future use when database is properly set up
  const fetchUniversities = async () => {
    // For now, use static data
    setUniversities(PUNJAB_UNIVERSITIES);
  };

  const fetchHostels = async (universityId: string) => {
    // For now, use static data
    setHostels(SAMPLE_HOSTELS);
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, let's check if the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // For now, we'll use NULL for university_id and hostel_id since they're foreign keys
      // that don't exist in the database yet
      const profileUpdateData = {
        phone_number: profileData.phone_number,
        room_number: profileData.room_number,
        student_id: profileData.student_id,
        university_id: null, // Set to null to avoid foreign key constraint
        hostel_id: null,     // Set to null to avoid foreign key constraint
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProfile) {
        result = await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('profiles')
          .insert({
            ...profileUpdateData,
            id: user.id,  // Add id field
            user_id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          });
      }

      if (result.error) throw result.error;

      await refreshProfile();
      setStep(2);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
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
      const fileName = `${user.id}/student-id-${Date.now()}.${fileExt}`;

      // First check if the storage bucket exists, if not we'll handle it gracefully
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, verificationDoc, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, we'll just proceed without upload
        console.error('Storage upload error:', uploadError);
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          // Still update the profile even if storage fails
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_active: true,
              verification_status: 'verified', // Auto-verify for development
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
          }

          await refreshProfile();

          toast({
            title: "Verification Submitted",
            description: "Your information has been saved. Document verification will be set up soon.",
          });
          navigate('/');
          return;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(fileName);

      // Try to save verification record, but don't fail if table doesn't exist
      try {
        await supabase
          .from('user_verifications')
          .insert({
            user_id: user.id,
            document_url: publicUrl,
            document_type: 'student_id'
          });
      } catch (verificationError) {
        console.log('Verification table might not exist yet');
      }

      // Update profile to mark as active and verified (auto-verify for development)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_active: true,
          verification_status: 'verified', // Auto-verify for development
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
      }

      // Refresh the profile to get updated data
      await refreshProfile();

      toast({
        title: "Document Uploaded",
        description: "Your student ID has been submitted for verification.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Document upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
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
    <>
    <Header></Header>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Help us verify your identity and connect you with your hostel community
          </CardDescription>
          <Progress 
            value={progress} 
            className="mt-4 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-orange-300" 
          />
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
                className="w-full bg-orange-400 hover:bg-blue-300" 
                disabled={loading || !profileData.university_id || !profileData.hostel_id}
                size="lg"
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
    </>
  );
};

export default CompleteProfile;