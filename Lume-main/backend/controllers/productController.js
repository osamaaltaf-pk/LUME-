import { supabase } from '../config/supabase.js';

// Helper to format products for frontend compatibility
const formatProduct = (p) => {
  if (!p) return null;
  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    scent: p.scent,
    size: p.size,
    burnTime: p.burn_time,
    inStock: p.in_stock,
    stockQuantity: p.stock_quantity,
    images: p.images || [],
    // In original code: populate('createdBy', 'username')
    createdBy: p.created_by?.username ? { username: p.created_by.username } : p.created_by,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin only
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      scent,
      size,
      burnTime,
      stockQuantity,
    } = req.body;

    const createdBy = req.user?.user_id || req.user?.userId;

    if (!createdBy) {
      return res.status(400).json({
        message: 'User ID not found in request'
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Support URL strings (if files failed or user provided URLs)
    if (req.body.images) {
      const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      images = [...new Set([...images, ...bodyImages])];
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: Number(price),
        category,
        scent,
        size,
        burn_time: burnTime,
        stock_quantity: Number(stockQuantity || 0),
        in_stock: Number(stockQuantity || 0) > 0,
        images,
        created_by: createdBy
      })
      .select('*, created_by:users(username)')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Product created successfully',
      product: formatProduct(product)
    });

  } catch (error) {
    console.error('❌ Product creation error:', error);
    res.status(500).json({
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, created_by:users(username)')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedProducts = products.map(p => formatProduct(p));

    res.json({
      count: formattedProducts.length,
      products: formattedProducts
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, created_by:users(username)')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: formatProduct(product) });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin only
export const updateProduct = async (req, res) => {
  try {
    const { data: checkProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!checkProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Map camelCase update request body to snake_case
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.scent !== undefined) updateData.scent = req.body.scent;
    if (req.body.size !== undefined) updateData.size = req.body.size;
    if (req.body.burnTime !== undefined) updateData.burn_time = req.body.burnTime;
    if (req.body.inStock !== undefined) updateData.in_stock = req.body.inStock;
    if (req.body.stockQuantity !== undefined) {
      updateData.stock_quantity = Number(req.body.stockQuantity);
      updateData.in_stock = Number(req.body.stockQuantity) > 0;
    }
    if (req.body.images !== undefined) updateData.images = req.body.images;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select('*, created_by:users(username)')
      .single();

    if (updateError) throw updateError;

    res.json({
      message: 'Product updated successfully',
      product: formatProduct(updatedProduct)
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin only
export const deleteProduct = async (req, res) => {
  try {
    const { data: checkProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', req.params.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!checkProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    });
  }
};
