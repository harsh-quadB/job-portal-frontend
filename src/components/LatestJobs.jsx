import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Building2, MapPin, DollarSign, GraduationCap } from 'lucide-react';

// Custom Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Custom Button Component
const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center justify-center px-4 py-2 rounded-md
      text-sm font-medium transition-colors
      ${disabled 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}
      ${className}
    `}
  >
    {children}
  </button>
);

// Custom Alert Components
const Alert = ({ children, className = '' }) => (
  <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm text-red-800">{children}</p>
);

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://job-backend-8olc.onrender.com/api/jobs/getalljob');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.data || []);
    } catch (error) {
      setError(error.message);
      showToast('Failed to fetch jobs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    navigate('/signup');
  };

  const showToast = (message, type) => {
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50
      ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}
      transform transition-transform duration-300 ease-in-out`;
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.style.transform = 'translateX(150%)';
      setTimeout(() => document.body.removeChild(toastEl), 300);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Alert className="max-w-md mx-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={fetchJobs}
          className="mt-4 mx-auto block"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-blue-600">Latest & Top</span> Job Openings
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and apply to the best job opportunities that match your skills and aspirations
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Card key={job._id} className="flex flex-col h-full transform transition-transform duration-200 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {job.company?.name}
                  </p>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      {job.salary}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="line-clamp-2">{job.requirements}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    onClick={handleApply}
                    className="w-full"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;