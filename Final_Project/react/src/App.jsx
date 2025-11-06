import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Predict from './pages/Predict';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { getUserProfile } from './store/authSlice';
import { store } from './store/store';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is authenticated (has token) but no user data, fetch profile
    if (isAuthenticated && token && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, token, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontWeight: '500',
          },
          success: {
            style: {
              border: '1px solid #10b981',
              background: '#f0fdf4',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#f0fdf4',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
              background: '#fef2f2',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/predict" element={
          <ProtectedRoute>
            <Layout>
              <Predict />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;