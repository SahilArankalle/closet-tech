
import React, { useState } from 'react';
import { Crown, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { checkAuthRateLimit, checkOTPRateLimit, cleanupAuthState, checkPasswordStrength } from '../utils/secureAuth';
import { sanitizeErrorMessage } from '../utils/security';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Password strength checking
  React.useEffect(() => {
    if (!isLogin && password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced rate limiting check
    const clientIdentifier = email || 'anonymous';
    if (!checkAuthRateLimit(clientIdentifier)) {
      setError('Too many login attempts. Please wait 15 minutes before trying again.');
      return;
    }

    // Additional OTP rate limiting for signup
    if (!isLogin && !checkOTPRateLimit(clientIdentifier)) {
      setError('Too many signup attempts. Please wait 10 minutes before trying again.');
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
        // Enhanced error handling with security considerations
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
        } else if (error.message?.includes('Password should be')) {
          setError('Password does not meet security requirements. Please choose a stronger password.');
        } else if (error.message?.includes('weak_password')) {
          setError('This password is too weak or commonly used. Please choose a stronger password.');
        } else {
          setError(sanitizedError);
        }
      } else if (!isLogin) {
        setSuccessMessage('🎉 Welcome to ClosetIQ! We\'ve sent a confirmation link to your email. Please check your inbox and click the link to activate your account. The link will expire in 1 hour for security.');
        // Clear form on successful signup
        setEmail('');
        setPassword('');
        setPasswordStrength({ score: 0, feedback: [] });
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
    setPasswordStrength({ score: 0, feedback: [] });
  };

  // Enhanced input validation
  const isEmailValid = email.includes('@') && email.includes('.') && email.length > 5;
  const isPasswordValid = isLogin ? password.length >= 6 : password.length >= 8 && passwordStrength.score >= 4;
  const isFormValid = isEmailValid && isPasswordValid;

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    if (score <= 5) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Fair';
    if (score <= 5) return 'Good';
    return 'Strong';
  };

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

          {/* Security Notice for Signup */}
          {!isLogin && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-blue-700 text-sm">
                  <p className="font-medium mb-1">Enhanced Security</p>
                  <p>We've implemented additional security measures including password leak protection and secure OTP handling.</p>
                </div>
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
                  minLength={isLogin ? 6 : 8}
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
              
              {/* Password Strength Indicator for Signup */}
              {!isLogin && password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600">Password Strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 4 ? 'text-yellow-600' :
                      passwordStrength.score <= 5 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="text-xs text-slate-600 space-y-1">
                      {passwordStrength.feedback.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
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
