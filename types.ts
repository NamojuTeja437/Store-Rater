
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  STORE_OWNER = 'store_owner',
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  storeId?: string; // Only for store owners
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
}

export interface StoreWithAvgRating extends Store {
  avgRating: number;
  userRating?: number;
}
