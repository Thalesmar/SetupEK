import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { Cart } from '../models/Cart.js';
import { useJsonFallback } from '../db/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const cartRouter = Router();

interface CustomRequest extends Request {
  user?: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getJsonCartPath = () => {
  const devPath = path.resolve(__dirname, '../db/cart.json');
  const prodPath = path.resolve(__dirname, '../../db/cart.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const readCartJson = async (userId: string): Promise<any[]> => {
  try {
    const data = await fs.readFile(getJsonCartPath(), 'utf-8');
    const allCarts = JSON.parse(data);
    if (Array.isArray(allCarts)) return [];
    return allCarts[userId] || [];
  } catch (err) {
    return [];
  }
};

const writeCartJson = async (userId: string, items: any[]) => {
  let allCarts: any = {};
  try {
    const data = await fs.readFile(getJsonCartPath(), 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      allCarts = parsed;
    }
  } catch (err) {}
  allCarts[userId] = items;
  await fs.writeFile(getJsonCartPath(), JSON.stringify(allCarts, null, 2), 'utf-8');
};

// Add item to cart (secured)
cartRouter.post('/cart/add', verifyToken, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    const { id, name, price, quantity, image } = req.body;

    if (!id || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Invalid cart data' });
    }

    let items: any[] = [];

    if (useJsonFallback) {
      items = await readCartJson(userId);
      const existingItem = items.find((item: any) => item.id === String(id));

      if (existingItem) {
        if (name) {
          existingItem.quantity += quantity;
        } else {
          existingItem.quantity = quantity;
        }
      } else {
        if (!name || (typeof price !== 'string' && typeof price !== 'number')) {
          return res.status(400).json({ message: 'Missing product details for new item' });
        }
        items.push({
          id: String(id),
          name,
          price: String(price),
          quantity,
          image: image || '',
        });
      }
      await writeCartJson(userId, items);
    } else {
      let userCart = await Cart.findOne({ userId });

      if (!userCart) {
        userCart = new Cart({ userId, items: [] });
      }

      const existingItem = userCart.items.find((item: any) => item.id === String(id));

      if (existingItem) {
        if (name) {
          existingItem.quantity += quantity;
        } else {
          existingItem.quantity = quantity;
        }
      } else {
        if (!name || (typeof price !== 'string' && typeof price !== 'number')) {
          return res.status(400).json({ message: 'Missing product details for new item' });
        }

        userCart.items.push({
          id: String(id),
          name,
          price: String(price),
          quantity,
          image: image || '',
        });
      }

      await userCart.save();
      items = userCart.items;
    }

    return res.status(200).json({
      message: 'Product added to cart successfully.',
      cart: items,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Failed to add product to cart. Try again!' });
  }
});

// Get user's cart (secured)
cartRouter.get('/cart', verifyToken, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    let items: any[] = [];

    if (useJsonFallback) {
      items = await readCartJson(userId);
    } else {
      const userCart = await Cart.findOne({ userId });
      items = userCart ? userCart.items : [];
    }

    return res.status(200).json({
      message: 'Cart loaded successfully',
      cart: items,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart (secured)
cartRouter.delete('/cart/remove/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    let items: any[] = [];

    if (useJsonFallback) {
      items = await readCartJson(userId);
      items = items.filter((item: any) => item.id !== id);
      await writeCartJson(userId, items);
    } else {
      const userCart = await Cart.findOne({ userId });

      if (userCart) {
        userCart.items = userCart.items.filter((item: any) => item.id !== id);
        await userCart.save();
        items = userCart.items;
      }
    }

    return res.status(200).json({
      message: 'Product successfully removed from the cart',
      cart: items,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Failed to remove product from cart. Try again!' });
  }
});

// Sync local guest cart with user cart upon login (secured)
cartRouter.post('/cart/sync', verifyToken, async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.user;
    const { items } = req.body; // Array of guest cart items

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid sync data format' });
    }

    let finalItems: any[] = [];

    if (useJsonFallback) {
      finalItems = await readCartJson(userId);
      for (const guestItem of items) {
        const existing = finalItems.find((item: any) => item.id === String(guestItem.id));
        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          finalItems.push({
            id: String(guestItem.id),
            name: guestItem.name || guestItem.title,
            price: String(guestItem.price),
            quantity: guestItem.quantity,
            image: guestItem.image || '',
          });
        }
      }
      await writeCartJson(userId, finalItems);
    } else {
      let userCart = await Cart.findOne({ userId });
      if (!userCart) {
        userCart = new Cart({ userId, items: [] });
      }

      for (const guestItem of items) {
        const dbItem = userCart.items.find((item: any) => item.id === String(guestItem.id));
        if (dbItem) {
          dbItem.quantity += guestItem.quantity;
        } else {
          userCart.items.push({
            id: String(guestItem.id),
            name: guestItem.name || guestItem.title,
            price: String(guestItem.price),
            quantity: guestItem.quantity,
            image: guestItem.image || '',
          });
        }
      }

      await userCart.save();
      finalItems = userCart.items;
    }

    return res.status(200).json({
      message: 'Cart synchronized successfully',
      cart: finalItems,
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return res.status(500).json({ message: 'Failed to sync cart' });
  }
});

export default cartRouter;
