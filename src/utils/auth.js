export const AuthEvents = {
  AUTH_CHANGED: 'authChanged',
  LOGIN: 'authLogin',
  LOGOUT: 'authLogout'
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
  localStorage.setItem('token', token);
  // Emit custom event for same-tab listeners
  window.dispatchEvent(new CustomEvent(AuthEvents.AUTH_CHANGED));
  window.dispatchEvent(new CustomEvent(AuthEvents.LOGIN));
};

export const removeToken = () => {
  localStorage.removeItem('token');
  // Emit custom event for same-tab listeners
  window.dispatchEvent(new CustomEvent(AuthEvents.AUTH_CHANGED));
  window.dispatchEvent(new CustomEvent(AuthEvents.LOGOUT));
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AuthEvents.AUTH_CHANGED));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const removeUser = () => {
  localStorage.removeItem('user');
  window.dispatchEvent(new CustomEvent(AuthEvents.AUTH_CHANGED));
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  // Optional: Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
});