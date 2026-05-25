import mongoose from 'mongoose';

const customizedProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  scent: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  shape: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  image: String // Store rendered image of customized candle
}, {
  timestamps: true
});

export default mongoose.model('CustomizedProduct', customizedProductSchema);