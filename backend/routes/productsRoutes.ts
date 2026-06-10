import express from 'express';
import { readFromProducts } from '../controllers/productsControllers.js';
import { Product } from '../src/types.js';

const productRouter = express.Router();

productRouter.get('/products', async (req, res) => {
  try {
    const products: Product[] = await readFromProducts();
    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

productRouter.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);

    const products: Product[] = await readFromProducts();
    const product = products.find((p) => p.id === Number(id));

    if (!product) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Product found: ${product.title}`);
    res.status(200).json({
      message: 'Product fetched successfully',
      product,
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default productRouter;
