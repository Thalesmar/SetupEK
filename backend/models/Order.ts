import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const ShippingAddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  region: { type: String, required: true },
});

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true }, // Order format: #EK-2025-XXXX
  userId: { type: String, required: true, index: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered'] },
  createdAt: { type: String, required: true },
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
