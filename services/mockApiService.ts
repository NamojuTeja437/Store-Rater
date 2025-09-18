
import { User, Role, Store, Rating, StoreWithAvgRating } from '../types';

// Mock Data
let users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', address: '123 Admin St, City', role: Role.ADMIN },
  { id: '2', name: 'John Doe', email: 'john.doe@example.com', address: '456 User Ave, Town', role: Role.USER },
  { id: '3', name: 'Jane Smith', email: 'jane.smith@example.com', address: '789 Voter Rd, Village', role: Role.USER },
  { id: '4', name: 'Alice Owner', email: 'alice.owner@example.com', address: '101 Owner Blvd, Metropolis', role: Role.STORE_OWNER, storeId: 's1' },
  { id: '5', name: 'Bob Merchant', email: 'bob.merchant@example.com', address: '202 Merchant Way, City', role: Role.STORE_OWNER, storeId: 's2' },
];

const initialStores: Store[] = [
  { id: 's1', name: 'Alice\'s Awesome Appliances', email: 'contact@alices.com', address: '555 Commerce St, Metropolis', ownerId: '4' },
  { id: 's2', name: 'Bob\'s Brilliant Books', email: 'help@bobsbooks.com', address: '777 Library Ln, City', ownerId: '5' },
  { id: 's3', name: 'General Goods & More', email: 'info@generalgoods.com', address: '999 Market Pl, Town', ownerId: '1' }, // Admin can own a store too
];

let stores: Store[];
try {
    const storedStores = localStorage.getItem('stores');
    stores = storedStores ? JSON.parse(storedStores) : initialStores;
    if (!storedStores) {
        localStorage.setItem('stores', JSON.stringify(stores));
    }
} catch (e) {
    console.error("Failed to load stores from localStorage", e);
    stores = initialStores;
    localStorage.setItem('stores', JSON.stringify(stores));
}


let ratings: Rating[] = [
  { id: 'r1', userId: '2', storeId: 's1', rating: 5, createdAt: new Date('2023-10-01T10:00:00Z').toISOString() },
  { id: 'r2', userId: '3', storeId: 's1', rating: 4, createdAt: new Date('2023-10-02T11:30:00Z').toISOString() },
  { id: 'r3', userId: '2', storeId: 's2', rating: 3, createdAt: new Date('2023-10-03T14:00:00Z').toISOString() },
  { id: 'r4', userId: '3', storeId: 's3', rating: 5, createdAt: new Date('2023-10-04T09:00:00Z').toISOString() },
];

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));
};

export const apiService = {
  login: (email: string): Promise<User | undefined> => {
    const user = users.find(u => u.email === email);
    return simulateDelay(user);
  },

  getAdminDashboardStats: (): Promise<{ userCount: number, storeCount: number, ratingCount: number }> => {
    return simulateDelay({
      userCount: users.length,
      storeCount: stores.length,
      ratingCount: ratings.length,
    });
  },
  
  getUsers: (): Promise<User[]> => simulateDelay(users),
  
  getStores: (): Promise<Store[]> => simulateDelay(stores),

  getStoresWithRatings: (userId: string): Promise<StoreWithAvgRating[]> => {
    const storesWithRatings = stores.map(store => {
      const storeRatings = ratings.filter(r => r.storeId === store.id);
      const avgRating = storeRatings.length > 0
        ? storeRatings.reduce((acc, r) => acc + r.rating, 0) / storeRatings.length
        : 0;
      const userRatingObj = storeRatings.find(r => r.userId === userId);
      
      return {
        ...store,
        avgRating: parseFloat(avgRating.toFixed(1)),
        userRating: userRatingObj?.rating
      };
    });
    return simulateDelay(storesWithRatings);
  },

  getStoreOwnerDashboard: (ownerId: string): Promise<{ store: Store; avgRating: number; ratings: (Rating & { userName: string })[] } | null> => {
    const store = stores.find(s => s.ownerId === ownerId);
    if (!store) return simulateDelay(null);

    const storeRatings = ratings.filter(r => r.storeId === store.id);
    const avgRating = storeRatings.length > 0
      ? storeRatings.reduce((acc, r) => acc + r.rating, 0) / storeRatings.length
      : 0;
      
    const ratingsWithUsers = storeRatings.map(r => {
      const user = users.find(u => u.id === r.userId);
      return { ...r, userName: user ? user.name : 'Unknown User' };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return simulateDelay({
      store,
      avgRating: parseFloat(avgRating.toFixed(1)),
      ratings: ratingsWithUsers
    });
  },

  submitRating: (userId: string, storeId: string, rating: number): Promise<Rating> => {
    const existingRatingIndex = ratings.findIndex(r => r.userId === userId && r.storeId === storeId);
    if (existingRatingIndex > -1) {
      ratings[existingRatingIndex].rating = rating;
      ratings[existingRatingIndex].createdAt = new Date().toISOString();
      return simulateDelay(ratings[existingRatingIndex]);
    } else {
      const newRating: Rating = {
        id: `r${ratings.length + 1}`,
        userId,
        storeId,
        rating,
        createdAt: new Date().toISOString(),
      };
      ratings.push(newRating);
      return simulateDelay(newRating);
    }
  },

  createStore: (storeData: Omit<Store, 'id'>): Promise<Store> => {
    const newStore: Store = {
      ...storeData,
      id: `s${stores.length + 1}_${Date.now()}`
    };
    stores.push(newStore);
    localStorage.setItem('stores', JSON.stringify(stores));
    return simulateDelay(newStore);
  }
};