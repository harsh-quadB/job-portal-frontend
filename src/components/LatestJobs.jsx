import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, BookOpen } from 'lucide-react';

// Custom Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const JobCard = ({ job, onApply }) => (
  <Card className="h-full flex flex-col">
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {job.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {job.company?.name}
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          {job.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {job.location || 'Remote'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            {job.salary || '120$'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
            {job.requirements || 'react css html'}
          </div>
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center mt-auto"
      >
        Apply Now
      </button>
    </div>
  </Card>
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
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-blue-600">Latest & Top</span> Job Openings
          </h1>
          <p className="text-gray-600">
            Discover and apply to the best job opportunities that match your skills and aspirations
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8 flex-grow">
            <p className="text-gray-600">No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr flex-grow">
            {jobs.map(job => (
              <JobCard 
                key={job._id} 
                job={job} 
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;