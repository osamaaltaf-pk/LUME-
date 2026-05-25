import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows } from '@react-three/drei';
import studioBg from '../assets/bg2.jpg'; // Aesthetic Background
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { customizationServices } from '../services/customizationServices';
import Candle3D from '../components/Candle3D';
import NavBar from '../components/NavBar'; // Assuming navbar is needed if not handled by layout

const Customize = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [customizations, setCustomizations] = useState({
    colors: [],
    scents: [],
    sizes: [],
    shapes: []
  });

  const [selectedOptions, setSelectedOptions] = useState({
    color: '#ff6b35',
    scent: 'vanilla',
    size: 'medium',
    shape: 'classic'
  });

  const [totalPrice, setTotalPrice] = useState(2500); // Total Price
  const [basePrice, setBasePrice] = useState(2500); // Base Price
  const [loading, setLoading] = useState(false);
  const [loadingCustomizations, setLoadingCustomizations] = useState(true);
  const canvasRef = useRef();

  // Load customization options FROM BACKEND API
  useEffect(() => {
    const loadCustomizations = async () => {
      setLoadingCustomizations(true);
      try {
        const data = await customizationServices.getCustomizations();

        // Check for dynamic Base Price
        if (data.base && data.base.length > 0) {
          setBasePrice(data.base[0].price);
        }

        // Fallback defaults if DB is empty
        const colors = data.colors?.length > 0 ? data.colors : [];

        const scents = data.scents?.length > 0 ? data.scents : [];

        // Force all 3 sizes to be available
        const sizes = [
          { _id: 'sz1', name: 'Petite', value: 'small', price: 0 },
          { _id: 'sz2', name: 'Classic', value: 'medium', price: 500 },
          { _id: 'sz3', name: 'Grand', value: 'large', price: 1000 },
        ];

        // Update with DB prices if available
        if (data.sizes && data.sizes.length > 0) {
          sizes.forEach(size => {
            const backendSize = data.sizes.find(s => s.value === size.value);
            if (backendSize) {
              size._id = backendSize._id;
              size.price = backendSize.price;
              size.name = backendSize.name;
            }
          });
        }

        // Restore shapes - ALWAYS show these 4 as they are tied to the 3D 
        const shapes = [
          { _id: 's1', name: 'Classic', value: 'classic', price: 0 },
          { _id: 's2', name: 'Geometric', value: 'geometric', price: 500 },
          { _id: 's3', name: 'Bubble', value: 'bubble', price: 500 },
          { _id: 's4', name: 'Rose Ball', value: 'rose-ball', price: 800 }
        ];

        // If backend has price updates for these, we could map them, but for now just showing them is priority.
        if (data.shapes && data.shapes.length > 0) {
          // simple merge if needed, or just ignore backend shapes to ensure all 4 show
          // If backend has matching value, update price/id
          shapes.forEach(shape => {
            const backendShape = data.shapes.find(s => s.value === shape.value);
            if (backendShape) {
              shape._id = backendShape._id;
              shape.price = backendShape.price;
              shape.name = backendShape.name;
            }
          });
        }

        setCustomizations({ colors, scents, sizes, shapes });

        // Set default selections
        setSelectedOptions({
          color: colors.length > 0 ? colors[0].value : '#ffffff',
          scent: scents.length > 0 ? scents[0].value : '',
          size: sizes.length > 1 ? sizes[1].value : (sizes.length > 0 ? sizes[0].value : 'medium'),
          shape: shapes.length > 0 ? shapes[0].value : 'classic'
        });

      } catch (error) {
        console.error('Error loading customizations:', error);
        // Add defaults even on error to prevent broken UI
        // ... (keep usage of defaults logic in catch block if needed, but for brevity not re-printing whole block unless necessary)
        const defaultColors = [
          { _id: 'c1', name: 'Warm Sand', value: '#e6ccb2', price: 0 },
          { _id: 'c2', name: 'Sage Green', value: '#8DA399', price: 0 },
        ];
        const defaultShapes = [
          { _id: 's1', name: 'Classic', value: 'classic', price: 0 },
          { _id: 's2', name: 'Geometric', value: 'geometric', price: 500 },
        ];
        const defaultSizes = [
          { _id: 'sz1', name: 'Small', value: 'small', price: 0 },
          { _id: 'sz2', name: 'Medium', value: 'medium', price: 500 },
        ];
        const defaultScents = [
          { _id: 'sc1', name: 'Vanilla', value: 'vanilla', price: 0 }
        ];

        setCustomizations({
          colors: defaultColors,
          scents: defaultScents,
          sizes: defaultSizes,
          shapes: defaultShapes
        });

        setSelectedOptions({
          color: defaultColors[0].value,
          scent: defaultScents[0].value,
          size: defaultSizes[1].value,
          shape: defaultShapes[0].value
        });

      } finally {
        setLoadingCustomizations(false);
      }
    };

    loadCustomizations();
  }, []);

  // Calculate price when options change
  useEffect(() => {
    const calculatePrice = () => {
      let price = basePrice; // Dynamic Base Price

      // Add prices of selected customizations
      Object.values(customizations).flat().forEach(option => {
        if (Object.values(selectedOptions).includes(option.value)) {
          price += option.price;
        }
      });

      setTotalPrice(price);
    };

    calculatePrice();
  }, [selectedOptions, customizations, basePrice]);

  const handleOptionChange = (type, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add custom candles to cart');
      return;
    }

    setLoading(true);
    try {
      const selectedColor = customizations.colors.find(c => c.value === selectedOptions.color);
      const selectedScent = customizations.scents.find(s => s.value === selectedOptions.scent);
      const selectedSize = customizations.sizes.find(sz => sz.value === selectedOptions.size);
      const selectedShape = customizations.shapes.find(sh => sh.value === selectedOptions.shape);

      const customCandle = {
        _id: `custom-${Date.now()}`,
        name: `Custom ${selectedSize?.name || selectedOptions.size} Candle`,
        description: `Custom ${selectedShape?.name} candle in ${selectedScent?.name} scent.`,
        price: totalPrice,
        color: selectedOptions.color,
        colorName: selectedColor?.name || selectedOptions.color,
        scent: selectedOptions.scent,
        scentName: selectedScent?.name || selectedOptions.scent,
        size: selectedOptions.size,
        sizeName: selectedSize?.name || selectedOptions.size,
        shape: selectedOptions.shape,
        shapeName: selectedShape?.name || selectedOptions.shape,
        isCustom: true
      };

      addToCart(customCandle);
      alert('Custom candle added to cart!');
    } catch (error) {
      console.error('Error adding custom candle to cart:', error);
      alert('Error adding custom candle to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="main text-3xl mb-4 text-text-main">Join the Atelier</h2>
        <p className="sub text-xl text-gray-600 mb-6">Please login to craft your bespoke candle.</p>
        <button className="btn-primary py-2 px-6 rounded-full" onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    );
  }

  const hasCustomizations = customizations.colors.length > 0 || customizations.scents.length > 0;

  return (
    <div
      className="min-h-screen w-full py-12 px-6 font-body text-text-main relative bg-fixed bg-cover bg-center overflow-x-hidden"
      style={{ backgroundImage: `url(${studioBg})` }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0"></div>

      {/* Floating Blobs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-accent-sage/20 rounded-full blur-[80px] animate-pulse z-0 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-accent-gold/10 rounded-full blur-[100px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '2s' }}></div>


      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="sub uppercase tracking-[0.4em] text-xs font-bold text-accent-gold block mb-3">Bespoke Creations</span>
          <h1 className="main text-5xl md:text-6xl mb-6 text-text-main drop-shadow-sm">The Custom Studio</h1>
          <p className="poetic-text text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            "Mold your vision into wax and flame. Select your vessel, scent, and hue."
          </p>
        </div>

        {loadingCustomizations ? (
          <div className="text-center py-20">
            <div className="animate-spin-slow text-accent-gold text-4xl mb-4 inline-block">
              <i className="fa-solid fa-circle-notch"></i>
            </div>
            <p className="sub text-sm uppercase tracking-widest animate-pulse">Preparing the atelier...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* 3D Preview Panel */}
            <div className="h-[600px] w-full bg-white/40 rounded-sm overflow-hidden shadow-2xl relative border border-white/60 animate-fade-in-up order-1 lg:order-2 sticky top-24">
              <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold text-gray-500 shadow-sm flex items-center gap-2">
                <i className="fa-solid fa-arrows-rotate animate-spin-slow"></i> Interactive View
              </div>
              <Canvas ref={canvasRef} shadows dpr={[1, 2]} camera={{ position: [0, 2, 6], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                {/* Environment for reflections - Commented out due to CDN timeouts causing crashes 
                <Environment preset="city" /> 
                */}
                <group position={[0, -1, 0]}>
                  <Candle3D
                    shape={selectedOptions.shape}
                    color={selectedOptions.color}
                    size={selectedOptions.size}
                  />
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <shadowMaterial transparent opacity={0.3} color="#8DA399" />
                  </mesh>
                </group>
                <OrbitControls enablePan={false} minDistance={3} maxDistance={10} autoRotate={false} />{/* Disable auto rotate for user control */}
              </Canvas>
            </div>

            {/* Controls Panel */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-sm shadow-xl space-y-12 animate-fade-in-up order-2 lg:order-1 border border-white/50" style={{ animationDelay: '0.2s' }}>

              {/* Shape Selection */}
              <div>
                <h3 className="sub text-xs uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-3 text-gray-400">
                  <span className="w-8 h-[1px] bg-accent-gold"></span> Step 01: The Vessel
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {customizations.shapes.map(shape => (
                    <button
                      key={shape._id}
                      onClick={() => handleOptionChange('shape', shape.value)}
                      className={`p-3 rounded-sm border transition-all duration-300 flex flex-col items-center gap-2 group relative overflow-hidden ${selectedOptions.shape === shape.value
                        ? 'border-accent-gold bg-primary-bg shadow-inner'
                        : 'border-gray-100 hover:border-accent-sage hover:shadow-lg bg-white'
                        }`}
                    >
                      <span className={`font-main text-xs transition-colors ${selectedOptions.shape === shape.value ? 'text-accent-dark' : 'text-gray-600'}`}>{shape.name}</span>
                      {/* Visual indicator (optional icon map could go here) */}
                      {shape.price > 0 && <span className="text-[9px] uppercase font-bold text-accent-gold tracking-widest">+ Rs. {shape.price}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="sub text-xs uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-3 text-gray-400">
                  <span className="w-8 h-[1px] bg-accent-gold"></span> Step 02: The Hue
                </h3>
                <div className="flex flex-wrap gap-6">
                  {customizations.colors.map(color => (
                    <button
                      key={color._id}
                      onClick={() => handleOptionChange('color', color.value)}
                      className={`w-14 h-14 rounded-full cursor-pointer transition-all duration-300 shadow-md relative group border-2 border-white/80 ring-1 ring-gray-200 ${selectedOptions.color === color.value ? 'ring-2 ring-offset-4 ring-accent-gold scale-110' : 'hover:scale-105'
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {/* Hover Tooltip */}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {color.name}
                      </span>
                      {color.price > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-accent-gold shadow-sm font-bold border border-gray-100">+</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scent & Size Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Scent */}
                <div>
                  <h3 className="sub text-xs uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-3 text-gray-400">
                    <span className="w-8 h-[1px] bg-accent-gold"></span> Step 03: Essence
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedOptions.scent}
                      onChange={(e) => handleOptionChange('scent', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-sm outline-none focus:border-accent-gold bg-white appearance-none cursor-pointer font-light text-gray-600"
                    >
                      {customizations.scents.map(scent => (
                        <option key={scent._id} value={scent.value}>
                          {scent.name} {scent.price > 0 ? `(+Rs. ${scent.price})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="sub text-xs uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-3 text-gray-400">
                    <span className="w-8 h-[1px] bg-accent-gold"></span> Step 04: Scale
                  </h3>
                  <div className="flex gap-2">
                    {customizations.sizes.map(size => (
                      <button
                        key={size._id}
                        onClick={() => handleOptionChange('size', size.value)}
                        className="flex-1 py-3 rounded-sm border text-xs uppercase tracking-wider transition-colors shadow-sm font-bold"
                        style={{
                          backgroundColor: selectedOptions.size === size.value ? '#2C3639' : '#FFFFFF',
                          borderColor: selectedOptions.size === size.value ? '#2C3639' : '#9CA3AF',
                          color: selectedOptions.size === size.value ? '#FFFFFF' : '#000000'
                        }}
                      >
                        <span style={{ color: selectedOptions.size === size.value ? '#FFFFFF' : '#000000', opacity: 1, fontWeight: 'bold' }}>
                          {size.name || size.value}
                        </span>
                        {size.price > 0 && <div className="text-[9px] mt-1" style={{ color: selectedOptions.size === size.value ? '#FFFFFF' : '#000000' }}>+Rs. {size.price}</div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary & Action */}
              <div className="pt-10 border-t border-gray-100 mt-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="sub text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Estimated Value</p>
                    <h2 className="main text-5xl text-accent-gold">Rs. {totalPrice.toFixed(0)}</h2>
                  </div>
                  <div className="text-right text-xs text-gray-400 font-light space-y-1">
                    <p>Base Creation: Rs. {basePrice}</p>
                    <p>+ Customizations</p>
                    <p>Tax included.</p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={loading || !hasCustomizations}
                  className={`w-full py-5 rounded-sm text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-2xl active:scale-[0.99] ${loading || !hasCustomizations
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'btn-primary border-none shadow-md hover:shadow-xl'
                    }`}
                >
                  {loading ? (
                    <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Crafting...</span>
                  ) : 'Commission Piece'}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customize;