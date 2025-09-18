import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );

const LoginPage: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState('john.doe@example.com');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case Role.ADMIN:
          navigate('/admin/dashboard', { replace: true });
          break;
        case Role.STORE_OWNER:
          navigate('/store-owner/dashboard', { replace: true });
          break;
        case Role.USER:
          navigate('/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const mockUsers = [
    { email: 'john.doe@example.com', name: 'Normal User (John)' },
    { email: 'jane.smith@example.com', name: 'Normal User (Jane)' },
    { email: 'alice.owner@example.com', name: 'Store Owner (Alice)' },
    { email: 'bob.merchant@example.com', name: 'Store Owner (Bob)' },
    { email: 'admin@example.com', name: 'System Administrator' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(selectedEmail);
      // The useEffect hook will now handle the redirection after the state update.
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <StarIcon className="h-12 w-12 text-primary-500" />
            </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Login to the Store Rating System</p>
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">This is a demo. Select a profile to log in.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="user-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              Log in as:
            </label>
            <select
              id="user-select"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              {mockUsers.map(user => (
                <option key={user.email} value={user.email}>{user.name}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;