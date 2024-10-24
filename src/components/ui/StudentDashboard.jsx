import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Building2 } from 'lucide-react';

const Button = ({ children, disabled, onClick, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${className} inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors
    ${disabled 
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}`}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    {children}
  </div>
);

const StudentDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const [jobs, setJobs] = useState([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);  // Add error state
  const [applyingJob, setApplyingJob] = useState(null);  // Track which job is being applied to
  const [appliedJobs, setAppliedJobs] = useState(new Set());

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
      setJobs(data.data || []); // Ensure we set an empty array if data.data is undefined
    } catch (error) {
      setError(error.message);
      showToast('Failed to fetch jobs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingJob(jobId);
    try {
      const response = await fetch(`https://job-backend-8olc.onrender.com/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply for job');
      }
      
      setAppliedJobs(prev => new Set([...prev, jobId]));
      showToast('Successfully applied to job', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to apply for job', 'error');
    } finally {
      setApplyingJob(null);
    }
  };

  const showToast = (message, type) => {
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white 
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
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchJobs}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Welcome, {user?.fullName || 'Student'}
        </h1>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <Card key={job._id}>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600">{job.description}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">Company:</span>{' '}
                      {job.company?.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">Location:</span>{' '}
                      {job.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">Salary:</span>{' '}
                      {job.salary}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-gray-900">Requirements:</p>
                      <p className="text-sm text-gray-600">{job.requirements}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Button
                    onClick={() => handleApply(job._id)}
                    disabled={applyingJob === job._id || appliedJobs.has(job._id)}
                    className="w-full"
                  >
                    {applyingJob === job._id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : appliedJobs.has(job._id) ? (
                      'Applied'
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Apply Now
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;