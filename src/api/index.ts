
import axios from './axios';

// Parking API
export const getParkingLots = () => axios.get('/parking');
export const getParkingLotsNear = (longitude: number, latitude: number) => axios.get(`/parking/near?longitude=${longitude}&latitude=${latitude}`);
export const getParkingLotById = (id: string) => axios.get(`/parking/${id}`);

// Vehicle API
export const addVehicle = (vehicleData: any, token: string) => axios.post('/vehicles', vehicleData, { headers: { 'x-auth-token': token } });
export const getVehicles = (token: string) => axios.get('/vehicles', { headers: { 'x-auth-token': token } });
export const deleteVehicle = (id: string, token: string) => axios.delete(`/vehicles/${id}`, { headers: { 'x-auth-token': token } });

// Booking API
export const createBooking = (bookingData: any, token: string) => axios.post('/bookings', bookingData, { headers: { 'x-auth-token': token } });
export const getUserBookings = (token: string) => axios.get('/bookings/user', { headers: { 'x-auth-token': token } });
export const getUserBookingsByStatus = (status: string, token: string) => axios.get(`/bookings/user/${status}`, { headers: { 'x-auth-token': token } });
export const cancelBooking = (id: string, token: string) => axios.put(`/bookings/${id}/cancel`, {}, { headers: { 'x-auth-token': token } });
