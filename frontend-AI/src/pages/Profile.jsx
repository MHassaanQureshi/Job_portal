import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { Mail, Phone, FileText, CheckCircle2, Edit3, Save, AlertCircle, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [skills, setSkills] = useState((user?.profile?.skills || []).join(', '));
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      setMsg('');

      const res = await api.post('/user/profile/update', {
        fullname,
        phoneNumber,
        bio,
        skills,
      });

      if (res.data.success) {
        setMsg('Profile updated successfully!');
        updateUserProfile({
          bio,
          skills: skills.split(',').map(s => s.trim()),
        });
        setEditing(false);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const skillsList = user?.profile?.skills || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Header Profile Card */}
      <div className="nexus-card rounded-xl p-6 relative overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          
          {/* Avatar */}
          <div className="w-16 h-16 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center text-xl font-bold shrink-0 font-mono-meta">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-sans">{user?.fullname || 'Candidate Account'}</h1>
                <span className="nexus-badge-blue mt-1 inline-block uppercase">
                  {user?.role || 'student'}
                </span>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="btn-nexus-secondary text-xs flex items-center gap-1.5 self-center sm:self-auto rounded-md"
              >
                <Edit3 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <p className="text-xs text-slate-600 font-normal leading-relaxed">
              {user?.profile?.bio || 'Software engineer candidate on JobNexus.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-mono-meta text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-700" /> {user?.email}</span>
              {user?.phoneNumber && (
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user?.phoneNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {msg && (
        <div className="mb-5 p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Edit Form or Skills View */}
      {editing ? (
        <div className="nexus-card p-6 rounded-xl">
          <h2 className="text-sm font-bold text-slate-900 mb-4 font-sans uppercase tracking-wider">Update Profile Information</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="nexus-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="nexus-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="nexus-input w-full text-xs"
                placeholder="Brief summary of engineering background and core skills..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, PostgreSQL, AWS"
                className="nexus-input w-full text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-nexus-primary text-xs font-bold flex items-center gap-1.5 rounded-md"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Panel */}
          <div className="nexus-card p-5 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2 font-sans">
              <Sparkles className="w-4 h-4 text-blue-700" /> Technical Skills
            </h3>
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono-meta font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No skills added yet. Click 'Edit Profile' to add technical skills.</p>
            )}
          </div>

          {/* Resume & Documents */}
          <div className="nexus-card p-5 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2 font-sans">
              <FileText className="w-4 h-4 text-emerald-600" /> Verified Candidate Status
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-xs text-slate-900 font-bold font-sans">Account Verification</span>
              <p className="text-xs text-emerald-700 font-mono-meta flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Active Candidate Profile
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
