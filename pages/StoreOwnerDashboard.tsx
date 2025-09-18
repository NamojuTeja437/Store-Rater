
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/mockApiService';
import { useAuth } from '../context/AuthContext';
import { Store, Rating } from '../types';

type RatingWithUserName = Rating & { userName: string };

interface DashboardData {
  store: Store;
  avgRating: number;
  ratings: RatingWithUserName[];
}

const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" /></svg>;

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        try {
          const dashboardData = await apiService.getStoreOwnerDashboard(user.id);
          setData(dashboardData);
        } catch (error) {
          console.error("Failed to fetch store owner data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center p-8">Loading your dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data ? data.store.name : 'Store Owner Dashboard'}</h1>
          <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{data ? 'Store Performance' : 'Manage your stores'}</p>
        </div>
        <Link 
            to="/store-owner/create-store" 
            className="w-full sm:w-auto bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors text-center"
        >
          Create New Store
        </Link>
      </div>
      
      {!data ? (
        <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">You haven't created a store yet.</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by adding your first store to the platform.</p>
            <Link to="/store-owner/create-store" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                Create Your First Store
            </Link>
        </div>
      ) : (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Store Performance</h2>
                <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50">
                    <StarIcon />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.avgRating.toFixed(1)} <span className="text-2xl text-gray-500">/ 5</span></p>
                </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Ratings</h2>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {data.ratings.map(rating => (
                        <tr key={rating.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{rating.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < rating.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(rating.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {data.ratings.length === 0 && (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No ratings have been submitted yet.</p>
                )}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
