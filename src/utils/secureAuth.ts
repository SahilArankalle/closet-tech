
import { checkRateLimit, sanitizeErrorMessage } from './security';

export const getSecureRedirectUrl = (): string => {
  // Get the current origin for redirect
  const origin = window.location.origin;
  
  // Only allow specific domains in production
  const allowedDomains = [
    'localhost:3000',
    'closet-tech.lovable.app'
  ];
  
  // Extract hostname for validation
  const hostname = new URL(origin).hostname;
  const port = new URL(origin).port;
  const hostnameWithPort = port ? `${hostname}:${port}` : hostname;
  
  // Validate the domain
  const isAllowedDomain = allowedDomains.some(domain => 
    hostnameWithPort === domain || hostname.endsWith('.lovable.app')
  );
  
  if (!isAllowedDomain) {
    console.warn('Redirect URL validation failed for:', origin);
    // In case of validation failure, use a safe default
    return 'https://closet-tech.lovable.app/';
  }
  
  return `${origin}/`;
};

export const validateAuthInput = (email: string, password: string) => {
  const errors: string[] = [];

  // Enhanced email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  } else if (email.length > 254) {
    errors.push('Email address is too long');
  }
  
  // Check for suspicious email patterns
  if (/<script|javascript:|data:/gi.test(email)) {
    errors.push('Email contains invalid characters');
  }

  // Enhanced password validation
  if (!password.trim()) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Please choose a stronger password');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting for authentication attempts
export const checkAuthRateLimit = (identifier: string): boolean => {
  return checkRateLimit(`auth_${identifier}`, 5, 300000); // 5 attempts per 5 minutes
};

// Session security helpers
export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Clean up auth state with enhanced security
export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log('Auth state cleaned up successfully');
  } catch (error) {
    console.warn('Error during auth state cleanup:', sanitizeErrorMessage(error));
  }
};
