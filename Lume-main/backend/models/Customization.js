import mongoose from 'mongoose';

const customizationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['color', 'scent', 'size', 'shape', 'base']
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Customization', customizationSchema);