import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { Briefcase, Building2, Users, MapPin, DollarSign, X, CheckCircle2, XCircle, Eye, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applicant Drawer Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchAdminJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/job/GetAdminJob');
      if (res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, [user]);

  const openApplicantsModal = async (job) => {
    setSelectedJob(job);
    try {
      setLoadingApp(true);
      setStatusMsg('');
      const res = await api.get(`/application/getbyjob/${job._id}`);
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applicants', err);
    } finally {
      setLoadingApp(false);
    }
  };

  const updateApplicantStatus = async (applicationId, status) => {
    try {
      const res = await api.put(`/application/updatestatus/${applicationId}`, { status });
      if (res.data.success) {
        setStatusMsg(`Status updated to "${status}"`);
        setApplications((prev) =>
          prev.map((app) => (app._id === applicationId ? { ...app, Status: status, status } : app))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2 font-mono-meta">
          <Briefcase className="w-3.5 h-3.5 text-blue-700" /> Recruiter Management
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-sans">Posted Tech Jobs</h1>
        <p className="text-xs text-slate-500">Review posted listings and manage candidate applications</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="nexus-card p-5 rounded-xl h-36 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="nexus-card p-12 rounded-xl text-center max-w-md mx-auto">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">No Jobs Published Yet</h3>
          <p className="text-xs text-slate-500 mb-5 font-normal">Create your first job listing to receive applications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const company = job.company || {};
            return (
              <div 
                key={job._id} 
                className="nexus-card nexus-card-hover rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-md" />
                        ) : (
                          <Building2 className="w-5 h-5 text-blue-700" />
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold font-mono-meta text-slate-500 uppercase tracking-wider block">
                          {company.name || 'Company'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 font-sans line-clamp-1">{job.title}</h3>
                      </div>
                    </div>
                    <span className="nexus-badge-blue shrink-0">
                      {job.jobType || 'Full-time'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono-meta text-slate-500 mb-4 flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-emerald-700"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> ${job.salary ? job.salary.toLocaleString() : '120k'}/yr</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.locations || 'Remote'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono-meta text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {job.position || 1} Openings
                  </span>

                  <button
                    onClick={() => openApplicantsModal(job)}
                    className="btn-nexus-primary text-xs flex items-center gap-1.5 rounded-md"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Applicants
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Applicants */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="nexus-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl p-6 relative text-slate-900">
            
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1 font-sans">Candidate Applications</h2>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Review applicants for <span className="text-blue-700 font-bold">{selectedJob.title}</span>
            </p>

            {statusMsg && (
              <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            {loadingApp ? (
              <div className="py-12 text-center text-xs font-mono-meta text-slate-500">Fetching candidate roster...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-normal">
                No candidates have applied to this job listing yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {applications.map((app) => {
                  const applicant = app.applicant || {};
                  const currentStatus = app.Status || app.status || 'pending';

                  return (
                    <div 
                      key={app._id}
                      className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 font-sans">{applicant.fullname || 'Candidate'}</h4>
                        <p className="text-xs font-mono-meta text-slate-500">{applicant.email} • {applicant.phoneNumber || 'No Phone'}</p>
                        {applicant.profile?.skills && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {applicant.profile.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono-meta bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateApplicantStatus(app._id, 'accepted')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono-meta flex items-center gap-1 transition-colors ${
                            currentStatus.toLowerCase() === 'accepted'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                        </button>

                        <button
                          onClick={() => updateApplicantStatus(app._id, 'rejected')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono-meta flex items-center gap-1 transition-colors ${
                            currentStatus.toLowerCase() === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
