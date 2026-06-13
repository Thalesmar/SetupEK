import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const CartSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  items: [CartItemSchema],
});

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
