import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Database, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CDUP</h1>
              <p className="text-primary-200 text-sm">Customer Data Update Portal</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Streamline Customer<br />Data Updates
          </h2>
          <p className="text-primary-100 text-lg max-w-md">
            Transform hours of manual processing into minutes with our automated, secure, and auditable data management platform.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: 'Processing Time', value: '3-5 min', sub: 'vs 5-7 hours' },
              { label: 'Accuracy Rate', value: '99.9%', sub: 'automated validation' },
              { label: 'Audit Trail', value: '100%', sub: 'full compliance' },
              { label: 'Uptime', value: '99.95%', sub: 'enterprise grade' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-200 text-xs">{stat.label}</p>
                <p className="text-primary-300 text-[10px]">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-300 text-sm">
          Secure banking operations platform
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CDUP</h1>
              <p className="text-gray-500 text-xs">Customer Data Update Portal</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Admin: <code className="bg-blue-100 px-1 rounded">admin / Admin@123</code></p>
              <p>Supervisor: <code className="bg-blue-100 px-1 rounded">supervisor1 / Super@123</code></p>
              <p>Agent: <code className="bg-blue-100 px-1 rounded">agent1 / Agent@123</code></p>
              <p>Engineer: <code className="bg-blue-100 px-1 rounded">engineer1 / Eng@123</code></p>
              <p>Auditor: <code className="bg-blue-100 px-1 rounded">auditor1 / Audit@123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
