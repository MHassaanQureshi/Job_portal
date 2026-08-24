import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  LogOut, 
  PlusCircle, 
  Building2, 
  FileText, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#1E3A8A] text-white border-b border-blue-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Job<span className="text-blue-300">Nexus</span>
              </span>
              <span className="text-[10px] font-mono-meta tracking-wider text-blue-200 uppercase hidden sm:inline-block">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-blue-900/80 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
              }`}
            >
              Explore Jobs
            </Link>

            {user && user.role === 'recruiter' && (
              <>
                <Link
                  to="/admin/companies"
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/admin/companies') 
                      ? 'bg-blue-900/80 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-300" /> Companies
                </Link>
                <Link
                  to="/admin/post-job"
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/admin/post-job') 
                      ? 'bg-blue-900/80 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" /> Post Job
                </Link>
              </>
            )}

            {user && user.role === 'student' && (
              <Link
                to="/applications"
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/applications') 
                    ? 'bg-blue-900/80 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" /> Applications
              </Link>
            )}
          </div>

          {/* Right Action / Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-md bg-blue-900/60 hover:bg-blue-900 border border-blue-700/50 transition-all text-xs"
                >
                  <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold font-mono-meta text-xs">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-white max-w-[120px] truncate">{user.fullname}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-md bg-white border border-slate-200 shadow-lg p-1.5 z-50 text-slate-900">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullname}</p>
                      <p className="text-[11px] font-mono-meta text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-all"
                    >
                      <User className="w-4 h-4 text-blue-700" /> Profile & Resume
                    </Link>

                    {user.role === 'student' && (
                      <Link
                        to="/applications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-all"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" /> My Applications
                      </Link>
                    )}

                    {user.role === 'recruiter' && (
                      <Link
                        to="/admin/jobs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-all"
                      >
                        <Briefcase className="w-4 h-4 text-blue-700" /> Posted Jobs
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-100 hover:text-white rounded-md hover:bg-blue-800/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-nexus-emerald text-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-blue-100 hover:bg-blue-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E3A8A] border-t border-blue-800 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-semibold text-blue-100 hover:bg-blue-800"
          >
            Explore Jobs
          </Link>

          {user && user.role === 'recruiter' && (
            <>
              <Link
                to="/admin/companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-semibold text-blue-100 hover:bg-blue-800"
              >
                Companies
              </Link>
              <Link
                to="/admin/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-semibold text-blue-100 hover:bg-blue-800"
              >
                Post Job
              </Link>
            </>
          )}

          {user && user.role === 'student' && (
            <Link
              to="/applications"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-xs font-semibold text-blue-100 hover:bg-blue-800"
            >
              My Applications
            </Link>
          )}

          {user ? (
            <div className="pt-2 border-t border-blue-800 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-semibold text-blue-200"
              >
                Profile & Resume
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-xs font-semibold text-rose-300 hover:bg-rose-900/40"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-blue-800 flex flex-col gap-1.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-white rounded-md border border-blue-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-nexus-emerald w-full py-2 text-center text-xs font-semibold"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
