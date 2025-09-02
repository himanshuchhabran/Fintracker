import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  // This hook correctly loads the token from storage when the app first starts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // The empty array [] ensures this runs only once

  const handleLogin = (newToken) => {
    // ✅ This is the crucial line you were missing
    localStorage.setItem('token', newToken); 
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="font-sans">
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;