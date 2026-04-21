import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ChevronRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-dark-900 tracking-tight mb-2">
              <span className="text-primary-600">Time</span>Sync
            </h1>
            <p className="text-slate-500">Intelligent Scheduling Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 bg-white/50 focus:bg-white"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 bg-white/50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2 h-12 shadow-lg shadow-primary-500/30"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              {!isLoading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Use <strong className="text-slate-700">admin@example.com</strong> / <strong className="text-slate-700">password123</strong> for Admin access
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
