import { useState, useEffect } from 'react';
import { isAuthenticated, getUser, AuthEvents } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = getUser();
    
    setIsAuth(!!token);
    setUser(userData);
    setLoading(false);
    
    console.log('Auth check:', { hasToken: !!token, user: userData });
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      console.log('Storage changed (other tab)');
      checkAuth();
    };

    // Listen for custom auth events from same tab
    const handleAuthChange = () => {
      console.log('Auth changed (same tab)');
      checkAuth();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AuthEvents.AUTH_CHANGED, handleAuthChange);
    window.addEventListener(AuthEvents.LOGIN, handleAuthChange);
    window.addEventListener(AuthEvents.LOGOUT, handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AuthEvents.AUTH_CHANGED, handleAuthChange);
      window.removeEventListener(AuthEvents.LOGIN, handleAuthChange);
      window.removeEventListener(AuthEvents.LOGOUT, handleAuthChange);
    };
  }, []);

  return { user, isAuth, loading, checkAuth };
};