
export interface User {
  id: string;
  name: string;
  token: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  rating: number;
  bookingCount: number;
  memberSince: string;
}
