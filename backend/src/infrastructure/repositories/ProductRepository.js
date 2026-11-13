const ProductModel = require('../models/ProductModel');
const { Product } = require('../../domain/entities/Product');

class ProductRepository {
  constructor(model = ProductModel) {
    this.model = model;
  }

  _toEntity(doc) {
    if (!doc) return null;
    return new Product({
      id: doc._id.toString(),
      vendorId: doc.vendorId.toString(),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      stock: doc.stock,
      category: doc.category,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(productData) {
    const doc = await this.model.create(productData);
    return this._toEntity(doc);
  }

  async findById(id) {
    const doc = await this.model.findById(id);
    return this._toEntity(doc);
  }

  async findByVendorId(vendorId, { status, limit = 20, skip = 0 } = {}) {
    const query = { vendorId };
    if (status) query.status = status;
    const docs = await this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    return docs.map((doc) => this._toEntity(doc));
  }

  async update(id, vendorId, updateData) {
    const query = { _id: id };
    if (vendorId) query.vendorId = vendorId; // vendor isolation check
    const doc = await this.model.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    return this._toEntity(doc);
  }

  async delete(id, vendorId) {
    const query = { _id: id };
    if (vendorId) query.vendorId = vendorId; // vendor isolation check
    const result = await this.model.findOneAndDelete(query);
    return Boolean(result);
  }

  async countByVendor(vendorId, filter = {}) {
    return this.model.countDocuments({ vendorId, ...filter });
  }
}

module.exports = ProductRepository;
