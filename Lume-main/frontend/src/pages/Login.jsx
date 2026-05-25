import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password)

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-classic login-hero'>
      <div className="absolute inset-0 bg-dark/30 backdrop-blur-[2px]"></div> {/* Overlay */}

      <div className='relative z-10 w-full max-w-md px-6'>
        <div className='glass-card p-10 rounded-xl shadow-2xl'>
          <div className="text-center mb-8">
            <h2 className='text-3xl font-bold main text-text-main mb-2'>Welcome Back</h2>
            <div className="w-12 h-1 bg-accent-sage mx-auto rounded-full"></div>
            <p className="sub text-sm text-gray-500 mt-2">Sign in to access your atelier.</p>
          </div>

          <form onSubmit={handleSubmitt} className='flex flex-col gap-6'>
            {error && <div className='bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100'>{error}</div>}

            <div className='space-y-2'>
              <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600'>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='input-classic bg-white/80'
                placeholder="you@example.com"
              />
            </div>

            <div className='space-y-2'>
              <div className="flex justify-between items-center">
                <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600'>Password</label>
                <Link to='/forgot-password' className='text-xs text-accent-dark hover:text-accent-sage transition-colors'>Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='input-classic bg-white/80'
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className='btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2'
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Access Account</span>}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className='text-sm text-gray-500'>
              New to Lume? <Link to='/register' className='font-bold text-accent-dark hover:text-accent-sage hover:underline transition-all'>Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login