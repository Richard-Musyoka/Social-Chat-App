import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
  console.log('Cookies:', request.cookies);

  const token = request.cookies.jwt; // Replace 'jwt' with the actual cookie name if different
  if (!token) {
    return response.status(401).json({ error: 'Token not found' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
    //   console.error('JWT verification error:', err);
      return response.status(403).json({ error: 'Invalid token' });
    }

    // Attach the user ID to the request object for use in subsequent middleware/routes
    request.userId = payload.userId;

    // Proceed to the next middleware or route handler
    next();
  });
};
