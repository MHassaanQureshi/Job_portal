import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { Briefcase, Mail, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await api.post('/user/login', {
        email,
        password,
        role,
      });

      if (res.data.success) {
        const userData = res.data.user || {
          email,
          role,
          fullname: email.split('@')[0],
        };
        loginUser(userData);
        navigate(role === 'recruiter' ? '/admin/companies' : '/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
      <div className="nexus-card w-full max-w-md p-8 rounded-xl relative">
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Account Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your account to manage job applications</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-md border border-slate-200 mb-6 font-mono-meta">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-1.5 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-[#1E3A8A] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`py-1.5 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 ${
              role === 'recruiter'
                ? 'bg-[#1E3A8A] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Recruiter
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nexus-input w-full pl-9 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 font-sans">Password</label>
              <a href="#" className="text-[11px] font-mono-meta text-blue-700 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="nexus-input w-full pl-9 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-nexus-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-5 rounded-md"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-normal">
            Need an account?{' '}
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
