import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const { signup, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (showOtp) {
      const result = await verifyOtp({ email: formData.email, otp: formData.otp });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      const result = await signup(formData);
      if (result.success) {
        setShowOtp(true);
      } else {
        setError(result.message || 'Registration failed');
      }
    }
    setLoading(false);
  }

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-classic login-hero'>
      <div className="absolute inset-0 bg-dark/30 backdrop-blur-[2px]"></div>

      <div className='relative z-10 w-full max-w-md px-6 my-10'>
        <div className='glass-card p-10 rounded-xl shadow-2xl'>

          <div className="text-center mb-8">
            <h2 className='text-3xl font-bold main text-text-main mb-2'>
              {showOtp ? 'Verify Identity' : 'Join the Circle'}
            </h2>
            <div className="w-12 h-1 bg-accent-sage mx-auto rounded-full"></div>
            <p className="sub text-sm text-gray-500 mt-2">Begin your journey with Lume.</p>
          </div>

          <form onSubmit={handleSubmitt} className='flex flex-col gap-5'>
            {error && <div className={`p-3 rounded-md text-sm text-center border ${error.includes('sent') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>{error}</div>}

            {!showOtp ? (
              <div className="space-y-4">
                <div className='space-y-1'>
                  <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600'>Username</label>
                  <input
                    type="text"
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className='input-classic bg-white/80'
                    placeholder="ChosenName"
                  />
                </div>

                <div className='space-y-1'>
                  <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600'>Email</label>
                  <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='input-classic bg-white/80'
                    placeholder="you@example.com"
                  />
                </div>

                <div className='space-y-1'>
                  <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600'>Password</label>
                  <input
                    type="password"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='input-classic bg-white/80'
                    placeholder="••••••••"
                  />
                </div>
              </div>
            ) : (
              <div className='space-y-4 animate-fade-in-up'>
                <div className='bg-secondary-bg/50 p-4 rounded-lg text-center mb-4'>
                  <p className="text-sm text-gray-600">We've sent a code to <span className="font-semibold text-text-main">{formData.email}</span></p>
                </div>
                <div className='space-y-1'>
                  <label className='sub text-xs font-bold uppercase tracking-wider text-gray-600 text-center block'>Enter Verification Code</label>
                  <input
                    type="text"
                    name='otp'
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    placeholder="______"
                    className='input-classic bg-white/80 text-center text-2xl tracking-[0.5em] font-mono'
                  />
                </div>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2'
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                showOtp ? 'Verify & Enter' : 'Create Account'
              )}
            </button>
          </form>

          < div className="text-center mt-6 pt-6 border-t border-gray-100">
            {!showOtp ? (
              <p className='text-sm text-gray-500'>
                Already a member? <Link to='/login' className='font-bold text-accent-dark hover:text-accent-sage hover:underline transition-all'>Sign In</Link>
              </p>
            ) : (
              <button onClick={() => setShowOtp(false)} className='text-sm text-gray-500 hover:text-text-main transition-colors'>
                <i className="fa-solid fa-arrow-left mr-1"></i> Back to details
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Signup