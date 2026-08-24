import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { FileText, Building2, MapPin, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/application/getuser');
        if (res.data.success) {
          setApplications(res.data.applications || []);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'accepted') {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono-meta font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono-meta font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 shrink-0">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
        </span>
      );
    }
    return (
      <span className="nexus-badge-amber shrink-0 flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-600" /> Under Review
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2 font-mono-meta">
          <FileText className="w-3.5 h-3.5 text-blue-700" /> Candidate Applications
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-sans">Submitted Job Applications</h1>
        <p className="text-xs text-slate-500 mt-1">Track the review process for submitted applications</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="nexus-card p-5 rounded-xl h-20 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="nexus-card p-12 rounded-xl text-center max-w-md mx-auto">
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1 font-sans">No Submitted Applications</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-normal">You haven't submitted any job applications yet.</p>
          <Link to="/" className="btn-nexus-primary text-xs rounded-md">
            Explore Open Positions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const job = app.job || {};
            const company = job.company || {};
            const appliedDate = app.createdAt 
              ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recently';

            return (
              <div 
                key={app._id} 
                className="nexus-card nexus-card-hover rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-md" />
                    ) : (
                      <Building2 className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold font-mono-meta text-slate-500 uppercase tracking-wider block">
                      {company.name || 'Company'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-sans">{job.title || 'Position'}</h3>
                    <div className="flex items-center gap-3 text-xs font-mono-meta text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.locations || 'Remote'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> Applied {appliedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {getStatusBadge(app.Status || app.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
