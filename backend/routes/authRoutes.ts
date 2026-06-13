import express from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import { body, validationResult } from 'express-validator';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { useJsonFallback } from '../db/db.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getJsonUsersPath = () => {
  const devPath = path.resolve(__dirname, '../db/users.json');
  const prodPath = path.resolve(__dirname, '../../db/users.json');
  return __dirname.replace(/\\/g, '/').includes('/dist/') ? prodPath : devPath;
};

const readUsersJson = async (): Promise<any[]> => {
  try {
    const data = await fs.readFile(getJsonUsersPath(), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON users fallback file:', err);
    return [];
  }
};

const writeUsersJson = async (users: any[]) => {
  await fs.writeFile(getJsonUsersPath(), JSON.stringify(users, null, 2), 'utf-8');
};

// Validation rules
const signupValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').escape(),
  body('secondName').trim().notEmpty().withMessage('Last name is required').escape(),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').escape(),
  body('secondName').trim().notEmpty().withMessage('Last name is required').escape(),
  body('phone').trim().escape(),
  body('city').trim().escape(),
];

const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// Signup route
router.post('/signup', signupValidation, handleValidationErrors, async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { firstName, secondName, email, password } = req.body;
    let userExist: any = null;

    if (useJsonFallback) {
      const userData = await readUsersJson();
      userExist = userData.find((u: any) => u.email === email);
    } else {
      userExist = await User.findOne({ email });
    }

    if (userExist) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdAtStr = new Date().toISOString();

    let savedUser: any = null;

    if (useJsonFallback) {
      const userData = await readUsersJson();
      const newUserId = randomUUID();
      savedUser = {
        id: newUserId,
        firstName,
        secondName,
        email,
        password: hashedPassword,
        phone: '',
        city: '',
        role: 'user',
        createdAt: createdAtStr,
      };
      userData.push(savedUser);
      await writeUsersJson(userData);
    } else {
      const newUser = new User({
        id: randomUUID(),
        firstName,
        secondName,
        email,
        password: hashedPassword,
        phone: '',
        city: '',
        role: 'user',
        createdAt: createdAtStr,
      });
      await newUser.save();
      savedUser = newUser;
    }

    return res.status(201).json({
      message: 'Account successfully created',
      user: {
        firstName: savedUser.firstName,
        secondName: savedUser.secondName,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('[signup] Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Account route (protected)
router.get('/account', verifyToken, async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { userId } = req.user as { userId: string; email: string };
    let user: any = null;

    if (useJsonFallback) {
      const userData = await readUsersJson();
      user = userData.find((u: any) => u.id === userId);
    } else {
      user = await User.findOne({ id: userId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Account route accessed',
      user: {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[account] Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update profile details (protected)
router.put('/account/update', verifyToken, updateProfileValidation, handleValidationErrors, async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { userId } = req.user as { userId: string; email: string };
    const { firstName, secondName, phone, city } = req.body;
    let updatedUser: any = null;

    if (useJsonFallback) {
      const userData = await readUsersJson();
      const userIndex = userData.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      userData[userIndex].firstName = firstName;
      userData[userIndex].secondName = secondName;
      userData[userIndex].phone = phone || '';
      userData[userIndex].city = city || '';
      await writeUsersJson(userData);
      updatedUser = userData[userIndex];
    } else {
      updatedUser = await User.findOneAndUpdate(
        { id: userId },
        { firstName, secondName, phone, city },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        firstName: updatedUser.firstName,
        secondName: updatedUser.secondName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Profile helper
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user,
  });
});

// Login route
router.post('/login', loginValidation, handleValidationErrors, async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    let user: any = null;

    if (useJsonFallback) {
      const userData = await readUsersJson();
      user = userData.find((u: any) => u.email === email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password. Try again!' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is missing from environment variables');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || '1h') as any }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('[login] Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
