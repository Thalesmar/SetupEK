import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. Get the Authorization header from the request
  // Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  const authHeader = req.headers.authorization;

  // 2. If there is no Authorization header → block request
  if (!authHeader) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  // 3. Extract token from "Bearer TOKEN"
  // authHeader.split(' ') gives:
  // ["Bearer", "eyJhbGciOiJIUzI1NiIs..."]
  const token = authHeader.split(' ')[1];

  // 4. If token is missing or format is wrong → block request
  if (!token) {
    return res.status(401).json({
      message: 'Invalid',
    });
  }

  try {
    // 5. Verify token using secret key
    // If token is valid → returns decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // 6. Attach decoded user data to request object
    // Example: req.user = { userId: "...", email: "..." }
    req.user = decoded;

    // 7. Allow request to continue to next function (route handler)
    next();
    // 8. If token is invalid or expired → block request
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
