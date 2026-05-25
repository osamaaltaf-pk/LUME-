import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import collectionBanner from '../assets/bg1.jpg';

const Products = () => {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Signature', 'Seasonal', 'Aromatherapy', 'Decorative'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg">
        <div className="animate-spin-slow text-accent-gold text-4xl">
          <i className="fa-solid fa-circle-notch"></i>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-primary-bg flex flex-col items-center w-full min-h-screen overflow-x-hidden relative'>
      {/* Background Ambience */}
      <div className="fixed top-20 left-0 w-96 h-96 bg-accent-sage/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Parallax Banner */}
      <div
        className='w-full h-[60vh] relative bg-fixed bg-center bg-cover flex items-center justify-center'
        style={{ backgroundImage: `url(${collectionBanner})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 text-center animate-fade-in-up">
          <span className="sub text-white/90 uppercase tracking-[0.5em] text-sm block mb-4 drop-shadow-sm">The Atelier</span>
          <h1 className="main text-6xl md:text-7xl text-white drop-shadow-xl tracking-wide mb-6">Our Collection</h1>
          <p className="poetic-text text-white/95 text-xl font-light italic max-w-lg mx-auto drop-shadow-md">
            "Scents that linger like a beautiful memory."
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-20 w-full relative z-10'>
        {/* Floating Elements specific to grid area */}
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent-dark/5 rounded-full blur-2xl animate-float pointer-events-none -z-10"></div>
        <div className="absolute bottom-40 left-20 w-48 h-48 bg-accent-sage/10 rounded-full blur-3xl animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }}></div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-sm uppercase tracking-widest pb-2 transition-all duration-300 ${activeFilter === filter
                ? 'text-accent-dark border-b-2 border-accent-gold font-bold'
                : 'text-gray-400 hover:text-accent-sage border-b-2 border-transparent'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
          {products
            .filter(product => {
              if (activeFilter === 'All') return true;
              return product.category?.toLowerCase() === activeFilter.toLowerCase();
            })
            .map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}

          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-60">
              <i className="fa-solid fa-wind text-6xl text-gray-300 mb-6 animate-pulse"></i>
              <h3 className="main text-2xl text-gray-500 mb-2">The shelves are quiet.</h3>
              <p className="sub text-sm text-gray-400 uppercase tracking-widest">New creations coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;