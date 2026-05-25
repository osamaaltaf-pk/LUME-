import jwt from 'jsonwebtoken';

export const generateAccessToken = (user_id, role) => {
  return jwt.sign({ user_id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  })
}

export const generateRefreshToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d'
  })
}

// export default {generateAccessToken, generateRefreshToken}