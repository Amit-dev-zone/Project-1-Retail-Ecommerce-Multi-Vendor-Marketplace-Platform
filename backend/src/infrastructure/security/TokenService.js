const jwt = require('jsonwebtoken');

class TokenService {
  constructor(secret, expiresIn) {
    if (!secret) {
      const env = require('../../config/env');
      this.secret = env.JWT_SECRET;
      this.expiresIn = expiresIn || env.JWT_EXPIRES_IN;
    } else {
      this.secret = secret;
      this.expiresIn = expiresIn || '1d';
    }
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Token has expired');
        err.name = 'TokenExpiredError';
        throw err;
      }
      const err = new Error('Invalid token');
      err.name = 'JsonWebTokenError';
      throw err;
    }
  }
}

module.exports = TokenService;
