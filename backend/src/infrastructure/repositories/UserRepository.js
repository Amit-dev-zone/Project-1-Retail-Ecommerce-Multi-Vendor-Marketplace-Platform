const UserModel = require('../models/UserModel');
const { User } = require('../../domain/entities/User');

class UserRepository {
  constructor(model = UserModel) {
    this.model = model;
  }

  _toEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findByEmail(email) {
    const doc = await this.model.findOne({ email: email.toLowerCase().trim() });
    return this._toEntity(doc);
  }

  async findById(id) {
    const doc = await this.model.findById(id);
    return this._toEntity(doc);
  }

  async existsByEmail(email) {
    const count = await this.model.countDocuments({ email: email.toLowerCase().trim() });
    return count > 0;
  }

  async create({ name, email, passwordHash, role, isActive = true }) {
    const doc = await this.model.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isActive,
    });
    return this._toEntity(doc);
  }

  async update(id, updateData) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    return this._toEntity(doc);
  }
}

module.exports = UserRepository;
