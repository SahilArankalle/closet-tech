
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

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password.trim()) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
