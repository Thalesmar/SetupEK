import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  role: { type: String, default: 'user' },
  createdAt: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
