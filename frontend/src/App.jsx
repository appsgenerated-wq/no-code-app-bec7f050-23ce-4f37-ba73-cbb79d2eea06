import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [observations, setObservations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest();

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful. Checking user session...');
        try {
          const userResult = await manifest.from('User').me();
          if (userResult) {
            setCurrentUser(userResult);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.log('ℹ️ [APP] No active user session found.');
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
    };

    checkConnectionAndSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const userResult = await manifest.from('User').me();
      setCurrentUser(userResult);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setCurrentUser(null);
    setObservations([]);
    setIsLoggedIn(false);
  };

  const loadObservations = async () => {
    try {
      const response = await manifest.from('ChimpObservation').find({
        include: ['observer'],
        sort: { createdAt: 'desc' },
        limit: 50
      });
      setObservations(response.data);
    } catch (error) {
      console.error('Failed to load observations:', error);
    }
  };

  const createObservation = async (observationData) => {
    try {
      const newObservation = await manifest.from('ChimpObservation').create(observationData);
      // Refetch all observations to get the newly created one with observer data
      await loadObservations();
    } catch (error) {
      console.error('Failed to create observation:', error);
      alert(`Error creating observation: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs font-medium text-gray-600">{backendConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {isLoggedIn && currentUser ? (
        <DashboardPage
          user={currentUser}
          observations={observations}
          onLogout={handleLogout}
          onLoadObservations={loadObservations}
          onCreateObservation={createObservation}
        />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
