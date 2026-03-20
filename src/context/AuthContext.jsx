import { createContext, useState, useEffect, useContext } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const email = localStorage.getItem('userEmail');
          const nombre = localStorage.getItem('userName');
          setUser({ email, nombre });
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const newToken = response.token;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userName', response.nombre);
      if (response.workspaces) {
        localStorage.setItem('workspaces', JSON.stringify(response.workspaces));
      }
      
      setToken(newToken);
      setUser({ email: response.email, nombre: response.nombre, workspaces: response.workspaces });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (nombre, email, password) => {
    try {
      const response = await fetchApi('/api/auth/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      });
      const newToken = response.token;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userName', response.nombre);
      if (response.workspaces) {
        localStorage.setItem('workspaces', JSON.stringify(response.workspaces));
      }
      
      setToken(newToken);
      setUser({ email: response.email, nombre: response.nombre, workspaces: response.workspaces });
      return response;
    } catch (error) {
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('workspaceId');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
