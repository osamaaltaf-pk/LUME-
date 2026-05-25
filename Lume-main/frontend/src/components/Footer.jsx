import React from 'react';
import { Link } from 'react-router-dom';
import lumeLogo from '../assets/lume-logo-bg.png'; // Assuming same logo asset usage

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="block w-28 bg-white p-2 rounded-sm opacity-90 hover:opacity-100 transition-opacity">
              <img src={lumeLogo} alt="Lume" className="w-full" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Crafting illuminated moments through bespoke artistry. Each piece is a testament to sustainable design and sensory elegance.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-accent-gold hover:border-accent-gold transition-all">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-accent-gold hover:border-accent-gold transition-all">
                <i className="fa-brands fa-pinterest"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-accent-gold hover:border-accent-gold transition-all">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="main text-lg font-bold text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-accent-gold text-sm uppercase tracking-wider transition-colors">Collection</Link>
              </li>
              <li>
                <Link to="/customize" className="text-gray-400 hover:text-accent-gold text-sm uppercase tracking-wider transition-colors">The Atelier</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="main text-lg font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-accent-gold text-sm uppercase tracking-wider transition-colors">My Profile & Orders</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-accent-gold text-sm uppercase tracking-wider transition-colors">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="main text-lg font-bold text-white mb-6">Stay Illuminated</h4>
            <p className="text-gray-400 text-sm mb-4 font-light">
              Join our list for early access to limited editions and seasonal blends.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="email@address.com"
                className="w-full px-3 py-3 bg-white/5 border border-gray-700 rounded text-white focus:outline-none focus:border-accent-gold text-sm font-light placeholder-gray-500 transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button className="btn-primary w-full py-3 text-xs border-none hover:bg-accent-gold hover:text-white">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-light tracking-wide">
            © {new Date().getFullYear()} LUME ATELIER. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-wider">
            {/* Links removed as per user request */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer