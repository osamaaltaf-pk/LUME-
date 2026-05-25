import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authServices.js'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        return { message: error.message }
      }
    }
    setHydrated(true);
  }, [])

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isUser = () => {
    return user?.role === "user"
  }

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole
  }


  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message }
    }
  }

  const signup = async (userData) => {
    try {
      await authService.signup(userData);
      return { success: true }
    } catch (error) { const message = error?.response?.data?.message || error?.message || 'Signup failed'; return { success: false, message }; }
  }

  const verifyOtp = async (data) => {
    try {
      const response = await authService.verifyOtp(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true }
    } catch (error) {
      const message = error?.response?.data?.message || 'Verification failed';
      return { success: false, message };
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authService.logout(refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
    }
  }

  const value = {
    user,
    login,
    signup,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isUser,
    hasRole,
    hydrated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;