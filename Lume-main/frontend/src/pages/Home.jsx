import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom';
import heroBg from '../assets/banner-4.jpg';
import featureImg1 from '../assets/bg1.jpg';
import featureImg2 from '../assets/bg2.jpg';
import collectionBg from '../assets/banner2.jpg';
import scentBg from '../assets/banner3.jpg';
import poeticBg from '../assets/bg3.jpg';
import ctaBg from '../assets/custom-bg.jpg';

const Home = () => {
  const { isUser, isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-body text-text-main overflow-x-hidden bg-primary-bg selection:bg-accent-gold selection:text-white">

      {/* Hero Section */}
      <div
        className='home-hero min-h-screen w-full relative flex items-center justify-center bg-cover bg-center bg-no-repeat fixed-bg overflow-hidden'
        style={{ backgroundImage: `url(${heroBg})`, backgroundPositionY: scrollY * 0.5 }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-bg to-transparent z-10"></div>

        {/* Floating Elements in Hero */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float z-0 pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl animate-float z-0 pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className='text-center max-w-5xl px-6 relative z-10 animate-fade-in-up mt-10'>
          <span className="sub uppercase tracking-[0.4em] text-white/80 text-xs md:text-sm mb-6 block drop-shadow-sm">Hand-Poured in the Heart of Nature</span>
          <h1 className='main text-white text-7xl md:text-9xl mb-8 drop-shadow-lg tracking-wide font-medium'>
            LUME
          </h1>
          <div className="h-px w-24 bg-white/50 mx-auto mb-8"></div>
          <p className='poetic-text text-white/90 text-2xl md:text-3xl font-light italic mb-12 max-w-2xl mx-auto leading-relaxed'>
            "Where the flickering flame meets the quietude of the soul."
          </p>

          <div className='flex flex-col md:flex-row justify-center items-center gap-6'>
            <Link to='/products' className='btn-primary py-4 px-12 rounded-none backdrop-blur-md bg-white/10 hover:bg-white hover:text-text-main border border-white text-white transition-all duration-500 min-w-[200px] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'>
              Shop Collection
            </Link>
            <Link to='/customize' className='btn-outline text-white border-white/50 hover:border-white hover:bg-transparent py-4 px-12 rounded-none min-w-[200px] backdrop-blur-sm'>
              The Studio
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce opacity-70 z-20">
          <span className="text-[10px] uppercase tracking-widest block mb-2 text-center">Explore</span>
          <i className="fa-solid fa-chevron-down text-xl"></i>
        </div>
      </div>

      {/* Aesthetic Ticker */}
      <div className="bg-primary-bg py-4 border-b border-accent-gold/20 overflow-hidden whitespace-nowrap relative">
        <div className="animate-marquee inline-block">
          <span className="mx-8 sub text-xs uppercase tracking-[0.3em] text-gray-400">Sustainable • Organic • Vegan • Hand-Poured • Ethically Sourced •</span>
          <span className="mx-8 sub text-xs uppercase tracking-[0.3em] text-text-sage">Mindful Living • Artisanal Craft • Pure Essence •</span>
          <span className="mx-8 sub text-xs uppercase tracking-[0.3em] text-gray-400">Sustainable • Organic • Vegan • Hand-Poured • Ethically Sourced •</span>
          <span className="mx-8 sub text-xs uppercase tracking-[0.3em] text-text-sage">Mindful Living • Artisanal Craft • Pure Essence •</span>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className='py-32 bg-primary-bg relative overflow-hidden'>
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-sage/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-gold/10 rounded-full blur-[100px] animate-pulse pointer-events-none delay-1000"></div>

        <div className='max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10'>
          <div className="space-y-10 order-2 md:order-1">
            <h2 className='main text-5xl md:text-6xl text-text-main leading-tight'>
              The Botanical <br />
              <span className="italic text-accent-sage font-serif">Difference</span>
            </h2>
            <div className="w-16 h-0.5 bg-accent-gold"></div>
            <p className='sub text-lg text-gray-600 leading-loose font-light tracking-wide text-justify'>
              We don't just make candles; we bottle memories. Our artisanal process begins with 100% organic soy wax, infused with essential oils sourced from sustainable farms. Every vessel is hand-finished, ensuring that your Lume experience is as kind to the earth as it is to your senses.
            </p>
            <div className="flex gap-12 pt-6">
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-accent-sage/30 flex items-center justify-center mb-3 group-hover:bg-accent-sage group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-leaf text-accent-sage group-hover:text-white"></i>
                </div>
                <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent-dark">Vegan</h4>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-accent-sage/30 flex items-center justify-center mb-3 group-hover:bg-accent-sage group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-flask text-accent-sage group-hover:text-white"></i>
                </div>
                <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent-dark">Non-Toxic</h4>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-accent-sage/30 flex items-center justify-center mb-3 group-hover:bg-accent-sage group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-recycle text-accent-sage group-hover:text-white"></i>
                </div>
                <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent-dark">Reusable</h4>
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 mt-16">
                <div className="aspect-[3/4] overflow-hidden rounded-t-[100px] rounded-b-lg shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group animate-float">
                  <img src={featureImg1} alt="Botanical Ingredients" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg rounded-b-[100px] shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group animate-float" style={{ animationDelay: '1.5s' }}>
                  <img src={featureImg2} alt="Artisanal Process" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section: Curated Moods / Collections */}
      <div className="py-24 bg-secondary-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <span className="sub text-xs font-bold uppercase tracking-[0.2em] text-accent-sage">Atmosphere</span>
              <h2 className="main text-4xl text-text-main mt-2">Curated Moods</h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-accent-dark pb-1 border-b border-transparent hover:border-accent-dark transition-all">
              View All Collections
              <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-[600px]">
            <div className="relative h-full w-full overflow-hidden rounded-sm group cursor-pointer shadow-lg animate-fade-in-up">
              <img src={collectionBg} alt="The Sanctuary Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="main text-4xl mb-2">Sanctuary</h3>
                <p className="sub text-sm uppercase tracking-widest opacity-90">For quiet reflection</p>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-12 h-full">
              <div className="bg-white p-10 flex flex-col justify-center items-start shadow-sm border border-gray-100 hover:shadow-md transition-shadow group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="main text-3xl mb-4 text-text-main group-hover:text-accent-gold transition-colors">Evening Rituals</h3>
                <p className="font-light text-gray-600 mb-6 w-3/4">Rich ambers, deep woods, and soft vanilla notes to close your day.</p>
                <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-accent-dark border-b border-accent-dark pb-1">Shop Evening</Link>
              </div>
              <div className="bg-[#EAE8E4] p-10 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
                <h3 className="main text-3xl mb-4 text-text-main group-hover:text-accent-sage transition-colors relative z-10">Morning Light</h3>
                <p className="font-light text-gray-600 mb-6 w-3/4 relative z-10">Fresh citrus, crisp linen, and green tea to awaken the spirit.</p>
                <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-accent-dark border-b border-accent-dark pb-1 relative z-10">Shop Morning</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW POETIC SECTION: The Art of Stillness */}
      <div className='py-32 relative overflow-hidden flex items-center bg-fixed bg-cover bg-center' style={{ backgroundImage: `url(${poeticBg})` }}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-8 border border-accent-dark rounded-full flex items-center justify-center animate-spin-slow">
            <i className="fa-solid fa-fan text-2xl text-accent-dark"></i>
          </div>
          <h2 className="main text-5xl md:text-6xl text-text-main mb-8">The Art of Stillness</h2>
          <p className="poetic-text text-xl md:text-2xl text-gray-700 leading-normal max-w-3xl mx-auto italic">
            "In the dance of the flame, we find the rhythm of the heart. A pause in the chaos, a breath in the silence."
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-card p-6 border-none bg-white/40 hover:bg-white/60 transition-colors">
              <span className="text-4xl text-accent-gold block mb-2">I.</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Light</h4>
              <p className="text-sm text-gray-600 font-light">The first spark. A transformation of energy that warms the space.</p>
            </div>
            <div className="glass-card p-6 border-none bg-white/40 hover:bg-white/60 transition-colors mt-8 md:mt-0">
              <span className="text-4xl text-accent-gold block mb-2">II.</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Scent</h4>
              <p className="text-sm text-gray-600 font-light">Memory unlocked. A journey to places both new and remembered.</p>
            </div>
            <div className="glass-card p-6 border-none bg-white/40 hover:bg-white/60 transition-colors">
              <span className="text-4xl text-accent-gold block mb-2">III.</span>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Peace</h4>
              <p className="text-sm text-gray-600 font-light">The lingering feeling. A calm that settles deep within.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scent Notes Parallax/Detail */}
      <div className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${scentBg})` }}>
        <div className="absolute inset-0 bg-accent-dark/80"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="text-white md:w-1/2">
            <span className="sub text-accent-gold uppercase tracking-[0.2em] text-xs font-bold block mb-4">The Olfactory notes</span>
            <h2 className="main text-5xl mb-8 leading-tight">Composed like a Symphony</h2>
            <p className="font-light text-white/80 text-lg leading-relaxed mb-8">
              Just as a perfume unfolds on the skin, a Lume candle reveals its character over time. We meticulously balance top, heart, and base notes.
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-6 border-b border-white/10 pb-6">
                <span className="text-4xl font-main opacity-20">01</span>
                <div>
                  <h4 className="uppercase tracking-widest text-sm font-bold mb-1">Top Notes</h4>
                  <p className="text-sm font-light text-white/60">The first impression. Light, volatile, and fleeting.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 border-b border-white/10 pb-6">
                <span className="text-4xl font-main opacity-20">02</span>
                <div>
                  <h4 className="uppercase tracking-widest text-sm font-bold mb-1">Heart Notes</h4>
                  <p className="text-sm font-light text-white/60">The core of the fragrance. Full-bodied and enduring.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive-looking visual */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 rounded-full border border-white/20 flex items-center justify-center animate-[spin_30s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-primary-bg text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded-full">Top</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-primary-bg text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded-full">Base</div>
              <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 bg-primary-bg text-text-main text-[10px] uppercase font-bold px-3 py-1 rounded-full">Heart</div>
              <div className="w-64 h-64 rounded-full border border-white/40 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center">
                  <i className="fa-solid fa-wind text-4xl text-white/80"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Minimalist */}
      <div className='py-24 bg-primary-bg'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-20'>
            <span className="sub text-xs font-bold uppercase tracking-widest text-accent-sage">Why Lume</span>
            <h2 className='main text-3xl md:text-4xl text-text-main mt-3'>Designed for Serenity</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='glass-card bg-white/50 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-2'>
              <div className='mb-6 text-accent-dark group-hover:text-accent-sage transition-colors'>
                <i className="fa-solid fa-wand-magic-sparkles text-4xl"></i>
              </div>
              <h3 className='main text-2xl mb-4'>The Custom Studio</h3>
              <p className='font-light text-gray-600 leading-relaxed text-sm'>
                Become the artisan. Select your vessel shape, curate your scent profile, and choose a hue that complements your sanctuary. A fully interactive 3D experience.
              </p>
              <Link to="/customize" className="inline-block mt-6 text-xs text-accent-dark font-bold uppercase tracking-widest border-b border-accent-dark pb-1 hover:text-accent-sage hover:border-accent-sage transition-all">Start Designing</Link>
            </div>

            <div className='glass-card bg-white/50 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-2'>
              <div className='mb-6 text-accent-dark group-hover:text-accent-sage transition-colors'>
                <i className="fa-solid fa-spa text-4xl"></i>
              </div>
              <h3 className='main text-2xl mb-4'>Aromatherapy Blends</h3>
              <p className='font-light text-gray-600 leading-relaxed text-sm'>
                Expertly blended essential oils designed to elevate your mood, calm your mind, and purify your space. Nature's remedy in every drop.
              </p>
              <Link to="/products" className="inline-block mt-6 text-xs text-accent-dark font-bold uppercase tracking-widest border-b border-accent-dark pb-1 hover:text-accent-sage hover:border-accent-sage transition-all">Explore Scents</Link>
            </div>

            <div className='glass-card bg-white/50 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-2'>
              <div className='mb-6 text-accent-dark group-hover:text-accent-sage transition-colors'>
                <i className="fa-solid fa-globe text-4xl"></i>
              </div>
              <h3 className='main text-2xl mb-4'>Sustainable Luxury</h3>
              <p className='font-light text-gray-600 leading-relaxed text-sm'>
                Luxury shouldn't cost the earth. We use biodegradable peanuts, recyclable boxes, and carbon-neutral shipping for every order placed.
              </p>
              <span className="inline-block mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest cursor-default">Learn More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax / Large Action Section */}
      <div
        className='hero-3 min-h-[500px] flex items-center justify-center relative bg-fixed bg-cover bg-center'
        style={{ backgroundImage: `url(${ctaBg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className='max-w-4xl mx-auto px-6 relative z-10 text-center text-white'>
          <h2 className='main text-6xl md:text-8xl mb-6 tracking-widest'>IGNITE</h2>
          <p className='sub text-xl font-light opacity-90 mb-10 max-w-2xl mx-auto'>
            Join the Lume collective.
          </p>
          <Link to={isAuthenticated ? '/products' : '/register'} className='btn-primary bg-white text-text-main hover:bg-transparent hover:text-white border border-white py-4 px-12 rounded-full min-w-[200px] transition-all duration-500'>
            {isAuthenticated ? 'Browse Catalogue' : 'Join Us'}
          </Link>
        </div>
      </div>

      {/* Footer-like whitespace to separate content */}
      <div className="h-20 bg-primary-bg"></div>
    </div>
  )
}

export default Home