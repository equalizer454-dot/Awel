/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (user: User) => void;
  addToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

export default function Auth({
  onLoginSuccess,
  onRegisterSuccess,
  addToast,
}: AuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [termsAgreement, setSignupTerms] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Compute password strength (score 0-4)
  const calcPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const getStrengthLabelAndColor = (score: number) => {
    switch (score) {
      case 0:
        return { label: 'Enter a password', color: 'text-zinc-400' };
      case 1:
        return { label: 'Too weak', color: 'text-red-500' };
      case 2:
        return { label: 'Fair strength', color: 'text-yellow-600' };
      case 3:
        return { label: 'Good standard', color: 'text-indigo-500' };
      case 4:
        return { label: 'Strong standard 🔒', color: 'text-accent' };
      default:
        return { label: '', color: '' };
    }
  };

  const strengthScore = calcPasswordStrength(signupPass);
  const strengthMeta = getStrengthLabelAndColor(strengthScore);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass.trim()) {
      addToast('Please fill in email and password credentials.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Look up in registered users array in localStorage
      const savedUsers: User[] = JSON.parse(localStorage.getItem('aura_users') || '[]');
      
      // Seed default admin and user if empty
      const defaultUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@awelfashion.com',
        joinDate: 'May 2026',
        password: 'password123',
      };

      const userList = savedUsers.length ? savedUsers : [defaultUser];
      const match = userList.find(
        (u) =>
          u.email.toLowerCase() === loginEmail.toLowerCase().trim() &&
          u.password === loginPass
      );

      setLoading(false);

      if (match) {
        onLoginSuccess(match);
        addToast(`Welcome back, ${match.firstName}! 🎉`, 'success');
      } else {
        addToast('Incorrect credentials. Please verify and try again.', 'error');
      }
    }, 700);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupFirst.trim() ||
      !signupLast.trim() ||
      !signupEmail.trim() ||
      !signupPass.trim() ||
      !signupConfirm.trim()
    ) {
      addToast('Please fill in all directory credentials.', 'error');
      return;
    }

    if (signupPass.length < 6) {
      addToast('Password must consist of at least 6 characters.', 'error');
      return;
    }

    if (signupPass !== signupConfirm) {
      addToast('Confirm password does not match.', 'error');
      return;
    }

    if (!termsAgreement) {
      addToast('You must accept terms of service to continue registration.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const savedUsers: User[] = JSON.parse(localStorage.getItem('aura_users') || '[]');
      const alreadyRegistered = savedUsers.find(
        (u) => u.email.toLowerCase() === signupEmail.toLowerCase().trim()
      );

      if (alreadyRegistered) {
        setLoading(false);
        addToast('This email is already associated with an active member.', 'error');
        return;
      }

      const newUser: User = {
        firstName: signupFirst.trim(),
        lastName: signupLast.trim(),
        email: signupEmail.toLowerCase().trim(),
        password: signupPass,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };

      savedUsers.push(newUser);
      localStorage.setItem('aura_users', JSON.stringify(savedUsers));

      setLoading(false);
      onRegisterSuccess(newUser);
      addToast(`Registration complete! Welcome to Awel Fashion, ${newUser.firstName}! ✨`, 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex select-none overflow-hidden relative font-body text-zinc-200">
      
      {/* Decorative Blur Blobs background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-accent/15 blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none z-0" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 relative z-10 min-h-screen">
        
        {/* ===== LEFT BRAND DETAILS PANEL ===== */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-12 border-r border-zinc-800 relative overflow-hidden select-none">
          <div className="absolute bottom-[-50px] left-[-20px] text-zinc-800/10 font-heading font-black text-8xl leading-none italic pointer-events-none select-none tracking-tighter">
            Awel Fashion
          </div>

          {/* Logo brand */}
          <span
            onClick={() => onLoginSuccess({ firstName: '', lastName: '', email: '', joinDate: '' })} // custom back trigger
            className="font-heading font-black text-xl tracking-[0.25em] h-fit cursor-pointer text-white hover:text-accent duration-250 select-none"
          >
            Awel Fashion<span className="text-accent italic font-light font-sans ml-1 text-xs">Club</span>
          </span>

          <div className="max-w-[420px] space-y-8 my-auto">
            <h1 className="font-heading font-black text-3xl xl:text-5xl leading-tight text-white mb-2 uppercase tracking-wide">
              Elevate your<br />wardrobe journey.
            </h1>
            <p className="text-zinc-550 leading-relaxed text-sm md:text-base">
              Join the elite Awel Fashion club and unlock exclusive points conversion rewards, custom Milan-made drop alerts, and VIP appointments.
            </p>
            <ul className="flex flex-col gap-4 font-heading font-extrabold text-white text-xs tracking-wider uppercase">
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-gem text-accent bg-accent/10 border border-accent/20 w-8 h-8 rounded-md flex items-center justify-center text-sm shadow-inner" />
                VIP Loyalty points on purchases
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-truck-fast text-accent bg-accent/10 border border-accent/20 w-8 h-8 rounded-md flex items-center justify-center text-sm shadow-inner" />
                Complimentary Shipping from Br 150
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-rotate-left text-accent bg-accent/10 border border-accent/20 w-8 h-8 rounded-md flex items-center justify-center text-sm shadow-inner" />
                Hassle-free 30-day return portal
              </li>
            </ul>
          </div>

          <div className="text-xs pt-4 select-none">
            <span
              onClick={() => onLoginSuccess({ firstName: '', lastName: '', email: '', joinDate: '' })}
              className="text-zinc-500 hover:text-accent font-semibold transition-colors duration-250 inline-flex items-center gap-1.5 cursor-pointer lowercase"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" /> back to boutique catalog
            </span>
          </div>
        </div>

        {/* ===== RIGHT INTERACTIVE FORM GATEWAY PANEL ===== */}
        <div className="flex items-center justify-center p-4 py-8 bg-zinc-950 lg:bg-zinc-50 dark:bg-zinc-950">
          
          <div className="relative bg-zinc-900 lg:bg-white dark:lg:bg-zinc-900 border border-zinc-800 lg:border-zinc-100 dark:lg:border-zinc-805 rounded-2xl w-full max-w-sm md:max-w-md p-6 sm:p-10 shadow-2xl flex flex-col items-stretch animate-fade-slide-up">
            
            {/* X Dismiss Button */}
            <button
              onClick={() => onLoginSuccess({ firstName: '', lastName: '', email: '', joinDate: '' })}
              className="absolute top-4 right-4 text-zinc-400 hover:text-accent lg:text-zinc-400 lg:hover:text-zinc-900 dark:lg:text-zinc-500 dark:lg:hover:text-white duration-200 cursor-pointer p-1.5 focus:outline-none z-20"
              aria-label="Close"
              id="auth-close-btn"
            >
              <i className="fa-solid fa-xmark text-lg md:text-xl" />
            </button>

            {/* Tabs Selector Navigation Switch */}
            <div className="relative bg-zinc-800 lg:bg-zinc-100 dark:lg:bg-zinc-950 p-[4px] rounded-lg mb-8 flex select-none font-heading font-extrabold text-xs tracking-wider uppercase h-fit gap-0 shadow-inner">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 rounded-md outline-none cursor-pointer duration-300 z-10 text-center
                  ${
                    activeTab === 'login'
                      ? 'bg-zinc-900 lg:bg-white dark:lg:bg-zinc-900 text-white lg:text-zinc-900 dark:lg:text-white font-extrabold shadow'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-100 lg:hover:text-zinc-700'
                  }
                `}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 rounded-md outline-none cursor-pointer duration-300 z-10 text-center
                  ${
                    activeTab === 'signup'
                      ? 'bg-zinc-900 lg:bg-white dark:lg:bg-zinc-900 text-white lg:text-zinc-900 dark:lg:text-white font-extrabold shadow'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-100 lg:hover:text-zinc-700'
                  }
                `}
              >
                Create Account
              </button>
            </div>

            {/* ── Tab 1: MEMBER SIGN IN ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <h2 className="font-heading font-black text-xl md:text-2xl text-white lg:text-zinc-900 dark:lg:text-white uppercase leading-none tracking-wide mb-1 select-none">
                    Welcome Back Description
                  </h2>
                  <p className="text-zinc-450 dark:text-zinc-500 text-xs md:text-sm font-semibold select-none">
                    Sign in to track orders, history, and Loyalty conversion
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="loginEmail" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                      <i className="fa-solid fa-envelope text-accent/80 mr-1 text-[11px]" /> Email Address
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="loginPass" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                      <i className="fa-solid fa-lock text-accent/80 mr-1 text-[11px]" /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        id="loginPass"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-accent duration-200 cursor-pointer h-fit padding-0.5"
                      >
                        <i className={`fa-solid ${showLoginPass ? 'fa-eye-slash' : 'fa-eye'} text-xs md:text-sm`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="auth-remember-row select-none">
                  <label className="auth-checkbox-label">
                    <input type="checkbox" className="mr-1.5 focus:accent-accent w-4 h-4 cursor-pointer" /> Remember session
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast('Reset link dispatched! Make sure to verify your inbox secondary folders.', 'info');
                    }}
                    className="auth-forgot-link pl-1 h-fit"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-accent text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-60 transition-colors shadow-md text-center"
                >
                  {loading ? (
                    <>
                      Authenticating... <i className="fa-solid fa-spinner fa-spin ml-1" />
                    </>
                  ) : (
                    <>
                      Sign In Boutique <i className="fa-solid fa-arrow-right-to-bracket ml-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── Tab 2: CREATE CLUB ACCOUNT ── */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div>
                  <h2 className="font-heading font-black text-xl md:text-2xl text-white lg:text-zinc-900 dark:lg:text-white uppercase leading-none tracking-wide mb-1 select-none">
                    Join Awel Club
                  </h2>
                  <p className="text-zinc-455 dark:text-zinc-500 text-xs md:text-sm font-semibold select-none">
                    Register a free membership to earn point rewards
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label htmlFor="signupFirst" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="signupFirst"
                        value={signupFirst}
                        onChange={(e) => setSignupFirst(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full px-3 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="signupLast" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="signupLast"
                        value={signupLast}
                        onChange={(e) => setSignupLast(e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full px-3 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupEmail" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="signupEmail"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="w-full px-4 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupPass" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPass ? 'text' : 'password'}
                        id="signupPass"
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full px-4 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPass(!showSignupPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-accent duration-200 cursor-pointer h-fit padding-0.5"
                      >
                        <i className={`fa-solid ${showSignupPass ? 'fa-eye-slash' : 'fa-eye'} text-xs md:text-sm`} />
                      </button>
                    </div>

                    {/* Live Password strength index meter */}
                    {signupPass.length > 0 && (
                      <div className="flex items-center gap-3 pt-1.5 select-none animate-fade-slide-up">
                        <div className="flex gap-[4px] flex-1 max-w-[120px]">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full ${
                                i < strengthScore
                                  ? strengthScore === 1
                                    ? 'bg-red-500'
                                    : strengthScore === 2
                                    ? 'bg-yellow-500'
                                    : strengthScore === 3
                                    ? 'bg-indigo-500'
                                    : 'bg-accent'
                                  : 'bg-zinc-800 dark:bg-zinc-200/10'
                              } transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold bg-zinc-900 lg:bg-zinc-100 p-1 md:p-1.5 rounded-sm uppercase tracking-wider ${strengthMeta.color}`}>
                          {strengthMeta.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupConfirm" className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest pl-1 leading-none select-none">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        id="signupConfirm"
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 border border-zinc-800 lg:border-zinc-200 dark:lg:border-zinc-800 rounded-sm bg-zinc-900 lg:bg-zinc-50 dark:lg:bg-zinc-950 text-xs md:text-sm text-white lg:text-zinc-900 dark:lg:text-white outline-none focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-accent duration-200 cursor-pointer h-fit padding-0.5"
                      >
                        <i className={`fa-solid ${showConfirmPass ? 'fa-eye-slash' : 'fa-eye'} text-xs md:text-sm`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 select-none">
                  <label className="auth-checkbox-label auth-terms-label">
                    <input
                      type="checkbox"
                      checked={termsAgreement}
                      onChange={(e) => setSignupTerms(e.target.checked)}
                      className="mr-1.5 focus:accent-accent w-4 h-4 cursor-pointer"
                    />
                    I agree to the <a href="#" onClick={(e) => { e.preventDefault(); addToast('Showing Terms details! 📜', 'info'); }} className="underline font-bold text-accent">Terms & Condition covenants</a> of Awel Club.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-accent text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-60 transition-colors shadow-md text-center"
                >
                  {loading ? (
                    <>
                      Registering member... <i className="fa-solid fa-spinner fa-spin ml-1" />
                    </>
                  ) : (
                    <>
                      Create account membership <i className="fa-solid fa-user-plus ml-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
