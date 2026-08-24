import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import AdminCompanies from './pages/AdminCompanies';
import PostJob from './pages/PostJob';
import AdminJobs from './pages/AdminJobs';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
          <div>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute roleRequired="student">
                      <Applications />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/companies"
                  element={
                    <ProtectedRoute roleRequired="recruiter">
                      <AdminCompanies />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/post-job"
                  element={
                    <ProtectedRoute roleRequired="recruiter">
                      <PostJob />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute roleRequired="recruiter">
                      <AdminJobs />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
