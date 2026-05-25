import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authServices';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.forgotPassword(email);
      setStep(2);
      setMessage({ type: 'success', text: 'OTP sent to your email.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.resetPassword({ email, otp, newPassword });
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-classic relative overflow-hidden'>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-sage/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-gold/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0"></div>

      <div className='glass-card p-10 w-full max-w-md flex flex-col gap-6 relative z-10 animate-fade-in-up border border-white/20 shadow-2xl'>
        <div className="text-center">
          <h2 className='main text-3xl font-bold text-text-main mb-2'>
            {step === 1 ? 'Recover Access' : 'Secure Entry'}
          </h2>
          <p className="sub text-xs text-gray-500 uppercase tracking-widest">
            {step === 1 ? 'Retrieve your digital key' : 'Set a new passphrase'}
          </p>
        </div>

        {message.text && (
          <div className={`p-3 rounded-md text-center text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='input-classic w-full'
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className='btn-primary w-full py-3 rounded-md shadow-lg flex justify-center items-center gap-2'
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Encryption Code (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className='input-classic w-full tracking-widest text-center font-mono'
                placeholder="• • • • • •"
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-widest'>New Passphrase</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className='input-classic w-full'
                placeholder="Enter new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className='btn-primary w-full py-3 rounded-md shadow-lg flex justify-center items-center gap-2'
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className='text-center border-t border-gray-100 pt-6'>
          <Link to='/login' className='text-xs text-gray-500 hover:text-accent-dark font-medium uppercase tracking-widest transition-colors'>
            ← Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
