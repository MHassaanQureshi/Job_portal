import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Building2, DollarSign, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Form state
  const [companyId, setCompanyId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [locations, setLocations] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [position, setPosition] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchRecruiterCompanies = async () => {
      if (user?._id) {
        try {
          const res = await api.get(`/company/get/${user._id}`);
          if (res.data.success) {
            const comps = res.data.companies || [];
            setCompanies(comps);
            if (comps.length > 0) setCompanyId(comps[0]._id);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingCompanies(false);
        }
      }
    };
    fetchRecruiterCompanies();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !salary || !locations || !companyId) {
      setErrorMsg('Please fill in all required job fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const reqArray = requirements ? requirements.split(',').map(r => r.trim()) : ['React', 'TypeScript'];

      const res = await api.post('/job/uploadJob', {
        title,
        description,
        requirements: reqArray,
        salary: Number(salary),
        locations,
        jobType,
        position: Number(position),
        company: companyId,
      });

      if (res.data.success) {
        setSuccessMsg('Job posting created successfully!');
        setTimeout(() => {
          navigate('/admin/jobs');
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="nexus-card p-6 sm:p-8 rounded-xl text-slate-900">
        
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2 font-mono-meta">
            <PlusCircle className="w-3.5 h-3.5 text-blue-700" /> Employer Action
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">Publish Job Listing</h1>
          <p className="text-xs text-slate-500 mt-1">Publish open positions to candidate pipeline</p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loadingCompanies ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono-meta">Loading company accounts...</div>
        ) : companies.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
            <Building2 className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 mb-1 font-sans">No Company Registered</h3>
            <p className="text-xs text-slate-500 mb-4">Register a company profile before creating job listings.</p>
            <button onClick={() => navigate('/admin/companies')} className="btn-nexus-primary text-xs rounded-md">
              Register Company Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Company Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Select Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="nexus-input w-full text-xs"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id} className="bg-white text-slate-900">
                    {c.name} ({c.location || 'Remote'})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Job Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer (React/TypeScript)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="nexus-input w-full text-xs"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Job Description</label>
              <textarea
                rows={4}
                required
                placeholder="Describe key responsibilities, technical requirements, and core impact..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="nexus-input w-full text-xs"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Skills & Requirements (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js, PostgreSQL, AWS"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="nexus-input w-full text-xs"
              />
            </div>

            {/* Salary & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Annual Salary (USD)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    placeholder="145000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="nexus-input w-full pl-9 text-xs font-mono-meta font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans font-sans">Location / Remote</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="San Francisco, CA (Hybrid)"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    className="nexus-input w-full pl-9 text-xs font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Job Type & Position Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Employment Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="nexus-input w-full text-xs"
                >
                  <option value="Full-Time" className="bg-white text-slate-900">Full-Time</option>
                  <option value="Part-Time" className="bg-white text-slate-900">Part-Time</option>
                  <option value="Contract" className="bg-white text-slate-900">Contract</option>
                  <option value="Remote" className="bg-white text-slate-900">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Open Positions Count</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="nexus-input w-full text-xs font-mono-meta"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-nexus-primary w-full py-2.5 text-xs font-bold mt-4 rounded-md"
            >
              {submitting ? 'Publishing Listing...' : 'Publish Job Listing'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
