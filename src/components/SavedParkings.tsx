
import React, { useState } from 'react';
import { CircleParking, Shield, Zap, Bookmark, Star, Trash2, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from "@/hooks/use-toast";

const SavedParkings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { savedParkings, removeParking, isLoading } = useParking();
  const { toast } = useToast();

  const renderFeatureBadges = (features: { surveillance: boolean, evCharging: boolean, covered: boolean }) => {
    const badges = [];
    if (features?.surveillance) {
      badges.push(
        <Badge key="surveillance" variant="outline" className="text-xs flex items-center gap-1 bg-blue-50 border-blue-200">
          <Shield className="h-3 w-3" />
          24/7
        </Badge>
      );
    }
    if (features?.evCharging) {
      badges.push(
        <Badge key="ev" variant="outline" className="text-xs flex items-center gap-1 bg-green-50 border-green-200">
          <Zap className="h-3 w-3" />
          EV
        </Badge>
      );
    }
    if (features?.covered) {
      badges.push(
        <Badge key="covered" variant="outline" className="text-xs flex items-center gap-1 bg-purple-50 border-purple-200">
          <CircleParking className="h-3 w-3" />
          Covered
        </Badge>
      );
    }
    return <div className="flex flex-wrap gap-1 mt-1">{badges}</div>;
  };

  const handleRemoveParking = (id: string, name: string) => {
    removeParking(id);
    toast({
      title: "Parking Removed",
      description: `${name} has been removed from your saved list.`,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!Array.isArray(savedParkings) || savedParkings.length === 0) {
      return (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Bookmark className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No Saved Parkings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Click the bookmark icon on a parking lot to save it.
          </p>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full">
        {savedParkings.map((parking) => (
          <AccordionItem key={parking._id} value={parking._id}>
            <AccordionTrigger className="py-3 px-2 hover:bg-accent rounded-md transition-all">
              <div className="flex items-start space-x-3 w-full text-left">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CircleParking className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{parking.name}</p>
                  <p className="text-xs text-muted-foreground">{`${parking.address.street}, ${parking.address.city}`}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-3">
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</div>
                  <div className="flex items-center font-medium">
                    {parking.rating}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Features</div>
                  <div>{renderFeatureBadges(parking.features)}</div>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setIsOpen(false)} // Close sheet to show main view
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveParking(parking._id, parking.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          aria-label="Open saved parkings"
        >
          <Bookmark className="h-4 w-4" />
          <span>Saved ({Array.isArray(savedParkings) ? savedParkings.length : 0})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Your Saved Parkings</SheetTitle>
          <SheetDescription>
            Quickly access and manage your favorite parking locations.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-1">
          {renderContent()}
        </div>
        
        <SheetFooter className="pt-4">
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SavedParkings;
