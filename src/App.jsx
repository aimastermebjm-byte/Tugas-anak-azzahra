import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ChildDashboard from './components/ChildDashboard';
import ParentDashboard from './components/ParentDashboard';
import { authService, isParent } from './firebase/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitor auth state
    const unsubscribe = authService.onAuthStateChanged((authData) => {
      if (authData) {
        setCurrentUser(authData.user);
        setUserData(authData.userData);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loginData) => {
    setCurrentUser(loginData.user);
    setUserData(loginData.userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center kid-pattern stars-bg">
        <div className="text-white text-2xl">Memuat aplikasi...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!currentUser || !userData) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show appropriate dashboard based on user role
  if (isParent(userData)) {
    return <ParentDashboard user={currentUser} userData={userData} onLogout={handleLogout} />;
  } else {
    return <ChildDashboard user={currentUser} userData={userData} onLogout={handleLogout} />;
  }
}

export default App;