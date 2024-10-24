// src/components/admin/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for recruiter-specific routes
  if (location.pathname === '/recruiter-dashboard') {
    if (user.role !== 'recruiter') {
      // Redirect non-recruiters to home page
      return <Navigate to="/" replace />;
    }
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;