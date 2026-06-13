import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  id: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: String, required: true },
  discount: { type: String },
  image: { type: String },
  category: { type: String, required: true },
  sku: { type: String },
  description: { type: String },
  specs: { type: [[String]], default: [] },
  images: { type: [String], default: [] },
  inStock: { type: Boolean, default: true },
  stock: { type: Schema.Types.Mixed }, // Can be a number or string (e.g. "Pre-order")
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
