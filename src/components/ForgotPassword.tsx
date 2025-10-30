import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../lib/AppContext';
import { EquilibriumIcon } from './EquilibriumIcon';

export const ForgotPassword = () => {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glass card */}
        <motion.div
          className="glass-card rounded-2xl p-8 shadow-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Back Button */}
          <button
            onClick={() => setCurrentScreen('login')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 600 }}>Back to login</span>
          </button>

          {!isSubmitted ? (
            <>
              {/* Logo */}
              <div className="text-center mb-8">
                <motion.div 
                  className="w-28 h-28 mx-auto mb-5"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <EquilibriumIcon variant="login" size={112} />
                </motion.div>
                <motion.h1 
                  className="mb-2"
                  style={{ 
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                  }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Reset <span style={{ fontWeight: 700 }}>Password</span>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-sm" 
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Enter your email and we'll send you a reset link
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Work Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input-background border-border"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 shadow-lg mt-6"
                  style={{
                    background: 'linear-gradient(135deg, #00C7B7 0%, #4B5CFB 100%)',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span style={{ fontWeight: 600 }}>Send Reset Link</span>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-secondary" strokeWidth={2} />
                </motion.div>
                
                <h2 className="mb-3" style={{ fontWeight: 700 }}>Check Your Email</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm mb-8" style={{ fontWeight: 600 }}>
                  {email}
                </p>
                
                <div 
                  className="p-4 rounded-xl mb-6 text-sm"
                  style={{
                    background: 'rgba(0, 199, 183, 0.1)',
                    border: '1px solid rgba(0, 199, 183, 0.2)',
                  }}
                >
                  <p className="text-muted-foreground">
                    <span style={{ fontWeight: 600 }}>Didn't receive it?</span> Check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <motion.button
                  onClick={() => setCurrentScreen('login')}
                  className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #00C7B7 0%, #4B5CFB 100%)',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ fontWeight: 600 }}>Back to Login</span>
                </motion.button>
              </div>
            </>
          )}

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Remember your password?{' '}
            <button
              onClick={() => setCurrentScreen('login')}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
