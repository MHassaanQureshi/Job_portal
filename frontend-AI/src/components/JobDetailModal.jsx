import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Users, 
  Globe, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  Check
} from 'lucide-react';

export default function JobDetailModal({ job, onClose, onApplicationSuccess, isAlreadyApplied }) {
  const { user } = useAuth();
  const [applying, setApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!job) return null;

  const company = job.company || {};
  const reqList = Array.isArray(job.requirements) 
    ? job.requirements 
    : typeof job.requirements === 'string' 
      ? job.requirements.split(',').map(r => r.trim())
      : [];

  const handleApply = async () => {
    if (!user) {
      setErrorMsg('Please sign in as a student to apply for this position.');
      return;
    }

    if (user.role !== 'student') {
      setErrorMsg('Recruiter accounts cannot apply for jobs. Please sign in as a Student.');
      return;
    }

    try {
      setApplying(true);
      setErrorMsg('');
      const res = await api.post(`/application/post/${job._id}`);
      if (res.data.success) {
        setSuccessMsg('Application submitted successfully!');
        if (onApplicationSuccess) onApplicationSuccess(job._id);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company & Job Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 p-3 flex items-center justify-center shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <Building2 className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                {company.name || 'Tech Company'}
              </span>
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{job.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-medium flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.locations || 'Remote'}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.jobType || 'Full-time'}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {job.position || 1} Openings</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Salary Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Estimated Compensation</span>
            <span className="text-xl font-extrabold text-emerald-600 flex items-center gap-1">
              <DollarSign className="w-5 h-5" /> ${job.salary ? job.salary.toLocaleString() : '120,000'} / year
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Verified Position
          </span>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Role Description</h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200 font-normal">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {reqList.length > 0 && (
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Skills & Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {reqList.map((req, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-blue-600" /> {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>

          {isAlreadyApplied || successMsg ? (
            <button
              disabled
              className="px-6 py-3 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-2 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Submitted
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="btn-emerald px-8 py-3 text-xs font-bold flex items-center gap-2"
            >
              {applying ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Apply Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
