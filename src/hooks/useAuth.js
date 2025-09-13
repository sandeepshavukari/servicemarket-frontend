import { useState, useEffect } from 'react';
import { isAuthenticated, getUser } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const userData = getUser();
      setIsAuth(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { user, isAuth, loading };
};