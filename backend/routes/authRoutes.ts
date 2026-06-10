import express from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import {
  readUsersData,
  writeUsersData,
  User,
} from '../controllers/authControllers.js';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

//signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, secondName, email, password, role, createdAt } = req.body;

    if (!firstName || !secondName || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const userData = await readUsersData();

    if (!userData) {
      return res.status(500).json({ message: 'Could not read users database' });
    }

    const userExist = userData.find((u) => u.email === email);

    if (userExist) {
      return res.status(409).json({ message: 'User already exist' });
    }

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: randomUUID(),
      firstName,
      secondName,
      email,
      password: hashedpassword,
      role: 'user',
      createdAt : new Date().toISOString(),
    };

    userData.push(newUser);
    await writeUsersData(userData);

    res.status(201).json({
      message: 'Account successfully created',
      user: { firstName, secondName, email, role, createdAt },
    });
  } catch (error) {
    console.error('[signup] Server error:', error);
    res.status(500).json({ message: 'Server error', detail: error instanceof Error ? error.message : String(error) });
  }
});

router.get('/account', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user as { userId: string; email: string };
    const userData = await readUsersData();
    const user = userData.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Account route accessed',
      user: {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//import middleware
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user,
  });
});

//login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const userData = await readUsersData();

    const user = userData.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: 'user do not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password. Try again!' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('[login] Server error:', error);
    return res.status(500).json({ message: 'Server error', detail: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
