const ROLES = Object.freeze({
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
});

class User {
  constructor({
    id = null,
    name,
    email,
    passwordHash = null,
    role = ROLES.CUSTOMER,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
      throw new Error('User name is required');
    }

    if (!this.email || !User.isValidEmail(this.email)) {
      throw new Error('A valid email address is required');
    }

    if (!Object.values(ROLES).includes(this.role)) {
      throw new Error(`Invalid role: ${this.role}. Allowed roles: ${Object.values(ROLES).join(', ')}`);
    }
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email.toLowerCase().trim());
  }

  isAdmin() {
    return this.role === ROLES.ADMIN;
  }

  isVendor() {
    return this.role === ROLES.VENDOR;
  }

  isCustomer() {
    return this.role === ROLES.CUSTOMER;
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = {
  User,
  ROLES,
};
