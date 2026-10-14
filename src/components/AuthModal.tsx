import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, CheckCircle2, ArrowRight, AlertCircle, LogIn } from 'lucide-react';
import { User as UserType, Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login / Signup Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+965 ');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');

  const isAr = language === 'ar';

  const resetErrors = () => {
    setDuplicateError(false);
    setLoginErrorMsg('');
  };

  const handleSwitchToLogin = (prefilledEmail?: string) => {
    resetErrors();
    setAuthMode('login');
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Handle Password Reset
      if (authMode === 'forgot') {
        setSuccessMsg(
          isAr 
            ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.' 
            : 'Password reset link sent to your email.'
        );
        setTimeout(() => {
          setSuccessMsg('');
          setAuthMode('login');
        }, 2500);
        return;
      }

      // Load registered accounts from localStorage
      let existingUsers: any[] = [];
      try {
        const stored = localStorage.getItem('apextorque_users');
        if (stored) {
          existingUsers = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to parse apextorque_users from localStorage:', err);
      }

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = phone.trim().replace(/\s+/g, '');

      // Handle SIGN-UP
      if (authMode === 'signup') {
        const isDuplicate = existingUsers.some((u: any) => {
          const userEmail = u.email ? u.email.trim().toLowerCase() : '';
          const userPhone = u.phone ? u.phone.trim().replace(/\s+/g, '') : '';
          return userEmail === normalizedEmail || (normalizedPhone.length > 5 && userPhone === normalizedPhone);
        });

        if (isDuplicate) {
          setDuplicateError(true);
          return;
        }

        const newUser: UserType & { password?: string } = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          password: password,
          paymentMethod: 'Cash on Arrival / Delivery',
          savedVehicles: []
        };

        const updatedUsersList = [...existingUsers, newUser];
        try {
          localStorage.setItem('apextorque_users', JSON.stringify(updatedUsersList));
        } catch (err) {
          console.error('Failed to save to apextorque_users:', err);
        }

        onLoginSuccess(newUser);
        onClose();
        return;
      }

      // Handle LOGIN
      if (authMode === 'login') {
        const matchedUser = existingUsers.find((u: any) => {
          const userEmail = u.email ? u.email.trim().toLowerCase() : '';
          return userEmail === normalizedEmail;
        });

        if (matchedUser) {
          if (matchedUser.password && matchedUser.password !== password) {
            setLoginErrorMsg(isAr ? 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 'Incorrect password. Please try again.');
            return;
          }
          onLoginSuccess(matchedUser);
          onClose();
          return;
        }

        // If no prior registered user is found in list, authenticate and persist new record
        const fallbackUser: UserType & { password?: string } = {
          id: `usr_${Date.now()}`,
          name: name.trim() || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Customer'),
          email: normalizedEmail,
          phone: phone.trim().length > 5 ? phone.trim() : '+965 9900 1234',
          paymentMethod: 'Cash on Arrival / Delivery',
          savedVehicles: []
        };

        try {
          localStorage.setItem('apextorque_users', JSON.stringify([...existingUsers, fallbackUser]));
        } catch (err) {
          console.error('Failed to save user:', err);
        }

        onLoginSuccess(fallbackUser);
        onClose();
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {authMode === 'login' && (isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign in to Apex Torque')}
                {authMode === 'signup' && (isAr ? 'إنشاء حساب عميل جديد' : 'Create Customer Account')}
                {authMode === 'forgot' && (isAr ? 'استعادة كلمة المرور' : 'Reset Your Password')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? 'إدارة حجوزات الكراج، طلبات القطع، ومتابعة الفواتير' : 'Manage your garage bookings, telemetry, and invoices'}
              </p>
            </div>

            {/* Duplicate Account Error Banner */}
            {duplicateError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl mb-4 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">
                    {isAr 
                      ? 'عذراً! يبدو أنك استخدمت هذا البريد الإلكتروني أو رقم الهاتف لحساب آخر بالفعل.' 
                      : 'Oops! Looks like you have already used this email/phone number for another account.'}
                  </span>
                </div>
                <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 font-medium">
                    {isAr ? 'هل تريد تسجيل الدخول بدلاً من ذلك؟' : 'Would you like to try signing in?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSwitchToLogin(email)}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Login Error Message */}
            {loginErrorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl text-xs flex items-center gap-2 mb-4 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginErrorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {isAr ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          resetErrors();
                        }}
                        placeholder="e.g. Faisal Al-Sabah"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        resetErrors();
                      }}
                      placeholder="client@apextorque.kw"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                {authMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        {isAr ? 'كلمة المرور' : 'Password'}
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            resetErrors();
                            setAuthMode('forgot');
                          }}
                          className="text-[11px] font-bold text-sky-600 hover:underline"
                        >
                          {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          resetErrors();
                        }}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {isAr ? 'رقم الهاتف (الكويت)' : 'Mobile (+965 Kuwait)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          resetErrors();
                        }}
                        placeholder="+965 9900 1234"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
                  ) : (
                    <>
                      <span>
                        {authMode === 'login' && (isAr ? 'دخول الحساب' : 'Sign In')}
                        {authMode === 'signup' && (isAr ? 'إنشاء حساب جديد' : 'Complete Registration')}
                        {authMode === 'forgot' && (isAr ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle Modes */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <div>
                  {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account yet? "}
                  <button
                    type="button"
                    onClick={() => {
                      resetErrors();
                      setAuthMode('signup');
                    }}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    {isAr ? 'أنشئ حساباً جديداً' : 'Sign Up Here'}
                  </button>
                </div>
              ) : (
                <div>
                  {isAr ? 'لديك حساب بالفعل؟ ' : 'Already registered? '}
                  <button
                    type="button"
                    onClick={() => {
                      resetErrors();
                      setAuthMode('login');
                    }}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Sign In Here'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
