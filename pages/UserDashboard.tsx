
import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/mockApiService';
import { useAuth } from '../context/AuthContext';
import { StoreWithAvgRating } from '../types';
import StoreCard from '../components/StoreCard';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreWithAvgRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStores = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const storesData = await apiService.getStoresWithRatings(user.id);
        setStores(storesData);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRateStore = async (storeId: string, rating: number) => {
    if (user) {
      await apiService.submitRating(user.id, storeId, rating);
      // Refetch stores to update average ratings and user's rating
      fetchStores();
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-8">Loading stores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Stores</h1>
        <input
          type="text"
          placeholder="Search for a store..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(store => (
            <StoreCard key={store.id} store={store} onRate={handleRateStore} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Stores Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
