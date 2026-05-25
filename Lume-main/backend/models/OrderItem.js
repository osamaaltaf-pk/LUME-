import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  // For custom candles
  isCustom: {
    type: Boolean,
    default: false
  },
  color: String,
  scent: String,
  size: String,
  colorName: String,
  scentName: String,
  sizeName: String,
  shape: String,
  shapeName: String
}, {
  timestamps: true
});

export default mongoose.model('OrderItem', orderItemSchema);