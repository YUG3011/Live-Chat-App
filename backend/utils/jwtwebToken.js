// utils/jwtwebToken.js
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const isProd = process.env.NODE_ENV === 'production';

  // For cross-site requests (deployed frontend <> backend), cookies must be
  // sent with `sameSite: 'none'` and `secure: true` (HTTPS). In development
  // we'll use lax/secure=false to keep it simple.
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd, // true in production (HTTPS), false in dev
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
