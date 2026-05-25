import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import lume from '../assets/lume-logo-bg.png'

const NavBar = () => {
  const { logout, isAdmin, isUser, isAuthenticated, hydrated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!hydrated) return null

  // Active link style
  const activeStyle = "text-accent-dark border-b-2 border-accent-dark";
  const normalStyle = "text-text-main hover:text-accent-sage transition-colors duration-300";
  const mobileLinkStyle = "block py-3 text-sm font-medium tracking-widest uppercase sub text-text-main border-b border-gray-50 hover:bg-gray-50 hover:text-accent-gold transition-colors";

  return (
    <nav className='bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300'>
      <div className="max-w-7xl mx-auto px-6 py-3 md:py-2 flex justify-between items-center relative">

        {/* Logo */}
        <Link to='/' className="flex items-center gap-2 group z-20">
          <img src={lume} alt="Lume" className='h-8 md:h-9 transition-transform duration-500 group-hover:scale-105' />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-2xl text-text-main focus:outline-none z-20 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-10 items-center'>
          <NavLink to='/products' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>Collection</NavLink>
          <NavLink to='/customize' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>Studio</NavLink>

          {isUser() && (
            <NavLink to='/cart' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>
              Cart
            </NavLink>
          )}

          {isAdmin() && (
            <>
              <NavLink to='/dashboard' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>Dashboard</NavLink>
              <NavLink to='/admin/orders' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>Orders</NavLink>
            </>
          )}

          {isUser() && (
            <NavLink to='/profile' className={({ isActive }) => `text-sm font-medium tracking-widest uppercase sub ${isActive ? activeStyle : normalStyle}`}>Profile</NavLink>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className='sub text-sm font-medium uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors'
            >
              Log Out
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to='/login' className='sub text-sm font-medium uppercase tracking-widest text-text-main hover:text-accent-sage pt-1'>Login</Link>
              <Link to='/register' className='btn-primary py-2 px-6 text-xs'>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-fade-in-up origin-top z-10">
          <div className="flex flex-col px-6 py-6 space-y-1">
            <NavLink to='/products' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Collection</NavLink>
            <NavLink to='/customize' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Studio</NavLink>

            {isUser() && (
              <NavLink to='/cart' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Cart</NavLink>
            )}

            {isAdmin() && (
              <>
                <NavLink to='/dashboard' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Dashboard</NavLink>
                <NavLink to='/admin/orders' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Orders</NavLink>
              </>
            )}

            {isUser() && (
              <NavLink to='/profile' onClick={() => setMobileMenuOpen(false)} className={mobileLinkStyle}>Profile</NavLink>
            )}

            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className='w-full text-left py-2 text-sm font-medium uppercase tracking-widest text-red-500 hover:bg-gray-50'
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link to='/login' onClick={() => setMobileMenuOpen(false)} className='block text-center py-3 border border-gray-200 rounded text-sm font-medium uppercase tracking-widest text-text-main hover:bg-gray-50'>Login</Link>
                  <Link to='/register' onClick={() => setMobileMenuOpen(false)} className='block text-center py-3 btn-primary text-xs rounded'>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar