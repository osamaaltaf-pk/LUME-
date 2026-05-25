import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onEdit, onDelete, showAdminActions = false }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <div className='bg-white rounded-none border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 w-full md:max-w-xs group overflow-hidden'>
      {/* Product Image */}
      <div className='relative h-64 overflow-hidden bg-gray-50'>
        {product.images && product.images.length > 0 ? (
          <img
            src={
              product.images[0].startsWith('http') || product.images[0].startsWith('data:')
                ? product.images[0]
                : `${(import.meta.env.VITE_API_URL || 'https://backend-nine-pi-24.vercel.app/api').replace('/api', '')}/${product.images[0]}`
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            // Fallback for broken Vercel uploads
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/eaddcf/5c4033?text=Image+Not+Available'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <i className="fa-solid fa-candle-holder text-4xl"></i>
          </div>
        )}

        {/* Quick Badge */}
        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
          <span className="absolute top-2 right-2 bg-red-400 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">Low Stock</span>
        )}
        {product.stockQuantity === 0 && (
          <span className="absolute top-2 right-2 bg-gray-500 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">Sold Out</span>
        )}
      </div>

      <div className='p-6'>
        {/* Header */}
        <div className="mb-4">
          <span className='block text-xs font-bold text-accent-sage uppercase tracking-widest mb-1'>
            {product.category === 'aromatherapy' ? 'Aromatherapy Blend' :
              product.category === 'signature' ? 'Signature Collection' :
                product.category === 'seasonal' ? 'Seasonal Limited' :
                  product.category === 'decorative' ? 'Decorative Art' :
                    product.category}
          </span>
          <h3 className='text-xl main text-text-main leading-none mb-2'>{product.name}</h3>
          <p className='text-sm text-gray-500 font-light line-clamp-2 min-h-[40px]'>{product.description}</p>
        </div>

        {/* Price & Specs */}
        <div className='flex items-end justify-between border-t border-gray-100 pt-4 mb-4'>
          <span className='text-2xl font-medium text-text-main font-heading'>Rs. {product.price}</span>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-bold uppercase">{product.size}</p>
            <p className="text-xs text-gray-400 font-light">{product.burnTime}</p>
          </div>
        </div>

        {/* Details (Scent) */}
        {product.scent && (
          <div className="bg-secondary-bg/30 p-2 rounded-sm text-center mb-4">
            <span className="text-xs text-gray-600 italic">Notes: {product.scent}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {isAuthenticated && !showAdminActions && (
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className={`w-full py-3 text-xs uppercase font-bold tracking-widest border transition-all ${product.stockQuantity === 0 ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'btn-primary'}`}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}

          {showAdminActions && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(product)} className='flex-1 py-2 text-xs uppercase font-bold tracking-wider btn-outline border-gray-300 text-gray-600 hover:border-accent-dark hover:bg-accent-dark hover:text-white'>
                Edit
              </button>
              <button onClick={() => onDelete(product._id)} className='flex-1 py-2 text-xs uppercase font-bold tracking-wider bg-transparent border border-red-200 text-red-500 hover:bg-red-50 transition-all'>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;