import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getUserProfile } from './lib/firestore';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FoodHistory from './pages/FoodHistory';
import NewAnalysis from './pages/NewAnalysis';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';

function RequireAuth({ children, requireOnboarding = true }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [profileLoading, setProfileLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (user) {
      getUserProfile(user.uid).then(profile => {
        if (mounted) {
          if (!profile) {
            throw new Error("No profile found in database");
          }
          if (!profile.onboardingCompleted) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
          setProfileLoading(false);
        }
      }).catch(error => {
        console.error("Critical error: Profile missing or permission denied. Forcing logout.", error);
        if (mounted) {
          // If they don't have a profile or permissions fail, they cannot use the app. Force logout.
          if (logout) {
            logout().catch(console.error);
          }
          setProfileLoading(false);
        }
      });
    } else if (!loading) {
      setProfileLoading(false);
    }
    return () => { mounted = false; };
  }, [user, loading, location.pathname]);

  if (loading || profileLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOnboarding && needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboarding && !needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes without Sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={
            <RequireAuth requireOnboarding={false}>
              <Onboarding />
            </RequireAuth>
          } />
          
          {/* Private Routes with Sidebar via Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="food-history" element={
              <RequireAuth>
                <FoodHistory />
              </RequireAuth>
            } />
            <Route path="new-analysis" element={
              <RequireAuth>
                <NewAnalysis />
              </RequireAuth>
            } />
            <Route path="insights" element={
              <RequireAuth>
                <Insights />
              </RequireAuth>
            } />
            <Route path="profile" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
