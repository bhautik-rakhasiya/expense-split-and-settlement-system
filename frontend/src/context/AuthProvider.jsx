import { useState, useCallback } from 'react';
import AuthContext from './AuthContext';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/storage';

const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
