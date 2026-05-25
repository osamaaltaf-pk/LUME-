import jwt from 'jsonwebtoken'

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      message: "Access token required!"
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'lume_fallback_secret_key_12345';

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
    next();

  } catch (error) {
    return res.status(403).json({
      message: "error while verifying the access token"
    })
  }
}

export default verifyAccessToken;