const { clerkClient } = require('@clerk/clerk-sdk-node');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const session = await clerkClient.sessions.verifySession(token);
    if (!session) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = session.user;
    next();
  } catch (error) {
    next(error);
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const userRole = req.user.publicMetadata.role;
      if (!roles.includes(userRole)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  checkRole
}; 