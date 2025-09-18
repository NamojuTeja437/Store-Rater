
import React, { useState } from 'react';
import { StoreWithAvgRating } from '../types';
import RatingStars from './RatingStars';

interface StoreCardProps {
  store: StoreWithAvgRating;
  onRate: (storeId: string, rating: number) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onRate }) => {
  const [currentRating, setCurrentRating] = useState(store.userRating || 0);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    onRate(store.id, newRating);
  };
  
  const LocationMarkerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.169-4.418 9.577 9.577 0 002.162-6.177c0-5.225-4.249-9.474-9.473-9.474s-9.473 4.249-9.473 9.474c0 2.31.826 4.477 2.162 6.178a16.975 16.975 0 005.169 4.418zM12 1.25a8.25 8.25 0 018.25 8.25c0 2.652-.936 4.945-2.43 6.75a15.488 15.488 0 01-5.012 3.934.75.75 0 01-.616 0A15.488 15.488 0 016.18 16.25C4.68 14.445 3.75 12.152 3.75 9.5A8.25 8.25 0 0112 1.25z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 8.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10.5 9.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{store.name}</h3>
        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
            <LocationMarkerIcon className="h-5 w-5 mr-2" />
            <p className="text-sm">{store.address}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
                <span className="text-yellow-500 font-bold text-lg">{store.avgRating.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/ 5.0 (Overall)</span>
            </div>
        </div>

        <div className="mt-4 border-t pt-4 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Your Rating</h4>
            <RatingStars rating={currentRating} onRatingChange={handleRatingChange} />
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
