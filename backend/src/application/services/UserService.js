const { ROLES } = require('../../domain/entities/User');

class UserService {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async register({ name, email, password, role = ROLES.CUSTOMER }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Protect admin role from unauthorized public self-registration
    const assignedRole = role === ROLES.ADMIN ? ROLES.CUSTOMER : role;

    const passwordHash = await this.passwordHasher.hash(password);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      role: assignedRole,
      isActive: true,
    });

    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toPublicJSON(),
      token,
    };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Your account has been deactivated. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toPublicJSON(),
      token,
    };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user.toPublicJSON();
  }
}

module.exports = UserService;
