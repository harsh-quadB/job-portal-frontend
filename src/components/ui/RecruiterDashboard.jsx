import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const RecruiterDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Company form state
  const [companyInput, setCompanyInput] = useState({
    name: '',
    description: '',
    location: '',
    industry: '',
    website: ''
  });

  // Job form state
  const [jobInput, setJobInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    company: '',
    type: 'Full-time'
  });

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('https://job-backend-8olc.onrender.com/api/companies/getallcompany');
      setCompanies(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://job-backend-8olc.onrender.com/api/jobs/getalljob');
      setJobs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('https://job-backend-8olc.onrender.com/api/companies/createcompany', companyInput);
      
      setCompanyInput({
        name: '',
        description: '',
        location: ''
      });
      toast.success('Company created successfully');
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('https://job-backend-8olc.onrender.com/api/jobs/createjob', jobInput);
      toast.success('Job posted successfully');
      setJobInput({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        company: '',
        type: 'Full-time'
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.fullName}</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'companies' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'jobs' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
        </div>

        {/* Companies Tab Content */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Create Company</h2>
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={companyInput.name}
                    onChange={e => setCompanyInput({...companyInput, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={companyInput.description}
                    onChange={e => setCompanyInput({...companyInput, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={companyInput.location}
                    onChange={e => setCompanyInput({...companyInput, location: e.target.value})}
                    required
                  />
                </div>
                
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map(company => (
                <div key={company._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{company.description}</p>
                  <div className="mt-4">
                    <p className="text-sm"><strong>Location:</strong> {company.location}</p>
                    <p className="text-sm"><strong>Industry:</strong> {company.industry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Tab Content */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Post New Job</h2>
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={jobInput.title}
                    onChange={e => setJobInput({...jobInput, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={jobInput.description}
                    onChange={e => setJobInput({...jobInput, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Requirements</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={jobInput.requirements}
                    onChange={e => setJobInput({...jobInput, requirements: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={jobInput.salary}
                    onChange={e => setJobInput({...jobInput, salary: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={jobInput.location}
                    onChange={e => setJobInput({...jobInput, location: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={jobInput.company}
                    onChange={e => setJobInput({...jobInput, company: e.target.value})}
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{job.description}</p>
                  <div className="mt-4">
                    <p className="text-sm"><strong>Company:</strong> {job.company?.name}</p>
                    <p className="text-sm"><strong>Location:</strong> {job.location}</p>
                    <p className="text-sm"><strong>Salary:</strong> {job.salary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;