import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/admin/Companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants';
import RecruiterDashboard from './components/ui/RecruiterDashboard';
import StudentDashboard from './components/ui/StudentDashboard';

// Simplified Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Error Boundary Component
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-4">
          We couldn't find the page you're looking for. Please check the URL or go back to the home page.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobs",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/browse",
    element: <Browse />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/recruiter-dashboard",
    element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/student-dashboard",
    element: <ProtectedRoute><StudentDashboard /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "*",
    element: <ErrorBoundary />
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;