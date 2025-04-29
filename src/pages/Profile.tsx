
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check if redirected from registration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('newRegistration') === 'true') {
      setIsEditing(true);
      toast.info("Please complete your profile information");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({ 
        name, 
        email, 
        profileImage,
        dateOfBirth,
        phoneNumber,
        gender,
        address
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Please select an image under 5MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setProfileImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User Avatar with Upload */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {previewImage || user?.profileImage ? (
                      <AvatarImage
                        src={previewImage || user?.profileImage}
                        alt={user?.name || "User"}
                      />
                    ) : (
                      <AvatarFallback className="bg-retailayu-purple text-white text-3xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Label
                        htmlFor="profileImage"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                      >
                        <Upload className="w-4 h-4" />
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </Label>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSubmitting}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Full Name
                        </div>
                        <div className="text-lg">{user?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Email
                        </div>
                        <div className="text-lg">{user?.email}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Role
                        </div>
                        <div className="text-lg capitalize">
                          {user?.role.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        disabled={isSubmitting}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isSubmitting}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={gender} 
                        onValueChange={setGender}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="gender" className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isSubmitting}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </div>
                      <div>{user?.dateOfBirth || "Not set"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </div>
                      <div>{user?.phoneNumber || "Not set"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Gender
                      </div>
                      <div className="capitalize">
                        {user?.gender?.replace("_", " ") || "Not set"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Address
                      </div>
                      <div>{user?.address || "Not set"}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Account Details */}
              <div>
                <h3 className="text-lg font-medium">Account Details</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Account Created
                    </div>
                    <div>April 20, 2023</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Last Login
                    </div>
                    <div>Today at 10:45 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                    setEmail(user?.email || "");
                    setDateOfBirth(user?.dateOfBirth || "");
                    setPhoneNumber(user?.phoneNumber || "");
                    setGender(user?.gender || "");
                    setAddress(user?.address || "");
                    setPreviewImage(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        {!isEditing && (
          <CardFooter className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </CardFooter>
        )}
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and security preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-muted-foreground text-sm">
                  Last changed 3 months ago
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => toast.info("Password change functionality will be implemented with Supabase integration.")}
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
