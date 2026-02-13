import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="food-log" element={
              <RequireAuth>
                <FoodLog />
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
