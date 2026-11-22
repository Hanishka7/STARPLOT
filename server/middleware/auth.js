import jwt from 'jsonwebtoken';
export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};