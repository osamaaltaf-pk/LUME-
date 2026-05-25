import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['scented', 'unscented', 'decorative', 'aromatherapy']
  },
  scent: {
    type: String,
    default: 'unscented'
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'x-large'],
    default: 'medium'
  },
  burnTime: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  images: [{
    type: String // This will store file paths like 'uploads/filename.jpg'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// module.exports = mongoose.model('Product', productSchema);
const Product = mongoose.model('Product', productSchema);

export default Product