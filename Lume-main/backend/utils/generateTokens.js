import jwt from 'jsonwebtoken';

export const generateAccessToken = (user_id, role) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'lume_fallback_secret_key_12345';
  return jwt.sign({ user_id, role }, secret, {
    expiresIn: '15m'
  })
}

export const generateRefreshToken = (user_id) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'lume_fallback_refresh_key_12345';
  return jwt.sign({ user_id }, secret, {
    expiresIn: '30d'
  })
}

// export default {generateAccessToken, generateRefreshToken}