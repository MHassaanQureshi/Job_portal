import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { Building2, Plus, Globe, MapPin, AlertCircle, CheckCircle2, X, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminCompanies() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const res = await api.get('/company/getCompany');
        if (res.data.success) {
          setCompanies(res.data.companies || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!name || !bio || !website || !location || !logo) {
      setErrorMsg('All fields (Name, Bio, Website, Location, Logo URL) are required.');
      return;
    }

    try {
      setFormLoading(true);
      setErrorMsg('');

      const res = await api.post('/company/register', {
        name,
        bio,
        website,
        location,
        logo,
      });

      if (res.data.success) {
        setSuccessMsg('Company profile registered successfully!');
        setName('');
        setBio('');
        setWebsite('');
        setLocation('');
        setLogo('');
        setShowModal(false);
        fetchCompanies();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to register company.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2 font-mono-meta">
            <Building2 className="w-3.5 h-3.5 text-blue-700" /> Employer Management
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">Registered Companies</h1>
          <p className="text-xs text-slate-500">Manage organization profiles to post job listings</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-nexus-primary text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto rounded-md"
        >
          <Plus className="w-4 h-4" /> Add Company Profile
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="mb-5 p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Companies List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="nexus-card p-5 rounded-xl h-40 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="nexus-card p-12 rounded-xl text-center max-w-md mx-auto">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">No Companies Registered</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">Register your company profile first to post tech jobs.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-nexus-primary text-xs rounded-md"
          >
            Register First Company
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((comp) => (
            <div key={comp._id} className="nexus-card nexus-card-hover rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                    {comp.logo ? (
                      <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain rounded-md" />
                    ) : (
                      <Building2 className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-sans">{comp.name}</h3>
                    <span className="text-xs font-mono-meta text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {comp.location || 'Remote'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
                  {comp.bio || comp.Bio || 'Technology enterprise.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono-meta text-blue-700 font-semibold">
                <a href={comp.website?.startsWith('http') ? comp.website : `https://${comp.website}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Visit Website
                </a>
                <span className="text-[10px] text-slate-400 font-mono">ID: {comp._id.substring(0, 6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Company */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="nexus-card w-full max-w-md rounded-xl p-6 relative text-slate-900">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-slate-900 mb-1 font-sans">Register Company Profile</h2>
            <p className="text-xs text-slate-500 mb-4">Enter organization details for job postings</p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Vercel, Datadog"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="nexus-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Bio / Overview</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of business mission..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="nexus-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Website URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="nexus-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="nexus-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Logo Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="nexus-input w-full text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="btn-nexus-primary w-full py-2 text-xs font-bold mt-4 rounded-md"
              >
                {formLoading ? 'Registering...' : 'Register Company Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
