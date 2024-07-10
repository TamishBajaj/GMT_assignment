const jwt = require('jsonwebtoken');

exports.authenticateJwt = (req, res, next) => {
  const token = req.header('token');
  
  console.log(token);

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.secretKey);

    // Add user to request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
  };
  