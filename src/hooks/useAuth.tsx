
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getSecureRedirectUrl, validateAuthInput, cleanupAuthState } from '@/utils/secureAuth';
import { sanitizeErrorMessage } from '@/utils/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Enhanced session handling
        if (event === 'SIGNED_OUT') {
          // Clean up any remaining auth state
          setTimeout(() => {
            cleanupAuthState();
          }, 100);
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // Enhanced input validation with security checks
      const validation = validateAuthInput(email, password);
      if (!validation.isValid) {
        return { error: { message: validation.errors.join(', ') } };
      }

      const redirectUrl = getSecureRedirectUrl();
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          // Enhanced security options
          data: {
            email_confirm_timeout: 3600, // 1 hour OTP expiration
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        return { error: { message: sanitizeErrorMessage(error) } };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { error: { message: sanitizeErrorMessage(err) } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Enhanced input validation with security checks
      const validation = validateAuthInput(email, password);
      if (!validation.isValid) {
        return { error: { message: validation.errors.join(', ') } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('SignIn error:', error);
        return { error: { message: sanitizeErrorMessage(error) } };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected signin error:', err);
      return { error: { message: sanitizeErrorMessage(err) } };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out with enhanced security
      await supabase.auth.signOut({ 
        scope: 'global' 
      });
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('SignOut error:', sanitizeErrorMessage(error));
      // Force redirect even if signout fails
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
