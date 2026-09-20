'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Lock, Mail, Phone, User as UserIcon, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, authModalRedirect, login, signup, loginDemoUser, setCheckoutModalOpen } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    login(email, password);
    handlePostAuth();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit phone number.');
      return;
    }
    signup(name, email, phone, password);
    handlePostAuth();
  };

  const handleDemoClick = () => {
    loginDemoUser();
    handlePostAuth();
  };

  const handlePostAuth = () => {
    setError(null);
    setAuthModalOpen(false);
    if (authModalRedirect === 'checkout') {
      setCheckoutModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#332C26]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-[#F8F5EE] rounded-3xl shadow-2xl border border-[#DFD7C7] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6459] hover:text-[#332C26] hover:bg-[#E9E1D3] transition cursor-pointer"
          aria-label="Close authentication"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Stamp */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg border-2 border-[#B89A52]/50 bg-[#332C26]">
            <Image
              src="/assets/brand/shoplogo_circular.png"
              alt="ACR Cottons Logo"
              fill
              unoptimized
              sizes="80px"
              className="object-contain"
            />
          </div>
          <h2 className="font-serif text-2xl text-[#332C26] font-normal">
            {mode === 'login' ? 'Patron Sign In' : 'Create Patron Account'}
          </h2>
          <p className="text-xs text-[#6E6459] mt-1 font-light">
            {authModalRedirect === 'checkout'
              ? 'Please sign in to proceed with your luxury bedding order.'
              : 'Access saved addresses, order status, and bespoke weave commissions.'}
          </p>
        </div>

        {/* One-Click Quick Demo Login Button */}
        <div className="mb-6 p-3 bg-[#E9E1D3] rounded-2xl border border-[#B89A52]/40 text-center">
          <span className="text-[11px] font-semibold text-[#332C26] block mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B89A52]" />
            Instant Evaluation Access
          </span>
          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full py-2 px-4 rounded-full bg-[#B89A52] hover:bg-[#9C803E] text-[#F8F5EE] text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            One-Click Demo Login (Raj Kumar)
          </button>
          <span className="block text-[10px] text-[#6E6459] mt-1">
            Pre-loaded with Erode showroom addresses & sample records
          </span>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#DFD7C7] w-full"></div>
          <span className="bg-[#F8F5EE] px-3 text-[10px] uppercase tracking-widest text-[#6E6459]">
            Or with your credentials
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="email"
                  required
                  placeholder="patron@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-md mt-2 cursor-pointer"
            >
              Sign In
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-xs text-[#6E6459] hover:text-[#332C26] underline cursor-pointer"
              >
                New patron? Create an account
              </button>
            </div>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Phone Number (for COD & Delivery)
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                Create Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-[#6E6459]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl pl-10 pr-4 py-2 text-xs text-[#332C26] outline-none focus:border-[#B89A52] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-md mt-2 cursor-pointer"
            >
              Complete Registration
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-xs text-[#6E6459] hover:text-[#332C26] underline cursor-pointer"
              >
                Already registered? Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
