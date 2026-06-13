import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { useJsonFallback } from '../db/db.js';

const productRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getJsonProductsPath = () => {
  const devPath = path.resolve(__dirname, '../db/products.json');
  const prodPath = path.resolve(__dirname, '../../db/products.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

// Get all products (with search, category, brand, sorting, etc.)
productRouter.get('/products', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { search, category, brand, sort, inStock, minPrice, maxPrice } = req.query;
    let products: any[] = [];

    if (useJsonFallback) {
      // JSON File Storage Fallback Mode
      try {
        const data = await fs.readFile(getJsonProductsPath(), 'utf-8');
        products = JSON.parse(data);

        // Filter by Search Query
        if (search) {
          const s = String(search).toLowerCase();
          products = products.filter(p => 
            (p.title && p.title.toLowerCase().includes(s)) ||
            (p.description && p.description.toLowerCase().includes(s)) ||
            (p.brand && p.brand.toLowerCase().includes(s))
          );
        }

        // Filter by Category
        if (category) {
          const cats = (Array.isArray(category) ? category : String(category).split(',')).map(c => String(c).trim().toLowerCase());
          products = products.filter(p => p.category && cats.includes(p.category.toLowerCase()));
        }

        // Filter by Brand
        if (brand) {
          const brands = (Array.isArray(brand) ? brand : String(brand).split(',')).map(b => String(b).trim().toLowerCase());
          products = products.filter(p => p.brand && brands.includes(p.brand.toLowerCase()));
        }

        // Filter by Availability
        if (inStock === 'true') {
          products = products.filter(p => p.inStock === true);
        } else if (inStock === 'false') {
          products = products.filter(p => p.inStock === false);
        }
      } catch (err) {
        console.error('Error reading JSON fallback products:', err);
        return res.status(500).json({ message: 'Error loading product catalog' });
      }
    } else {
      // MongoDB Mode
      const query: any = {};

      if (search) {
        query.$or = [
          { title: { $regex: String(search), $options: 'i' } },
          { description: { $regex: String(search), $options: 'i' } },
          { brand: { $regex: String(search), $options: 'i' } },
        ];
      }

      if (category) {
        const cats = Array.isArray(category) ? category : String(category).split(',');
        query.category = { $in: cats.map(c => new RegExp(`^${String(c).trim()}$`, 'i')) };
      }

      if (brand) {
        const brands = Array.isArray(brand) ? brand : String(brand).split(',');
        query.brand = { $in: brands.map(b => new RegExp(`^${String(b).trim()}$`, 'i')) };
      }

      if (inStock === 'true') {
        query.inStock = true;
      } else if (inStock === 'false') {
        query.inStock = false;
      }

      products = await Product.find(query);
    }

    // In-memory price range filtering (applies to both MongoDB and JSON modes)
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(String(minPrice)) : 0;
      const max = maxPrice ? parseFloat(String(maxPrice)) : Infinity;
      products = products.filter(p => {
        const numericPrice = parseFloat(p.price.replace(/[^\d.]/g, ''));
        return !isNaN(numericPrice) && numericPrice >= min && numericPrice <= max;
      });
    }

    // In-memory sorting (applies to both MongoDB and JSON modes)
    if (sort === 'low') {
      products.sort((a, b) => {
        const pA = parseFloat(a.price.replace(/[^\d.]/g, ''));
        const pB = parseFloat(b.price.replace(/[^\d.]/g, ''));
        return pA - pB;
      });
    } else if (sort === 'high') {
      products.sort((a, b) => {
        const pA = parseFloat(a.price.replace(/[^\d.]/g, ''));
        const pB = parseFloat(b.price.replace(/[^\d.]/g, ''));
        return pB - pA;
      });
    } else if (sort === 'newest') {
      products.sort((a, b) => {
        if (a.discount === 'New' && b.discount !== 'New') return -1;
        if (a.discount !== 'New' && b.discount === 'New') return 1;
        return b.id - a.id;
      });
    }

    return res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get product by ID
productRouter.get('/products/:id', async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);
    let product: any = null;

    if (useJsonFallback) {
      // JSON File Storage Fallback Mode
      try {
        const data = await fs.readFile(getJsonProductsPath(), 'utf-8');
        const productsList = JSON.parse(data);
        product = productsList.find((p: any) => p.id === Number(id) || String(p.id) === String(id));
      } catch (err) {
        console.error('Error reading JSON fallback product by id:', err);
      }
    } else {
      // MongoDB Mode
      product = await Product.findOne({ id: Number(id) });
      if (!product && typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(String(id));
      }
    }

    if (!product) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Product found: ${product.title}`);
    return res.status(200).json({
      message: 'Product fetched successfully',
      product,
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    return res.status(500).json({
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default productRouter;
