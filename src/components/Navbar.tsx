import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getInitials } from '@/utils/helpers';
import ParkingHistory from './ParkingHistory';
import SavedParkings from './SavedParkings';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Navbar = () => {
  const { user, isAuthenticated, signOut } = useUser();
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
  };

  const handleSignUpSuccess = () => {
    setIsSignUpOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span className="font-bold text-lg">Parkodo</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center space-x-2">
                <SavedParkings />
                <ParkingHistory />
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  {isAuthenticated && user ? (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Settings className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full max-w-sm">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle>Account</SheetTitle>
                </SheetHeader>

                <div className="space-y-4">
                  {isAuthenticated && user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="sm:hidden space-y-2">
                        <SavedParkings />
                        <ParkingHistory />
                      </div>

                      <nav className="space-y-1">
                        <Link to="/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                          <User className="h-4 w-4 mr-2" /> Profile
                        </Link>
                        <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                        </Link>
                      </nav>

                      <Separator />

                      <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full justify-start" 
                        onClick={() => setIsSignInOpen(true)}
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Sign In
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsSignUpOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>

      <SignInForm 
        isOpen={isSignInOpen} 
        onOpenChange={setIsSignInOpen} 
        onSuccess={handleSignInSuccess} 
        onSwitchToSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      
      <SignUpForm 
        isOpen={isSignUpOpen} 
        onOpenChange={setIsSignUpOpen} 
        onSuccess={handleSignUpSuccess}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
