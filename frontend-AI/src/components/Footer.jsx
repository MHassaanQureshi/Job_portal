import React from 'react';
import { Briefcase, Globe, Share2, Code2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                Job<span className="text-blue-600">Nexus</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering talented professionals and innovating companies with trusted career opportunity matching.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Job Seekers</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Browse All Jobs</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Featured Tech Roles</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Remote Positions</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Salary Benchmarks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Employers</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Post a Tech Job</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Talent Acquisition</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Company Profiles</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Stay Informed</h4>
            <p className="text-xs text-slate-500 mb-3">Get weekly hiring trends and job updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your.email@nexus.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <button className="btn-primary px-3.5 py-2 text-xs font-semibold shrink-0">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} JobNexus Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
