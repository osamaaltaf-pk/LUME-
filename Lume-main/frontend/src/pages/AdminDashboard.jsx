import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { customizationServices } from '../services/customizationServices'; // IMPORT THE REAL SERVICE

const AdminDashboard = () => {
  const { products, loading, addProduct, updateProduct, removeProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'scented',
    scent: '',
    size: 'medium',
    burnTime: '',
    stockQuantity: '10'
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [customizations, setCustomizations] = useState({
    colors: [],
    scents: [],
    sizes: [],
    shapes: [],
    base: []
  });

  const [customizationForm, setCustomizationForm] = useState({
    type: 'color',
    name: '',
    value: '',
    price: ''
  });

  const [loadingCustomizations, setLoadingCustomizations] = useState(false);

  // Load existing customizations FROM BACKEND API
  useEffect(() => {
    const loadCustomizations = async () => {
      setLoadingCustomizations(true);
      try {
        const data = await customizationServices.getCustomizations();
        setCustomizations(data);
      } catch (error) {
        console.error('Error loading customizations:', error);
        alert('Error loading customization options from server');
        // Set empty arrays if API fails
        setCustomizations({
          colors: [],
          scents: [],
          sizes: [],
          shapes: [],
          base: []
        });
      } finally {
        setLoadingCustomizations(false);
      }
    };

    loadCustomizations();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'scented',
      scent: '',
      size: 'medium',
      burnTime: '',
      stockQuantity: '10'
    });
    setSelectedImages([]);
    setEditingProduct(null);
  };

  // Handle file selection (Convert to Base64)
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Check size limit (3MB per file for MongoDB Base64 safety)
    const oversizedFiles = files.filter(file => file.size > 3 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Images must be under 3MB.');
      return;
    }

    const readPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(base64Images => {
      setSelectedImages(prev => [...prev, ...base64Images]);
    }).catch(err => console.error("Error reading files", err));
  };

  // Remove selected image
  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission (Send JSON with Base64)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let success = false;

    if (editingProduct) {
      // Combine existing images (URLs) with new images (Base64)
      const allImages = [...(editingProduct.images || []), ...selectedImages];

      const payload = {
        ...formData,
        images: allImages,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      };

      success = await updateProduct(editingProduct._id, payload);
    } else {
      // Create new product
      const payload = {
        ...formData,
        images: selectedImages,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      };

      success = await addProduct(payload);
    }

    if (success) {
      setShowForm(false);
      resetForm();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'scented',
      scent: product.scent || '',
      size: product.size || 'medium',
      burnTime: product.burnTime || '',
      stockQuantity: product.stockQuantity || '10'
    });
    setSelectedImages([]);
    setShowForm(true);
  };

  // Cancel
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleAddCustomization = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with fallbacks for Base Price
      const payload = { ...customizationForm };

      if (payload.type === 'base') {
        payload.name = payload.name || 'Standard Creation Fee';
        payload.value = payload.value || 'base_fee';
      }

      // USE THE REAL API SERVICE
      const result = await customizationServices.addCustomization({
        ...payload,
        price: parseFloat(payload.price) || 0
      });

      alert('Customization option added successfully!');
      // Reset form (keep type as color to avoid confusing UI states)
      setCustomizationForm({ type: 'color', name: '', value: '', price: '' });

      // Refresh the customizations list FROM BACKEND
      const data = await customizationServices.getCustomizations();
      setCustomizations(data);
    } catch (error) {
      console.error('Error adding customization:', error);
      alert('Error adding customization option. Please check if you are logged in as admin.');
    }
  };

  const deleteCustomization = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this customization option?')) {
      try {
        // USE THE REAL API SERVICE
        await customizationServices.deleteCustomization(id);

        alert('Customization deleted successfully!');

        // Refresh the customizations list FROM BACKEND
        const data = await customizationServices.getCustomizations();
        setCustomizations(data);
      } catch (error) {
        console.error('Error deleting customization:', error);
        alert('Error deleting customization option');
      }
    }
  };

  return (

    <div className='bg-classic min-h-screen p-8'>
      <div className="max-w-6xl mx-auto">
        <h1 className='text-4xl font-semibold main text-center text-text-main mb-12'>Atelier Dashboard</h1>

        <div className="text-center mb-12">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className='btn-primary py-3 px-8 rounded-full shadow-lg'
          >
            {showForm ? 'Close Form' : '✨ Add New Artifact'}
          </button>
        </div>

        {showForm && (
          <div className="animate-fade-in-up mb-16">
            <form onSubmit={handleSubmit} className='admin-card p-8 max-w-3xl mx-auto space-y-6'>
              <h3 className='main text-2xl border-b border-accent-gold/20 pb-4 mb-6'>
                {editingProduct ? 'Refine Artifact' : 'Craft New Artifact'}
              </h3>

              {/* Text Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='input-classic'
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className='input-classic'
                >
                  <option value="signature">Signature Collection</option>
                  <option value="seasonal">Seasonal Limited</option>
                  <option value="aromatherapy">Aromatherapy Blends</option>
                  <option value="scented">Classic Scented</option>
                  <option value="decorative">Decorative Art</option>
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Poetic Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className='input-classic'
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="number"
                  name="price"
                  placeholder="Price (Rs.)"
                  value={formData.price}
                  onChange={handleChange}
                  step="1"
                  required
                  className='input-classic'
                />
                <input
                  type="text"
                  name="scent"
                  placeholder="Scent Notes"
                  value={formData.scent}
                  onChange={handleChange}
                  className='input-classic'
                />
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className='input-classic'
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="x-large">X-Large</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="burnTime"
                  placeholder="Burn Time (e.g., 20h)"
                  value={formData.burnTime}
                  onChange={handleChange}
                  required
                  className='input-classic'
                />
                <input
                  type="number"
                  name="stockQuantity"
                  placeholder="Stock Quantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  className='input-classic'
                />
              </div>

              {/* FILE UPLOAD SECTION */}
              {!editingProduct && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Imagery</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className='block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-accent-gold file:text-white
                        hover:file:bg-yellow-600
                        '
                  />
                  {/* Previews */}
                  <div className="mt-4 flex flex-wrap gap-4 justify-center">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Current Imagery:</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {editingProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${image}`}
                        alt="Product"
                        className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="submit" className='flex-1 btn-primary py-3 rounded-lg'>
                  {editingProduct ? 'Update Masterpiece' : 'Publish Masterpiece'}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className='flex-1 btn-outline py-3 rounded-lg border-gray-400 text-gray-600 hover:bg-gray-100'
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className='text-2xl font-semibold main'>Collection Gallery</h2>
            <span className="bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-sm font-medium">{products.length} Items</span>
          </div>

          {loading && <div className="text-center py-10 w-full">Loading collection...</div>}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={removeProduct}
                showAdminActions={true}
              />
            ))}
          </div>
        </div>

        {/* Customization Options Section */}
        <div className="admin-card p-8">
          <h3 className="main text-2xl mb-2">Customization Atelier</h3>
          <p className="sub text-gray-500 mb-8">Manage the palette of options available to your patrons.</p>

          <form onSubmit={handleAddCustomization} className="flex flex-wrap items-end gap-4 mb-10 bg-secondary-bg/50 p-6 rounded-xl border border-dashed border-gray-300">

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={customizationForm.type}
                onChange={(e) => setCustomizationForm(prev => ({ ...prev, type: e.target.value }))}
                className="input-classic bg-white"
              >
                <option value="color">Color</option>
                <option value="scent">Scent</option>
                <option value="size">Size</option>
                <option value="shape">Shape</option>
                <option value="base">Base Price</option>
              </select>
            </div>

            {/* Conditional Logic */}
            {customizationForm.type === 'shape' ? (
              <div className="flex-[3] min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Shape Model</label>
                <select
                  className="input-classic bg-white"
                  value={customizationForm.value}
                  onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    setCustomizationForm(prev => ({
                      ...prev,
                      value: e.target.value,
                      name: selectedOption.text
                    }));
                  }}
                >
                  <option value="">-- Choose Shape --</option>
                  <option value="classic">Classic</option>
                  <option value="geometric">Geometric</option>
                  <option value="bubble">Bubble</option>
                  <option value="rose-ball">Rose Ball</option>
                </select>
              </div>
            ) : customizationForm.type === 'size' ? (
              <div className="flex-[3] min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Size Tier</label>
                <select
                  className="input-classic bg-white"
                  value={customizationForm.value}
                  onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    setCustomizationForm(prev => ({
                      ...prev,
                      value: e.target.value,
                      name: selectedOption.text
                    }));
                  }}
                >
                  <option value="">-- Choose Size --</option>
                  <option value="small">Petite</option>
                  <option value="medium">Medium</option>
                  <option value="large">Grand</option>
                </select>
              </div>
            ) : customizationForm.type === 'base' ? (
              <div className="hidden"></div>
            ) : (
              <>
                <div className="flex-[2] min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={customizationForm.name}
                    onChange={(e) => setCustomizationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Midnight Blue"
                    className="input-classic bg-white"
                    required
                  />
                </div>

                <div className="flex-[2] min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technical Value</label>
                  <input
                    type="text"
                    value={customizationForm.value}
                    onChange={(e) => setCustomizationForm(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Hex: #1a1a1a"
                    className="input-classic bg-white"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {customizationForm.type === 'base' ? 'Set Base Price' : 'Added Cost'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rs.</span>
                <input
                  type="number"
                  value={customizationForm.price}
                  onChange={(e) => setCustomizationForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  className="input-classic bg-white pl-14"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary py-2.5 px-6 rounded-lg self-end">
              <i className="fa-solid fa-plus mr-2"></i> Add
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['base', 'colors', 'scents', 'shapes', 'sizes'].map(type => (
              <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-secondary-bg px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h5 className="capitalize font-semibold main text-lg">{type}</h5>
                  <span className="bg-white text-xs font-bold px-2 py-1 rounded-md text-gray-500 border border-gray-200">{customizations[type]?.length || 0}</span>
                </div>

                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {customizations[type]?.map(option => (
                    <div key={option._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-accent-gold/20">
                      <div className="flex items-center gap-3">
                        {type === 'colors' && (
                          <div
                            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: option.value }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{option.name}</p>
                          <p className="text-xs text-gray-500">{option.value}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {option.price > 0 && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+Rs. {option.price}</span>
                        )}
                        <button
                          onClick={() => deleteCustomization(type, option._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!customizations[type] || customizations[type].length === 0) && (
                    <p className="text-center text-sm text-gray-400 py-4 italic">No options yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminDashboard;