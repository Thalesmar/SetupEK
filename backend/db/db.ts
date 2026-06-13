import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportable fallback status
export let useJsonFallback = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('No MONGODB_URI environment variable detected in .env. Falling back to JSON database files.');
    useJsonFallback = true;
    return;
  }

  try {
    console.log(`Connecting to MongoDB...`);
    // Connect with a 5 second connection timeout to fail fast on local if DB is unavailable
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    useJsonFallback = false;
    await seedProducts();
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to JSON database files. Error:', error instanceof Error ? error.message : error);
    useJsonFallback = true;
  }
};

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Product collection already seeded');
      return;
    }

    const productsJsonPath = path.resolve(__dirname, 'products.json');
    console.log(`Reading initial products from: ${productsJsonPath}`);
    const data = await fs.readFile(productsJsonPath, 'utf-8');
    const products = JSON.parse(data);

    if (Array.isArray(products) && products.length > 0) {
      await Product.insertMany(products);
      console.log(`Successfully seeded ${products.length} products into the database`);
    } else {
      console.log('No products found in products.json to seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
