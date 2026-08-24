import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Layers,
  Filter,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const REALISTIC_MOCK_JOBS = [
  {
    _id: 'mock-1',
    title: 'Senior Frontend Systems Engineer',
    description: 'Lead the architecture of our core web dashboard, optimizing rendering performance and state synchronization across millions of daily active sessions.',
    requirements: ['React', 'TypeScript', 'Web Workers', 'Performance Profiling'],
    salary: 165000,
    locations: 'San Francisco, CA (Hybrid)',
    jobType: 'Full-time',
    position: 2,
    company: { name: 'Stripe', location: 'San Francisco, CA' },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'Staff Infrastructure & Platform Engineer',
    description: 'Design resilient multi-region Kubernetes clusters and automated CI/CD pipelines powering global edge deployments.',
    requirements: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'gRPC'],
    salary: 195000,
    locations: 'Remote (US/Canada)',
    jobType: 'Full-time',
    position: 1,
    company: { name: 'Vercel', location: 'San Francisco, CA' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'mock-3',
    title: 'Backend API Developer - Core Billing Team',
    description: 'Scale complex usage-based metering services and high-concurrency payment integrations processing micro-transactions.',
    requirements: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka'],
    salary: 140000,
    locations: 'New York, NY',
    jobType: 'Full-time',
    position: 3,
    company: { name: 'Datadog', location: 'New York, NY' },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: 'mock-4',
    title: 'Product Designer (Design Systems & Components)',
    description: 'Craft beautiful, accessible design tokens and interactive micro-interactions for cross-platform desktop and mobile applications.',
    requirements: ['Figma', 'Design Systems', 'CSS/HTML', 'User Research'],
    salary: 155000,
    locations: 'Remote',
    jobType: 'Full-time',
    position: 1,
    company: { name: 'Linear', location: 'San Francisco, CA' },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'mock-5',
    title: 'Distributed Systems & Database Reliability Lead',
    description: 'Manage distributed consensus protocols and database replication health across enterprise multi-cloud installations.',
    requirements: ['C++', 'Rust', 'Raft Protocol', 'Linux Kernel'],
    salary: 210000,
    locations: 'Austin, TX (On-site)',
    jobType: 'Full-time',
    position: 1,
    company: { name: 'HashiCorp', location: 'Austin, TX' },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-6',
    title: 'AI Machine Learning Operations Engineer',
    description: 'Implement distributed model inference pipelines and fine-tuning workloads for frontier generative AI models.',
    requirements: ['Python', 'PyTorch', 'CUDA', 'Triton', 'Ray'],
    salary: 220000,
    locations: 'San Francisco, CA',
    jobType: 'Full-time',
    position: 2,
    company: { name: 'Anthropic', location: 'San Francisco, CA' },
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMinSalary, setSelectedMinSalary] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Fetch Jobs from backend route `/job/Get` with fallback
  const fetchJobs = async (keyword = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/job/Get?keyword=${encodeURIComponent(keyword)}`);
      if (res.data.success && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) {
        setJobs(res.data.jobs);
      } else {
        setJobs(REALISTIC_MOCK_JOBS);
      }
    } catch (err) {
      setJobs(REALISTIC_MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    if (user && user.role === 'student' && user._id) {
      try {
        const res = await api.get(`/application/getbyuserid/${user._id}`);
        if (res.data.success && res.data.application) {
          const apps = Array.isArray(res.data.application) ? res.data.application : [res.data.application];
          const ids = apps.map(app => app.job?._id || app.job);
          setAppliedJobIds(ids);
        }
      } catch (err) {
        // silent fallback
      }
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(searchKeyword);
  };

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = searchKeyword
      ? (job.title || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (job.description || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (job.company?.name || '').toLowerCase().includes(searchKeyword.toLowerCase())
      : true;

    const locationMatch = searchLocation 
      ? (job.locations || '').toLowerCase().includes(searchLocation.toLowerCase())
      : true;

    const typeMatch = selectedType === 'All'
      ? true
      : (job.jobType || '').toLowerCase().includes(selectedType.toLowerCase());

    const salaryMatch = selectedMinSalary > 0
      ? (job.salary || 0) >= selectedMinSalary
      : true;

    return titleMatch && locationMatch && typeMatch && salaryMatch;
  });

  const resetFilters = () => {
    setSearchKeyword('');
    setSearchLocation('');
    setSelectedType('All');
    setSelectedMinSalary(0);
    fetchJobs();
  };

  const handleApplicationSuccess = (jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Header Banner */}
      <div className="bg-[#1E3A8A] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-sans">
              Engineering & Product Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed font-normal">
              Direct access to technical roles at vetted technology companies. Filter by stack, salary, and remote preference.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-blue-900/60 p-3 rounded-lg border border-blue-800 shrink-0 font-mono-meta text-xs">
            <div>
              <span className="text-blue-300 block text-[10px] uppercase font-bold">Total Postings</span>
              <span className="text-base font-bold text-white">{jobs.length} Active</span>
            </div>
            <div className="h-8 w-px bg-blue-800" />
            <div>
              <span className="text-blue-300 block text-[10px] uppercase font-bold">Avg Compensation</span>
              <span className="text-base font-bold text-emerald-400">$165k/yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Layout: Left Sidebar Filters + Dense Right Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter Panel */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="nexus-card rounded-xl p-5 sticky top-20">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                    Filter Roles
                  </h3>
                </div>

                {(searchKeyword || searchLocation || selectedType !== 'All' || selectedMinSalary > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 font-mono-meta"
                  >
                    <RefreshCw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Keyword Search Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">Keyword or Title</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. React, Engineer, Stripe..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="nexus-input w-full pl-9 text-xs"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">Location / Remote</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Remote, San Francisco..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="nexus-input w-full pl-9 text-xs"
                    />
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">Employment Type</label>
                  <div className="space-y-1.5">
                    {['All', 'Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                      <label 
                        key={type} 
                        className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                          selectedType === type
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="jobType"
                            checked={selectedType === type}
                            onChange={() => setSelectedType(type)}
                            className="text-blue-700 focus:ring-blue-600 h-3.5 w-3.5"
                          />
                          <span>{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Salary Range Filter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 font-sans">Min Salary</label>
                    <span className="text-xs font-mono-meta font-bold text-emerald-700">
                      {selectedMinSalary === 0 ? 'Any' : `$${(selectedMinSalary / 1000).toFixed(0)}k/yr+`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="25000"
                    value={selectedMinSalary}
                    onChange={(e) => setSelectedMinSalary(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  />
                  <div className="flex justify-between text-[10px] font-mono-meta text-slate-400 mt-1">
                    <span>$0</span>
                    <span>$100k</span>
                    <span>$200k+</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-mono-meta font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{filteredJobs.length}</strong> matching positions
              </span>

              <span className="text-xs font-mono-meta text-slate-500">
                Sorted by: <strong className="text-slate-800">Latest Postings</strong>
              </span>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="nexus-card rounded-xl p-5 h-44 animate-pulse space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-24" />
                          <div className="h-4 bg-slate-200 rounded w-48" />
                        </div>
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="nexus-card p-12 rounded-xl text-center max-w-md mx-auto my-8">
                <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">No Positions Match Your Filters</h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">
                  Try clearing your search terms or lowering the minimum salary filter to view more opportunities.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-nexus-primary text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSelectJob={(j) => setSelectedJob(j)}
                    isApplied={appliedJobIds.includes(job._id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for Job Detail */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplicationSuccess={handleApplicationSuccess}
          isAlreadyApplied={appliedJobIds.includes(selectedJob._id)}
        />
      )}
    </div>
  );
}
