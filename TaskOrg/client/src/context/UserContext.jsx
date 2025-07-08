import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setAccessToken(storedToken);
      }
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update localStorage whenever accessToken changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    // localStorage will be cleared by the useEffect hooks above
  };

  // Helper function to set both user and token (useful for login)
  const loginUser = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    isLoading,
    logoutUser,
    loginUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};