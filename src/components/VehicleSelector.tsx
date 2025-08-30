
import React, { useState, useEffect } from 'react';
import { Car, Bike, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { getVehicles, addVehicle } from '@/api';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface VehicleSelectorProps {
  selectedVehicle: string;
  onSelectVehicle: (vehicleId: string) => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selectedVehicle, onSelectVehicle }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState('car');
  const [newVehicleLicensePlate, setNewVehicleLicensePlate] = useState('');
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user) {
        try {
          const response = await getVehicles(localStorage.getItem('token') || '');
          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    fetchVehicles();
  }, [user]);

  const handleAddVehicle = async () => {
    if (user) {
      try {
        const newVehicle = await addVehicle({ type: newVehicleType, licensePlate: newVehicleLicensePlate }, localStorage.getItem('token') || '');
        setVehicles([...vehicles, newVehicle.data]);
        onSelectVehicle(newVehicle.data._id);
        setShowAddVehicleDialog(false);
        setNewVehicleLicensePlate('');
        toast({ title: 'Vehicle added successfully' });
      } catch (error) {
        console.error('Error adding vehicle:', error);
        toast({ title: 'Error adding vehicle', variant: 'destructive' });
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={selectedVehicle} onValueChange={onSelectVehicle}>
          <SelectTrigger>
            <SelectValue placeholder="Select a vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle._id} value={vehicle._id}>
                <div className="flex items-center gap-2">
                  {vehicle.type === 'car' ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                  <span>{vehicle.licensePlate}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setShowAddVehicleDialog(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new vehicle</DialogTitle>
            <DialogDescription>Enter your vehicle details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newVehicleType} onValueChange={setNewVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="License plate"
              value={newVehicleLicensePlate}
              onChange={(e) => setNewVehicleLicensePlate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVehicleDialog(false)}>Cancel</Button>
            <Button onClick={handleAddVehicle}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleSelector;
