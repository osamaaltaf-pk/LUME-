import { supabase } from '../config/supabase.js';

// Helpers to format database objects for frontend compatibility
const formatCustomization = (c) => {
  if (!c) return null;
  return {
    ...c,
    _id: c.id,
    id: c.id,
    price: Number(c.price),
    inStock: c.in_stock,
    createdAt: c.created_at,
    updatedAt: c.updated_at
  };
};

const formatCustomizedProduct = (cp) => {
  if (!cp) return null;
  return {
    ...cp,
    _id: cp.id,
    id: cp.id,
    user: cp.user_id,
    basePrice: Number(cp.base_price),
    totalPrice: Number(cp.total_price),
    createdAt: cp.created_at,
    updatedAt: cp.updated_at
  };
};

// Get all customization options
export const getCustomizations = async (req, res) => {
  try {
    const { data: customizations, error } = await supabase
      .from('customizations')
      .select('*')
      .eq('in_stock', true);

    if (error) throw error;

    const formatted = customizations.map(c => formatCustomization(c));

    // Group by type
    const grouped = {
      colors: formatted.filter(c => c.type === 'color'),
      scents: formatted.filter(c => c.type === 'scent'),
      sizes: formatted.filter(c => c.type === 'size'),
      shapes: formatted.filter(c => c.type === 'shape'),
      base: formatted.filter(c => c.type === 'base')
    };

    res.json(grouped);
  } catch (error) {
    console.error('❌ Error fetching customizations:', error);
    res.status(500).json({ message: 'Error fetching customizations', error: error.message });
  }
};

// Add customization option (admin)
export const addCustomization = async (req, res) => {
  try {
    const { type, name, value, price } = req.body;

    const { data: customization, error } = await supabase
      .from('customizations')
      .insert({
        type,
        name,
        value,
        price: price || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Customization option added successfully',
      customization: formatCustomization(customization)
    });
  } catch (error) {
    console.error('❌ Error adding customization:', error);
    res.status(500).json({ message: 'Error adding customization', error: error.message });
  }
};

// Create customized candle
export const createCustomizedProduct = async (req, res) => {
  try {
    const { color, scent, size, shape } = req.body;

    // Calculate total price by matching customized option values
    const { data: customizations, error: customsError } = await supabase
      .from('customizations')
      .select('*')
      .in('value', [color, scent, size, shape]);

    if (customsError) throw customsError;

    const basePrice = 15.00; // Base price for custom candle
    const totalPrice = customizations.reduce((total, custom) => total + Number(custom.price), basePrice);

    const { data: customizedProduct, error: insertError } = await supabase
      .from('customized_products')
      .insert({
        user_id: req.user.user_id,
        base_price: basePrice,
        color,
        scent,
        size,
        shape,
        total_price: totalPrice
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      message: 'Custom candle created successfully',
      customizedProduct: formatCustomizedProduct(customizedProduct)
    });
  } catch (error) {
    console.error('❌ Error creating custom candle:', error);
    res.status(500).json({ message: 'Error creating custom candle', error: error.message });
  }
};

// Update customization option
export const updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, price, inStock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (value !== undefined) updateData.value = value;
    if (price !== undefined) updateData.price = Number(price);
    if (inStock !== undefined) updateData.in_stock = inStock;
    updateData.updated_at = new Date().toISOString();

    const { data: customization, error } = await supabase
      .from('customizations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Check if not found
      return res.status(404).json({ message: 'Customization option not found' });
    }

    res.json({
      message: 'Customization option updated successfully',
      customization: formatCustomization(customization)
    });
  } catch (error) {
    console.error('❌ Error updating customization:', error);
    res.status(500).json({ message: 'Error updating customization', error: error.message });
  }
};

// Delete customization option
export const deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: checkData, error: checkError } = await supabase
      .from('customizations')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (checkError) throw checkError;
    if (!checkData) {
      return res.status(404).json({ message: 'Customization option not found' });
    }

    const { error: deleteError } = await supabase
      .from('customizations')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Customization option deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting customization:', error);
    res.status(500).json({ message: 'Error deleting customization', error: error.message });
  }
};