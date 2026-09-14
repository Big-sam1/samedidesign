import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../utils/adminAuth';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../contexts/StoreContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { activateAdminSession } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      activateAdminSession();
      navigate('/admin', { replace: true });
    } catch {
      setError('Could not sign in with Supabase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="relative w-full max-w-md">
        {/* Logo card */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white mb-4">
            <img
              src="/samed-design-logo.png"
              alt="Samedi design"
              className="h-14 w-14 rounded-2xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Samedi Admin</h1>
          <p className="mt-1 text-slate-500 text-sm">Management Portal — Restricted Access</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <ShieldCheckIcon className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Administrator Login</h2>
              <p className="text-xs text-slate-500">Enter your admin credentials below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samedidesign@gmail.com"
                  required
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="h-4 w-4" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Not an administrator?{' '}
              <a href="/" className="font-semibold text-slate-700 hover:underline">
              Go to store
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Samedi design · Nyamirambo Biryogo, Kigali · Rwanda
        </p>
      </div>
    </div>
  );
}
