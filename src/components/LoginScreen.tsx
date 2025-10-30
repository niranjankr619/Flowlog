import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../lib/AppContext';
import { EquilibriumIcon } from './EquilibriumIcon';

export const LoginScreen = () => {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setCurrentScreen('home');
  };

  const handleSSOLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCurrentScreen('home');
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
                letterSpacing: '0.2em',
              }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Welcome to <span style={{ fontWeight: 700 }}>FLOW<span style={{ 
                background: 'linear-gradient(135deg, #4B5CFB 0%, #00C7B7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>LOG</span></span>
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-sm" 
              style={{ letterSpacing: '0.05em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Track Time. Master Flow.
            </motion.p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input-background border-border"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setCurrentScreen('forgot-password')}
                className="text-muted-foreground/60 hover:text-primary hover:underline transition-colors text-[14px]"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* SSO Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSSOLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue with The Process SSO
          </Button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentScreen('create-account')}
                className="text-muted-foreground/60 hover:text-primary hover:underline transition-colors text-[14px]"
              >
                Create account
              </button>
            </p>
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>


        </motion.div>
      </motion.div>
    </div>
  );
};
