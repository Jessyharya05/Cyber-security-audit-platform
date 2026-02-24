import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials for 3 roles
        if (email === 'admin@cyberguard.com' && password === 'admin123') {
          const userData = {
            id: 1,
            name: 'Admin User',
            email: email,
            role: 'admin'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
          resolve({ success: true, user: userData });
        } 
        else if (email === 'auditor@cyberguard.com' && password === 'auditor123') {
          const userData = {
            id: 2,
            name: 'Auditor User',
            email: email,
            role: 'auditor'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
          resolve({ success: true, user: userData });
        }
        else if (email === 'company@tech.com' && password === 'company123') {
          const userData = {
            id: 3,
            name: 'Tech Solutions Inc',
            email: email,
            role: 'auditee',
            company: 'Tech Solutions Inc'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
          resolve({ success: true, user: userData });
        }
        else {
          setLoading(false);
          reject({ success: false, message: 'Invalid email or password' });
        }
      }, 1000);
    });
  };

  const register = (userData, role) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          ...userData,
          role: role
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setLoading(false);
        resolve({ success: true, user: newUser });
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAuditor: user?.role === 'auditor',
    isAuditee: user?.role === 'auditee'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;