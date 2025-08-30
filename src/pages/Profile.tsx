import React, { useState } from 'react';
import { User, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getInitials } from '@/utils/helpers';
import EditProfileForm from '@/components/EditProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, isAuthenticated, signOut, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    navigate('/');
    return null;
  }
  
  const handleSaveProfile = (updatedUser: any) => {
    updateUser(updatedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 mr-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        
        {isEditing ? (
          <Card>
            <CardContent className="p-0">
              <EditProfileForm 
                user={user} 
                onSave={handleSaveProfile}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <p className="text-muted-foreground text-sm">Member since {user.memberSince}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-right">{user.email || 'Not provided'}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-right">{user.phone}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-muted-foreground">Rating</p>
                    <p className="text-right flex items-center justify-end">
                      <span className="text-yellow-500 mr-1">★</span>
                      {user.rating}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-muted-foreground">Total Bookings</p>
                    <p className="text-right">{user.bookingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Account Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      Change Password - NA for Demo Account
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      Notification Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      Language & Region
                    </Button>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-4"
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                >
                  Sign Out
                </Button>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Your Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground text-sm mb-4">No payment methods added yet</p>
                    <Button>
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
  );
};

export default Profile;
