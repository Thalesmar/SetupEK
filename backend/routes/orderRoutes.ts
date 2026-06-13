import { Router, Response, Request } from 'express';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { body, validationResult } from 'express-validator';
import { useJsonFallback } from '../db/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const orderRouter = Router();

interface CustomRequest extends Request {
  user?: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getJsonProductsPath = () => {
  const devPath = path.resolve(__dirname, '../db/products.json');
  const prodPath = path.resolve(__dirname, '../../db/products.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const getJsonCartPath = () => {
  const devPath = path.resolve(__dirname, '../db/cart.json');
  const prodPath = path.resolve(__dirname, '../../db/cart.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const getJsonOrdersPath = () => {
  const devPath = path.resolve(__dirname, '../db/orders.json');
  const prodPath = path.resolve(__dirname, '../../db/orders.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const readOrdersJson = async (): Promise<any[]> => {
  try {
    const data = await fs.readFile(getJsonOrdersPath(), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeOrdersJson = async (orders: any[]) => {
  await fs.writeFile(getJsonOrdersPath(), JSON.stringify(orders, null, 2), 'utf-8');
};

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required').escape(),
  body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required').escape(),
  body('shippingAddress.email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required').escape(),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required').escape(),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required').escape(),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required').escape(),
  body('shippingAddress.region').trim().notEmpty().withMessage('Region is required').escape(),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required').escape(),
];

const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// Place a new order (secured)
orderRouter.post('/orders', verifyToken, orderValidation, handleValidationErrors, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    const { items, subtotal, total, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place order with an empty cart' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing shipping address or payment method' });
    }

    // 1. Verify stock availability and decrement
    if (useJsonFallback) {
      try {
        const prodData = await fs.readFile(getJsonProductsPath(), 'utf-8');
        const productsList = JSON.parse(prodData);

        for (const item of items) {
          const product = productsList.find((p: any) => p.id === Number(item.id));
          if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.id} not found` });
          }

          if (typeof product.stock === 'number') {
            if (product.stock < item.quantity) {
              return res.status(400).json({ message: `Insufficient stock for product ${product.title}` });
            }
            product.stock -= item.quantity;
            if (product.stock <= 0) {
              product.inStock = false;
            }
          } else if (product.stock === 'Pre-order') {
            // Pre-order ignores stock decrement limits
          } else if (!product.inStock) {
            return res.status(400).json({ message: `Product ${product.title} is out of stock` });
          }
        }
        // Save updated product stocks back to JSON
        await fs.writeFile(getJsonProductsPath(), JSON.stringify(productsList, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error updating products JSON stock fallback:', err);
        return res.status(500).json({ message: 'Failed to complete stock checks' });
      }
    } else {
      // MongoDB Stock check
      for (const item of items) {
        const product = await Product.findOne({ id: Number(item.id) });
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.id} not found` });
        }

        if (typeof product.stock === 'number') {
          if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for product ${product.title}` });
          }
          product.stock -= item.quantity;
          if (product.stock <= 0) {
            product.inStock = false;
          }
          await product.save();
        } else if (product.stock === 'Pre-order') {
          // Pre-orders ignore stock decrement limits
        } else if (!product.inStock) {
          return res.status(400).json({ message: `Product ${product.title} is out of stock` });
        }
      }
    }

    // 2. Generate a unique order ID
    // Format: #EK-2025-XXXX (4 random digits)
    let orderId = '';
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      orderId = `#EK-2025-${randNum}`;
      
      if (useJsonFallback) {
        const allOrdersList = await readOrdersJson();
        const existing = allOrdersList.find((o: any) => o.id === orderId);
        if (!existing) isUnique = true;
      } else {
        const existingOrder = await Order.findOne({ id: orderId });
        if (!existingOrder) {
          isUnique = true;
        }
      }
    }

    // 3. Create order document
    const createdAtStr = new Date().toISOString();
    let finalOrder: any = null;

    if (useJsonFallback) {
      const allOrdersList = await readOrdersJson();
      finalOrder = {
        id: orderId,
        userId,
        items,
        subtotal,
        total,
        shippingAddress,
        paymentMethod,
        status: 'processing',
        createdAt: createdAtStr,
      };
      allOrdersList.push(finalOrder);
      await writeOrdersJson(allOrdersList);

      // Clear JSON cart
      try {
        const cartData = await fs.readFile(getJsonCartPath(), 'utf-8');
        const allCarts = JSON.parse(cartData);
        allCarts[userId] = [];
        await fs.writeFile(getJsonCartPath(), JSON.stringify(allCarts, null, 2), 'utf-8');
      } catch (err) {}
    } else {
      const newOrder = new Order({
        id: orderId,
        userId,
        items,
        subtotal,
        total,
        shippingAddress,
        paymentMethod,
        status: 'processing',
        createdAt: createdAtStr,
      });

      await newOrder.save();
      finalOrder = newOrder;

      // Clear user's cart in MongoDB
      const userCart = await Cart.findOne({ userId });
      if (userCart) {
        userCart.items = [];
        await userCart.save();
      }
    }

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: finalOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Failed to place order. Please try again!' });
  }
});

// Fetch order history of the logged-in user (secured)
orderRouter.get('/orders', verifyToken, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    let orders: any[] = [];

    if (useJsonFallback) {
      const allOrdersList = await readOrdersJson();
      orders = allOrdersList.filter((o: any) => o.userId === userId);
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      message: 'Orders loaded successfully',
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Server error fetching order history' });
  }
});

export default orderRouter;
