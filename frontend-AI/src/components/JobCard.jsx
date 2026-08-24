import React from 'react';
import { MapPin, DollarSign, ArrowUpRight, CheckCircle2, Clock, Building2 } from 'lucide-react';

// Varied background colors for initials avatars
const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-indigo-600',
  'bg-slate-700',
  'bg-teal-600',
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let charCodeSum = 0;
  for (let i = 0; i < name.length; i++) {
    charCodeSum += name.charCodeAt(i);
  }
  return AVATAR_COLORS[charCodeSum % AVATAR_COLORS.length];
};

export default function JobCard({ job, onSelectJob, isApplied }) {
  const companyName = job?.company?.name || 'Stripe';
  const companyLogo = job?.company?.logo;
  const companyLocation = job?.locations || job?.company?.location || 'Remote';
  
  const salaryText = job?.salary 
    ? `$${job.salary.toLocaleString()}/yr`
    : '$125,000 - $160,000/yr';

  const reqList = Array.isArray(job?.requirements) 
    ? job.requirements 
    : typeof job?.requirements === 'string' 
      ? job.requirements.split(',').map(r => r.trim())
      : ['React', 'TypeScript', 'Node.js'];

  const initialLetter = companyName.charAt(0).toUpperCase();
  const avatarBg = getAvatarColor(companyName);

  const formattedDate = job?.createdAt 
    ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '2d ago';

  return (
    <div className="nexus-card nexus-card-hover rounded-xl p-5 flex flex-col justify-between group">
      
      <div>
        {/* Header: Company & Job Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={companyName} 
                className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0" 
              />
            ) : (
              <div className={`w-10 h-10 rounded-lg ${avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono-meta`}>
                {initialLetter}
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {companyName}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          <span className="nexus-badge-blue shrink-0">
            {job.jobType || 'Full-time'}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {job.description || 'Join our engineering team to build scalable software infrastructure and user-facing digital experiences.'}
        </p>

        {/* Requirements Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {reqList.slice(0, 3).map((req, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 rounded-md text-[11px] font-mono-meta font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {req}
            </span>
          ))}
          {reqList.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-mono-meta text-slate-500 bg-slate-50 border border-slate-200">
              +{reqList.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & View Details Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-mono-meta font-bold text-emerald-700">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>{salaryText}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono-meta text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {companyLocation}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {formattedDate}</span>
          </div>
        </div>

        {isApplied ? (
          <span className="px-3 py-1.5 rounded-md text-xs font-mono-meta font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Applied
          </span>
        ) : (
          <button
            onClick={() => onSelectJob(job)}
            className="btn-nexus-emerald text-xs flex items-center gap-1 rounded-md"
          >
            Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
