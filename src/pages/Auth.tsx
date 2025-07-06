
import React, { useState } from 'react';
import { Crown, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { checkAuthRateLimit, cleanupAuthState } from '../utils/secureAuth';
import { sanitizeErrorMessage } from '../utils/security';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientIP = 'client'; // In production, you'd get the real IP
    if (!checkAuthRateLimit(clientIP)) {
      setError('Too many login attempts. Please wait 5 minutes before trying again.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Clean up any existing auth state before new attempt
      if (!isLogin) {
        cleanupAuthState();
      }

      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        // Sanitize and handle specific error messages
        const sanitizedError = sanitizeErrorMessage(error);
        
        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message?.includes('signup_disabled')) {
          setError('New signups are currently disabled. Please contact support.');
        } else if (error.message?.includes('rate_limit')) {
          setError('Too many attempts. Please wait a moment before trying again.');
        } else {
          setError(sanitizedError);
        }
      } else if (!isLogin) {
        setSuccessMessage('🎉 Welcome to ClosetIQ! We\'ve sent a confirmation link to your email. Please check your inbox and click the link to activate your account.');
        // Clear form on successful signup
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const sanitizedError = sanitizeErrorMessage(err);
      setError(sanitizedError || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
    // Clear form when switching modes for security
    setEmail('');
    setPassword('');
  };

  // Enhanced input validation
  const isEmailValid = email.includes('@') && email.includes('.') && email.length > 5;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-xl shadow-lg mx-auto w-fit mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent mb-2">
            ClosetIQ
          </h1>
          <p className="text-slate-600">Your Smart Wardrobe Assistant</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isLogin ? 'Sign in to access your wardrobe' : 'Join ClosetIQ to organize your style'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                  required
                  maxLength={254}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete={isLogin ? "email" : "username"}
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">Password must be at least 6 characters long</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
